
import { useState } from 'react';
import { useTaches } from '@/hooks/useTaches';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Taches() {
  const { userRole } = useAuth();
  const { taches, loading, error, updateTache } = useTaches();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredTaches = taches.filter(tache => {
    const matchesSearch = !searchTerm || 
      tache.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tache.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tache.contact?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       tache.contact?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || tache.statut === statusFilter;
    const matchesPriority = !priorityFilter || tache.priorite === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'a_faire': return 'bg-gray-100 text-gray-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'termine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'normale': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'a_faire': return <Clock className="h-4 w-4" />;
      case 'en_cours': return <AlertCircle className="h-4 w-4" />;
      case 'termine': return <CheckSquare className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (tacheId: string, newStatus: string) => {
    try {
      const updates: any = { statut: newStatus };
      if (newStatus === 'termine') {
        updates.date_completion = new Date().toISOString();
      }
      await updateTache(tacheId, updates);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getRoleBasedTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Toutes les tâches';
      case 'gestionnaire':
        return 'Tâches de votre équipe';
      case 'conseiller':
        return 'Vos tâches';
      default:
        return 'Tâches';
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
          <h1 className="text-3xl font-bold text-slate-800">Tâches</h1>
          <p className="text-slate-600 mt-1">{getRoleBasedTitle()}</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouvelle tâche</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
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
                placeholder="Rechercher par titre, description ou contact..."
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
                <SelectItem value="a_faire">À faire</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les priorités</SelectItem>
                <SelectItem value="haute">Haute</SelectItem>
                <SelectItem value="normale">Normale</SelectItem>
                <SelectItem value="basse">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tâches */}
      <div className="grid gap-4">
        {filteredTaches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Aucune tâche trouvée</h3>
              <p className="text-slate-500">
                {searchTerm || statusFilter || priorityFilter
                  ? "Aucune tâche ne correspond à vos critères de recherche."
                  : "Commencez par créer votre première tâche."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTaches.map((tache) => (
            <Card key={tache.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(tache.statut)}
                      <h3 className="text-lg font-semibold text-slate-800">{tache.titre}</h3>
                      <Badge className={getStatusColor(tache.statut)}>
                        {tache.statut.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(tache.priorite)}>
                        {tache.priorite}
                      </Badge>
                    </div>
                    
                    {tache.description && (
                      <p className="text-slate-600 mb-3">{tache.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                      {tache.contact && (
                        <div>
                          <span className="font-medium">Contact:</span> {tache.contact.prenom} {tache.contact.nom}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Assigné à:</span> {tache.assignee?.nom_complet}
                      </div>
                      <div>
                        <span className="font-medium">Créé par:</span> {tache.createur?.nom_complet}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Créée le {new Date(tache.created_at).toLocaleDateString('fr-FR')}</span>
                      {tache.date_echeance && (
                        <span>Échéance: {new Date(tache.date_echeance).toLocaleDateString('fr-FR')}</span>
                      )}
                      {tache.date_completion && (
                        <span>Terminée le {new Date(tache.date_completion).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <Select value={tache.statut} onValueChange={(value) => handleStatusChange(tache.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a_faire">À faire</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
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
