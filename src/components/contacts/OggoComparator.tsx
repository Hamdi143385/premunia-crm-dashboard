
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calculator } from 'lucide-react';

const OggoComparator = () => {
  const [isComparatorVisible, setComparatorVisible] = useState(false);

  useEffect(() => {
    if (!isComparatorVisible) {
      return;
    }

    // Vérifier si le script n'est pas déjà chargé
    if (document.querySelector('script[src="https://cks.oggo-data.net/icomparator/health.js"]')) {
      return;
    }

    // Création et ajout du script
    const script = document.createElement('script');
    script.src = 'https://cks.oggo-data.net/icomparator/health.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Nettoyage du script si le composant est démonté
      const existingScript = document.querySelector('script[src="https://cks.oggo-data.net/icomparator/health.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isComparatorVisible]);

  return (
    <Dialog open={isComparatorVisible} onOpenChange={setComparatorVisible}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2"
          onClick={() => setComparatorVisible(true)}
        >
          <Calculator className="h-4 w-4" />
          <span>Comparer les Offres de Mutuelle</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Comparateur d'offres de mutuelle Oggo Data</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div 
            id="oggodata-icomparator-health" 
            style={{ 
              width: '100%', 
              height: '75vh',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OggoComparator;
