
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { KPICard } from '@/components/dashboard/KPICard';
import { Users, FileText, DollarSign, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  nouveauxContacts: number;
  propositionsEnAttente: number;
  caMensuel: number;
  progressionObjectif: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    nouveauxContacts: 0,
    propositionsEnAttente: 0,
    caMensuel: 0,
    progressionObjectif: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userId = user.id;
      const userRole = user.role?.nom;
      const equipeId = user.equipe_id;

      let contactsQuery = supabase.from('contacts').select('id', { count: 'exact', head: true });
      let propositionsQuery = supabase.from('propositions').select('id', { count: 'exact', head: true });
      let contratsQuery = supabase.from('contrats').select('cotisation_mensuelle');

      // Apply role-based filters
      if (userRole === 'conseiller') {
        contactsQuery = contactsQuery.eq('collaborateur_en_charge', userId);
        propositionsQuery = propositionsQuery.eq('conseiller_id', userId);
        contratsQuery = contratsQuery.eq('contact_client_id', userId);
      } else if (userRole === 'gestionnaire' && equipeId) {
        // For gestionnaire, filter by team members
        const { data: teamMembers } = await supabase
          .from('users')
          .select('id')
          .eq('equipe_id', equipeId);

        if (teamMembers && teamMembers.length > 0) {
          const memberIds = teamMembers.map(m => m.id);
          contactsQuery = contactsQuery.in('collaborateur_en_charge', memberIds);
          propositionsQuery = propositionsQuery.in('conseiller_id', memberIds);
        }
      }
      // For admin, no additional filters (see all data)

      // Execute queries
      const [contactsResult, propositionsResult, contratsResult] = await Promise.all([
        contactsQuery.eq('statut_lead', 'Nouveau'),
        propositionsQuery.eq('statut', 'envoyee'),
        contratsQuery.gte('date_signature', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
      ]);

      // Calculate stats
      const nouveauxContacts = contactsResult.count || 0;
      const propositionsEnAttente = propositionsResult.count || 0;
      const caMensuel = contratsResult.data?.reduce((sum, contrat) => sum + (contrat.cotisation_mensuelle || 0), 0) || 0;

      setStats({
        nouveauxContacts,
        propositionsEnAttente,
        caMensuel,
        progressionObjectif: 75, // Mock data for now
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedTitle = () => {
    switch (user?.role?.nom) {
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
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Nouveau contact ajouté</p>
                  <p className="text-xs text-slate-500">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Proposition envoyée</p>
                  <p className="text-xs text-slate-500">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Contrat signé</p>
                  <p className="text-xs text-slate-500">Hier</p>
                </div>
              </div>
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
