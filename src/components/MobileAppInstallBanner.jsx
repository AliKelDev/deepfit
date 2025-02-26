import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronRight } from 'lucide-react';

const MobileAppInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  useEffect(() => {
    // Check if user is on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if the app is already installed (in standalone mode or PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone || 
                         document.referrer.includes('android-app://');
    
    // Only show banner if on mobile and not already installed
    if (isMobile && !isStandalone) {
      // Wait a few seconds before showing the banner
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    // Listen for beforeinstallprompt event to capture the deferred prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the banner
      setShowBanner(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // Handle the install action
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // We've used the prompt, and can't use it again, discard it
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      setShowBanner(false);
      // If iOS, show a hint how to add to home screen
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        alert("To install this app on your iOS device: tap the share icon, then 'Add to Home Screen'");
      }
    }
  };
  
  if (!showBanner) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl z-50"
      >
        <div className="p-4 flex items-center">
          <div className="mr-4">
            <div className="bg-[#4A90E2] text-white p-2 rounded-full">
              <Download className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Install Max AI Coach</h3>
            <p className="text-sm text-gray-600">Add to home screen for the best experience</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowBanner(false)} 
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleInstallClick}
              className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg flex items-center gap-1"
            >
              Install <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileAppInstallBanner;