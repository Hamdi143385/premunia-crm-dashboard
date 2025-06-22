
import { useState } from 'react';
import { usePropositions } from '@/hooks/usePropositions';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, FileText, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Propositions() {
  const { userRole } = useAuth();
  const { propositions, loading, error, createProposition } = usePropositions();
  const { contacts } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredPropositions = propositions.filter(proposition => {
    const matchesSearch = !searchTerm || 
      (proposition.contact?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       proposition.contact?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       proposition.produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       proposition.compagnie?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || proposition.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'bg-gray-100 text-gray-800';
      case 'envoyee': return 'bg-blue-100 text-blue-800';
      case 'acceptee': return 'bg-green-100 text-green-800';
      case 'refusee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBasedTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Toutes les propositions';
      case 'gestionnaire':
        return 'Propositions de votre équipe';
      case 'conseiller':
        return 'Vos propositions';
      default:
        return 'Propositions';
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
          <h1 className="text-3xl font-bold text-slate-800">Propositions</h1>
          <p className="text-slate-600 mt-1">{getRoleBasedTitle()}</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouvelle proposition</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle proposition</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <p className="text-slate-600">Formulaire de création en cours de développement...</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par client, produit ou compagnie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="envoyee">Envoyée</SelectItem>
                <SelectItem value="acceptee">Acceptée</SelectItem>
                <SelectItem value="refusee">Refusée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des propositions */}
      <div className="grid gap-4">
        {filteredPropositions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Aucune proposition trouvée</h3>
              <p className="text-slate-500">
                {searchTerm || statusFilter 
                  ? "Aucune proposition ne correspond à vos critères de recherche."
                  : "Commencez par créer votre première proposition."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPropositions.map((proposition) => (
            <Card key={proposition.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {proposition.contact?.prenom} {proposition.contact?.nom}
                      </h3>
                      <Badge className={getStatusColor(proposition.statut)}>
                        {proposition.statut}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Produit:</span> {proposition.produit || 'Non spécifié'}
                      </div>
                      <div>
                        <span className="font-medium">Compagnie:</span> {proposition.compagnie || 'Non spécifiée'}
                      </div>
                      <div>
                        <span className="font-medium">Conseiller:</span> {proposition.conseiller?.nom_complet}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>Créée le {new Date(proposition.created_at).toLocaleDateString('fr-FR')}</span>
                        {proposition.date_echeance && (
                          <span>Échéance: {new Date(proposition.date_echeance).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                      {proposition.montant_mensuel && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">
                            {proposition.montant_mensuel.toLocaleString()} €/mois
                          </span>
                        </div>
                      )}
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
