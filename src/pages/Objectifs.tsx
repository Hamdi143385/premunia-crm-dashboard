
import { useState } from 'react';
import { useObjectifs } from '@/hooks/useObjectifs';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Target, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Objectifs() {
  const { userRole } = useAuth();
  const { objectifs, loading, error } = useObjectifs();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredObjectifs = objectifs.filter(objectif => {
    const matchesSearch = !searchTerm || 
      objectif.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objectif.assignee?.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objectif.equipe?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || objectif.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getProgressPercentage = (valeurActuelle: number = 0, valeurCible: number) => {
    return Math.min((valeurActuelle / valeurCible) * 100, 100);
  };

  const isObjectifEnCours = (periodeDebut: string, periodeFin: string) => {
    const now = new Date();
    const debut = new Date(periodeDebut);
    const fin = new Date(periodeFin);
    return now >= debut && now <= fin;
  };

  const getRoleBasedTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Tous les objectifs';
      case 'gestionnaire':
        return 'Objectifs de votre équipe';
      default:
        return 'Objectifs';
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
          <h1 className="text-3xl font-bold text-slate-800">Objectifs</h1>
          <p className="text-slate-600 mt-1">{getRoleBasedTitle()}</p>
        </div>
        {(userRole === 'admin' || userRole === 'gestionnaire') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nouvel objectif</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouvel objectif</DialogTitle>
              </DialogHeader>
              <div className="text-center py-8">
                <p className="text-slate-600">Formulaire de création en cours de développement...</p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, assigné ou équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                <SelectItem value="ca">Chiffre d'affaires</SelectItem>
                <SelectItem value="contacts">Nouveaux contacts</SelectItem>
                <SelectItem value="contrats">Contrats signés</SelectItem>
                <SelectItem value="propositions">Propositions envoyées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des objectifs */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredObjectifs.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Aucun objectif trouvé</h3>
              <p className="text-slate-500">
                {searchTerm || typeFilter
                  ? "Aucun objectif ne correspond à vos critères de recherche."
                  : "Créez votre premier objectif pour suivre les performances."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredObjectifs.map((objectif) => {
            const progressPercentage = getProgressPercentage(objectif.valeur_actuelle, objectif.valeur_cible);
            const isActive = isObjectifEnCours(objectif.periode_debut, objectif.periode_fin);
            
            return (
              <Card key={objectif.id} className={`hover:shadow-lg transition-shadow ${isActive ? 'border-blue-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>{objectif.nom}</span>
                    </CardTitle>
                    {isActive && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        En cours
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-600">Type:</span>
                      <p className="capitalize">{objectif.type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Assigné à:</span>
                      <p>{objectif.assignee?.nom_complet || objectif.equipe?.nom}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-600">Progression</span>
                      <span className="font-bold">
                        {objectif.valeur_actuelle?.toLocaleString() || 0} / {objectif.valeur_cible.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{progressPercentage.toFixed(1)}% atteint</span>
                      <span>
                        {progressPercentage >= 100 ? '🎉 Objectif atteint!' : 
                         progressPercentage >= 75 ? '🔥 Presque là!' : 
                         progressPercentage >= 50 ? '💪 Bon rythme' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(objectif.periode_debut).toLocaleDateString('fr-FR')} - {new Date(objectif.periode_fin).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        {progressPercentage >= 100 ? 'Terminé' :
                         isActive ? 'Actif' : 'À venir'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
