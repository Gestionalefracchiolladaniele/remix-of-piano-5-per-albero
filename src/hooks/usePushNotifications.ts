import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// @ts-ignore - PushManager types not available in all TS configs
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isiOS, setIsiOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [swStatus, setSwStatus] = useState<'unknown' | 'registered' | 'not-registered'>('unknown');
  const [currentSubscription, setCurrentSubscription] = useState<PushSubscription | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[Push] ${message}`);
  };

  useEffect(() => {
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
    if (inIframe) {
      addLog('⚠️ App in iframe - le notifiche potrebbero non funzionare');
    }

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream;
    setIsiOS(isIOSDevice);

    const isPWAMode = window.matchMedia('(display-mode: standalone)').matches || 
                      (navigator as unknown as { standalone: boolean }).standalone === true;
    setIsPWA(isPWAMode);

    const checkSupport = () => {
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasPushManager = 'PushManager' in window;
      const hasNotification = 'Notification' in window;

      addLog(`ServiceWorker: ${hasServiceWorker}, PushManager: ${hasPushManager}, Notification: ${hasNotification}`);
      addLog(`iOS: ${isIOSDevice}, PWA: ${isPWAMode}, Iframe: ${inIframe}`);

      if (isIOSDevice && !isPWAMode) {
        addLog('⚠️ iOS rilevato ma non in modalità PWA - notifiche non supportate');
        setIsSupported(false);
        return;
      }

      setIsSupported(hasServiceWorker && hasPushManager && hasNotification);
    };

    checkSupport();

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    checkSwStatus();
    checkSubscription();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'PUSH_RECEIVED') {
          addLog(`📨 Notifica ricevuta: ${event.data.payload.title}`);
        }
      });
    }
  }, []);

  const checkSwStatus = async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        setSwStatus('not-registered');
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
      setSwStatus(registration ? 'registered' : 'not-registered');
      if (registration) {
        addLog(`✅ SW registrato: ${registration.active?.state || 'waiting'}`);
      }
    } catch {
      setSwStatus('not-registered');
    }
  };

  const checkSubscription = async () => {
    try {
      if (!('serviceWorker' in navigator)) return;

      const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
      if (!registration) {
        setIsSubscribed(false);
        return;
      }
      // @ts-ignore
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
      setCurrentSubscription(subscription);
      if (subscription) {
        addLog('✅ Sottoscrizione esistente trovata');
      }
    } catch (error) {
      console.error('[Push] Error checking subscription:', error);
      setIsSubscribed(false);
    }
  };

  const subscribe = useCallback(async () => {
    // Check support direttamente invece di usare lo state
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasPushManager = 'PushManager' in window;
    const hasNotification = 'Notification' in window;
    
    if (!hasServiceWorker || !hasPushManager || !hasNotification) {
      throw new Error('Push notifications are not supported');
    }

    setIsLoading(true);
    addLog('🔄 Avvio sottoscrizione...');

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      addLog(`📋 Permesso: ${perm}`);

      if (perm !== 'granted') {
        throw new Error('Permesso notifiche negato');
      }

      addLog('📝 Registrazione Service Worker...');
      const registration = await navigator.serviceWorker.register('/sw-push.js', {
        scope: '/'
      });

      addLog(`✅ Service Worker registrato: ${registration.scope}`);

      await navigator.serviceWorker.ready;
      addLog('✅ Service Worker pronto');

      addLog('🔑 Recupero chiave VAPID...');
      const { data: vapidData, error: vapidError } = await supabase.functions.invoke('get-vapid-key');

      if (vapidError || !vapidData?.vapidPublicKey) {
        addLog(`❌ Errore VAPID: ${vapidError?.message || 'Chiave non trovata'}`);
        throw new Error('Impossibile recuperare la chiave VAPID');
      }

      const vapidKey = vapidData.vapidPublicKey;
      addLog('✅ Chiave VAPID ottenuta');

      addLog('📲 Sottoscrizione push...');
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);
      // @ts-ignore
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer
      });

      addLog('✅ Sottoscrizione push creata');

      const p256dhKey = subscription.getKey('p256dh');
      const authKey = subscription.getKey('auth');

      if (!p256dhKey || !authKey) {
        throw new Error('Failed to get subscription keys');
      }

      const p256dh = btoa(String.fromCharCode(...new Uint8Array(p256dhKey)));
      const auth = btoa(String.fromCharCode(...new Uint8Array(authKey)));

      addLog('💾 Salvataggio nel database...');
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          endpoint: subscription.endpoint,
          p256dh,
          auth
        }, {
          onConflict: 'endpoint'
        });

      if (error) {
        console.error('[Push] Error storing subscription:', error);
        addLog(`❌ Errore DB: ${error.message}`);
        throw error;
      }

      setIsSubscribed(true);
      setCurrentSubscription(subscription);
      addLog('🎉 Sottoscrizione completata con successo!');

    } catch (error) {
      console.error('[Push] Error subscribing:', error);
      addLog(`❌ Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    addLog('🔄 Annullamento sottoscrizione...');

    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
      if (!registration) {
        setIsSubscribed(false);
        return;
      }
      // @ts-ignore
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);

        addLog('✅ Sottoscrizione annullata');
      }

      setIsSubscribed(false);
      setCurrentSubscription(null);

    } catch (error) {
      console.error('[Push] Error unsubscribing:', error);
      addLog(`❌ Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forceRefreshSubscription = useCallback(async () => {
    // Check support direttamente invece di usare lo state
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasPushManager = 'PushManager' in window;
    const hasNotification = 'Notification' in window;
    
    if (!hasServiceWorker || !hasPushManager || !hasNotification) {
      addLog('⚠️ Push non supportato, skip force refresh');
      return;
    }
    
    try {
      addLog('🔄 Force refresh: disattivazione notifiche...');
      
      // Step 1: Disattiva (esattamente come il click su "Disattiva")
      const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
      if (registration) {
        // @ts-ignore
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', subscription.endpoint);
        }
      }
      
      setIsSubscribed(false);
      setCurrentSubscription(null);
      addLog('✅ Notifiche disattivate');
      
      // Piccolo delay per simulare il comportamento manuale
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Riattiva (esattamente come il click su "Attiva")
      addLog('🔄 Force refresh: riattivazione notifiche...');
      await subscribe();
      
      addLog('🎉 Force refresh completato!');
    } catch (error) {
      addLog(`❌ Errore force refresh: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      throw error;
    }
  }, [subscribe]);

  const sendTestNotification = useCallback(async (title: string, body: string) => {
    if (!currentSubscription) {
      throw new Error('Non sei sottoscritto alle notifiche');
    }

    addLog(`📤 Invio notifica: "${title}" - "${body}"`);

    try {
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          endpoint: currentSubscription.endpoint,
          title,
          body
        }
      });

      if (error) {
        throw error;
      }

      addLog(`✅ Risposta: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      console.error('[Push] Error sending notification:', error);
      addLog(`❌ Errore invio: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      throw error;
    }
  }, [currentSubscription]);

  const clearLogs = () => setLogs([]);

  const openInNewWindow = () => {
    const url = window.location.origin + window.location.pathname;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    isiOS,
    isPWA,
    isInIframe,
    swStatus,
    logs,
    subscribe,
    unsubscribe,
    forceRefreshSubscription,
    sendTestNotification,
    clearLogs,
    openInNewWindow
  };
}
