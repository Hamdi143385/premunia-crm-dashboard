
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/dashboard/KPICard';
import { Users, FileText, DollarSign, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { userRole } = useAuth();
  const { stats, loading, error } = useDashboard();

  const getRoleBasedTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Vue d\'ensemble globale';
      case 'gestionnaire':
        return 'Performance de votre équipe';
      case 'conseiller':
        return 'Votre activité';
      default:
        return 'Dashboard';
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">{getRoleBasedTitle()}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Nouveaux Contacts"
          value={stats.nouveauxContacts}
          description="Ce mois-ci"
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Propositions en attente"
          value={stats.propositionsEnAttente}
          description="À traiter"
          icon={FileText}
          color="orange"
          trend={{ value: -5, isPositive: false }}
        />
        <KPICard
          title="CA Mensuel"
          value={`${stats.caMensuel.toLocaleString()} €`}
          description="Contrats signés"
          icon={DollarSign}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Progression Objectif"
          value={`${stats.progressionObjectif}%`}
          description="Objectif mensuel"
          icon={Target}
          color="purple"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Activité récente</span>
            </CardTitle>
            <CardDescription>Vos dernières actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.activiteRecente.map((activite) => (
                <div key={activite.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{activite.message}</p>
                    <p className="text-xs text-slate-500">{activite.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Objectifs du mois</span>
            </CardTitle>
            <CardDescription>Progression vers vos objectifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Nouveaux contacts</span>
                  <span className="font-medium text-slate-800">25/30</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Chiffre d'affaires</span>
                  <span className="font-medium text-slate-800">{stats.caMensuel.toLocaleString()}€/50k€</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${Math.min((stats.caMensuel / 50000) * 100, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Propositions</span>
                  <span className="font-medium text-slate-800">12/15</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
