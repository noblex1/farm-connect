import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowInstallBanner(true);
      console.log('💾 Install prompt captured');
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('⚠️ Install prompt not available');
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('❌ User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallBanner) {
    return null;
  }

  // Check if dismissed in this session
  if (sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-gentle-rise md:bottom-4 md:left-auto md:right-4 md:w-96">
      <Card className="border-2 border-primary bg-surface-leaf p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary text-2xl text-primary-foreground">
            🌾
          </div>
          <div className="flex-1">
            <h3 className="font-black text-foreground">Install Farm Market</h3>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Install our app for quick access and offline support!
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleInstallClick}
                variant="farm"
                size="sm"
                className="rounded-xl font-bold"
              >
                <Download className="mr-2 size-4" />
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
