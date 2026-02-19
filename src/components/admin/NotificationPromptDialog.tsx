import { useEffect, useRef, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const NOTIFICATION_SESSION_KEY = 'notification_prompt_shown_this_session';

export default function NotificationPromptDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const hasInitialized = useRef(false);
  
  const { 
    isSupported, 
    subscribe, 
    isiOS,
    isPWA,
    isInIframe
  } = usePushNotifications();

  useEffect(() => {
    const initializeNotifications = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      
      console.log('[NotificationDialog] Inizializzazione...');
      
      // Non mostrare in iframe
      if (isInIframe) {
        console.log('[NotificationDialog] In iframe, skip');
        return;
      }
      
      // Non mostrare su iOS se non in PWA mode
      if (isiOS && !isPWA) {
        console.log('[NotificationDialog] iOS non in PWA, skip');
        return;
      }
      
      // Controlla se il prompt è già stato mostrato in questa sessione
      const promptAlreadyShown = sessionStorage.getItem(NOTIFICATION_SESSION_KEY);
      if (promptAlreadyShown) {
        console.log('[NotificationDialog] Prompt già mostrato in questa sessione, skip');
        return;
      }
      
      // Mostra il dialog solo se non è mai stato mostrato
      console.log('[NotificationDialog] Mostro dialog per la prima volta');
      setIsOpen(true);
    };
    
    // Delay per permettere al componente di stabilizzarsi
    const timer = setTimeout(initializeNotifications, 1000);
    return () => clearTimeout(timer);
  }, [isiOS, isPWA, isInIframe]);

  const handleEnable = async () => {
    setIsEnabling(true);
    try {
      console.log('[NotificationDialog] Abilitazione notifiche...');
      
      // Flusso completo di abilitazione
      await subscribe();
      
      // Aggiorna profilo
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ notifications_enabled: true })
          .eq('id', user.id);
        console.log('[NotificationDialog] Profilo aggiornato: notifications_enabled = true');
      }
      
      // Salva che il prompt è stato mostrato in questa sessione
      sessionStorage.setItem(NOTIFICATION_SESSION_KEY, 'true');
      
      toast.success('Notifiche abilitate con successo!');
      setIsOpen(false);
    } catch (error) {
      console.error('[NotificationDialog] Errore abilitazione:', error);
      toast.error(error instanceof Error ? error.message : 'Errore durante l\'abilitazione');
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDecline = () => {
    console.log('[NotificationDialog] Utente ha rifiutato le notifiche');
    // Salva che il prompt è stato mostrato in questa sessione
    sessionStorage.setItem(NOTIFICATION_SESSION_KEY, 'true');
    setIsOpen(false);
  };

  // Non renderizzare nulla in iframe o su iOS non-PWA
  if (isInIframe || (isiOS && !isPWA)) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-foreground">
            Notifiche non abilitate
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Vuoi abilitare le notifiche push per ricevere aggiornamenti in tempo reale 
            anche quando l'app è chiusa?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={handleDecline}
            className="w-full sm:w-auto"
          >
            No grazie
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEnable}
            disabled={isEnabling || !isSupported}
            className="w-full sm:w-auto"
          >
            {isEnabling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Attivazione...
              </>
            ) : (
              'Sì, abilita'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
