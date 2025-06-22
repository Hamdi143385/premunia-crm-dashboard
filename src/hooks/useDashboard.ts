
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  nouveauxContacts: number;
  propositionsEnAttente: number;
  caMensuel: number;
  progressionObjectif: number;
  activiteRecente: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export const useDashboard = () => {
  const { user, userRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    nouveauxContacts: 0,
    propositionsEnAttente: 0,
    caMensuel: 0,
    progressionObjectif: 0,
    activiteRecente: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const userId = user.id;
      const equipeId = user.profile?.equipe_id;

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
        activiteRecente: [
          { id: '1', type: 'contact', message: 'Nouveau contact ajouté', timestamp: 'Il y a 2 heures' },
          { id: '2', type: 'proposition', message: 'Proposition envoyée', timestamp: 'Il y a 4 heures' },
          { id: '3', type: 'contrat', message: 'Contrat signé', timestamp: 'Hier' }
        ]
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, userRole]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchDashboardData
  };
};
