import { useState, useEffect } from 'react';
import { Bell, BellOff, Download, Smartphone, TestTube2, AlertTriangle, CheckCircle, Bug, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  const { 
    isSupported, 
    isSubscribed, 
    isLoading, 
    subscribe, 
    unsubscribe, 
    sendTestNotification,
    permission,
    isiOS,
    isPWA,
    isInIframe,
    logs,
    clearLogs,
    openInNewWindow
  } = usePushNotifications();

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success('App installata con successo!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.info('Per installare, usa il menu del browser → "Aggiungi alla schermata Home"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Installazione in corso...');
    }
    setDeferredPrompt(null);
  };

  const handleNotificationToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
        toast.success('Notifiche disattivate');
      } else {
        await subscribe();
        toast.success('Notifiche attivate!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Errore');
    }
  };

  const handleTestNotification = async () => {
    if (!isSubscribed) {
      toast.error('Prima attiva le notifiche');
      return;
    }
    try {
      await sendTestNotification('🔔 Test Notifica', 'Le notifiche funzionano correttamente!');
      toast.success('Notifica di test inviata!');
    } catch (error) {
      toast.error('Errore nell\'invio della notifica');
    }
  };

  const showIOSWarning = isiOS && !isPWA;

  return (
    <Card className="glass-card">
      <CardHeader className="py-2 px-3">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Smartphone className="w-4 h-4" />
          App & Notifiche Push
        </CardTitle>
        <CardDescription className="text-xs">
          Installa l'app e gestisci le notifiche push
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        {/* Iframe Warning */}
        {isInIframe && (
          <Alert className="border-orange-500/50 bg-orange-500/10 py-2">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            <AlertDescription className="text-orange-200 text-xs">
              <strong>Attenzione:</strong> L'app è in un iframe.
              <Button 
                variant="link" 
                className="text-orange-300 p-0 h-auto ml-1 text-xs"
                onClick={openInNewWindow}
              >
                Apri in nuova finestra
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* iOS PWA Warning */}
        {showIOSWarning && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10 py-2">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            <AlertDescription className="text-yellow-200 text-xs">
              <strong>iOS:</strong> Per notifiche, installa prima come PWA:
              <ol className="list-decimal ml-3 mt-1 space-y-0.5 text-[10px]">
                <li>Tocca <strong>Condividi</strong></li>
                <li>Seleziona <strong>"Aggiungi a schermata Home"</strong></li>
                <li>Apri dalla Home e attiva notifiche</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* PWA Install */}
        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <div>
              <p className="font-medium text-xs">Installa App</p>
              <p className="text-[10px] text-muted-foreground">
                {isInstalled || isPWA ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-2.5 h-2.5" /> Installata
                  </span>
                ) : (
                  'Accesso rapido'
                )}
              </p>
            </div>
          </div>
          <Button 
            variant={isInstalled || isPWA ? "outline" : "default"}
            size="sm"
            className="h-6 text-xs px-2"
            onClick={handleInstall}
            disabled={isInstalled || isPWA}
          >
            {isInstalled || isPWA ? 'OK' : 'Installa'}
          </Button>
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <Bell className="w-4 h-4 text-green-500" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-xs">Notifiche Push</p>
              <p className="text-[10px] text-muted-foreground">
                {!isSupported 
                  ? showIOSWarning 
                    ? 'Installa PWA prima'
                    : 'Non supportate'
                  : permission === 'denied'
                  ? 'Permesso negato'
                  : isSubscribed 
                  ? (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-2.5 h-2.5" /> Attive
                    </span>
                  )
                  : 'Disattivate'}
              </p>
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleNotificationToggle}
            disabled={isLoading || !isSupported || permission === 'denied'}
            className="scale-75"
          />
        </div>

        {/* Test Notification Button */}
        {isSubscribed && (
          <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-blue-400" />
              <div>
                <p className="font-medium text-xs">Test Notifica</p>
                <p className="text-[10px] text-muted-foreground">
                  Invia prova
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={handleTestNotification}
              disabled={isLoading || !isSubscribed}
            >
              {isLoading ? '...' : 'Testa'}
            </Button>
          </div>
        )}

        {/* Support info */}
        {!isSupported && !showIOSWarning && (
          <p className="text-[10px] text-yellow-500 text-center">
            ⚠️ Richiede browser moderno
          </p>
        )}

        {/* Debug Section */}
        <Collapsible open={showDebug} onOpenChange={setShowDebug}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full gap-1 h-6 text-[10px]">
              <Bug className="w-3 h-3" />
              {showDebug ? 'Nascondi' : 'Debug'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-2 bg-gray-800/50 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-400">Log</span>
                <Button variant="ghost" size="sm" onClick={clearLogs} className="h-5 px-1">
                  <Trash2 className="w-2.5 h-2.5" />
                </Button>
              </div>
              <div className="text-[10px] font-mono text-gray-400 space-y-0.5">
                <p>iOS: {isiOS.toString()} | PWA: {isPWA.toString()}</p>
                <p>Supported: {isSupported.toString()} | Sub: {isSubscribed.toString()}</p>
              </div>
              {logs.length > 0 && (
                <ScrollArea className="h-24 mt-1">
                  <div className="text-[10px] font-mono text-gray-300 space-y-0.5">
                    {logs.map((log, i) => (
                      <p key={i} className="break-all">{log}</p>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
