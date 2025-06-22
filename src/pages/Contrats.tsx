
import { useState } from 'react';
import { useContrats } from '@/hooks/useContrats';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, FileText, Eye, DollarSign, Calendar } from 'lucide-react';

export default function Contrats() {
  const { userRole } = useAuth();
  const { contrats, loading, error } = useContrats();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredContrats = contrats.filter(contrat => {
    return !searchTerm || 
      contrat.numero_contrat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.compagnie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contrat.contact?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       contrat.contact?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const totalCA = contrats.reduce((sum, contrat) => sum + contrat.cotisation_mensuelle, 0);
  const contratsThisMonth = contrats.filter(contrat => {
    const signatureDate = new Date(contrat.date_signature);
    const now = new Date();
    return signatureDate.getMonth() === now.getMonth() && 
           signatureDate.getFullYear() === now.getFullYear();
  }).length;

  const getRoleBasedTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Tous les contrats';
      case 'gestionnaire':
        return 'Contrats de votre équipe';
      case 'conseiller':
        return 'Vos contrats';
      default:
        return 'Contrats';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Contrats</h1>
          <p className="text-slate-600 mt-1">{getRoleBasedTitle()}</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouveau contrat</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau contrat</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <p className="text-slate-600">Formulaire de création en cours de développement...</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contrats.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Mensuel Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCA.toLocaleString()} €
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signés ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{contratsThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par numéro de contrat, compagnie ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des contrats */}
      <div className="grid gap-4">
        {filteredContrats.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Aucun contrat trouvé</h3>
              <p className="text-slate-500">
                {searchTerm 
                  ? "Aucun contrat ne correspond à votre recherche."
                  : "Aucun contrat n'a encore été créé."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContrats.map((contrat) => (
            <Card key={contrat.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Contrat #{contrat.numero_contrat}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                      <div>
                        <span className="font-medium">Client:</span> {contrat.contact?.prenom} {contrat.contact?.nom}
                      </div>
                      <div>
                        <span className="font-medium">Compagnie:</span> {contrat.compagnie}
                      </div>
                      <div>
                        <span className="font-medium">Date signature:</span> {new Date(contrat.date_signature).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Créé le {new Date(contrat.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-bold text-green-600">
                          {contrat.cotisation_mensuelle.toLocaleString()} €/mois
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
