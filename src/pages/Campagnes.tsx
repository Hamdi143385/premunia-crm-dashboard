
import { useState } from 'react';
import { useCampagnes } from '@/hooks/useCampagnes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Megaphone, Play, Pause, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Campagnes() {
  const { campagnes, loading, error } = useCampagnes();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredCampagnes = campagnes.filter(campagne => {
    const matchesSearch = !searchTerm || 
      campagne.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campagne.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || campagne.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'pausee': return 'bg-yellow-100 text-yellow-800';
      case 'terminee': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'pausee': return <Pause className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
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
          <h1 className="text-3xl font-bold text-slate-800">Campagnes Marketing</h1>
          <p className="text-slate-600 mt-1">Gestion des campagnes automatisées</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouvelle campagne</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle campagne</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <p className="text-slate-600">Constructeur de campagne en cours de développement...</p>
              <p className="text-sm text-slate-500 mt-2">
                Cette fonctionnalité permettra de créer des workflows automatisés avec des déclencheurs et des étapes personnalisées.
              </p>
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
                placeholder="Rechercher par nom ou description..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pausee">Pausée</SelectItem>
                <SelectItem value="terminee">Terminée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des campagnes */}
      <div className="grid gap-4">
        {filteredCampagnes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Megaphone className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Aucune campagne trouvée</h3>
              <p className="text-slate-500">
                {searchTerm || statusFilter
                  ? "Aucune campagne ne correspond à vos critères de recherche."
                  : "Créez votre première campagne de marketing automation."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCampagnes.map((campagne) => (
            <Card key={campagne.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(campagne.statut)}
                      <h3 className="text-lg font-semibold text-slate-800">{campagne.nom}</h3>
                      <Badge className={getStatusColor(campagne.statut)}>
                        {campagne.statut}
                      </Badge>
                    </div>
                    
                    {campagne.description && (
                      <p className="text-slate-600 mb-3">{campagne.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                      <div>
                        <span className="font-medium">Type:</span> {campagne.type}
                      </div>
                      <div>
                        <span className="font-medium">Étapes:</span> {campagne.etapes.length} étape(s)
                      </div>
                      <div>
                        <span className="font-medium">Créé par:</span> {campagne.createur?.nom_complet}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Créée le {new Date(campagne.created_at).toLocaleDateString('fr-FR')}</span>
                      {campagne.date_debut && (
                        <span>Début: {new Date(campagne.date_debut).toLocaleDateString('fr-FR')}</span>
                      )}
                      {campagne.date_fin && (
                        <span>Fin: {new Date(campagne.date_fin).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer
                    </Button>
                    {campagne.statut === 'brouillon' && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Activer
                      </Button>
                    )}
                    {campagne.statut === 'active' && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pauser
                      </Button>
                    )}
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
