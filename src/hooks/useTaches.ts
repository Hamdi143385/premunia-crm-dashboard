
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Tache {
  id: string;
  titre: string;
  description?: string;
  statut: string;
  priorite: string;
  date_echeance?: string;
  date_completion?: string;
  contact_id?: string;
  assigne_a: string;
  cree_par: string;
  created_at: string;
  updated_at: string;
  contact?: {
    nom: string;
    prenom: string;
  };
  assignee?: {
    nom_complet: string;
  };
  createur?: {
    nom_complet: string;
  };
}

export const useTaches = () => {
  const { user, userRole } = useAuth();
  const [taches, setTaches] = useState<Tache[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaches = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('taches')
        .select(`
          *,
          contact:contacts(nom, prenom),
          assignee:users!assigne_a(nom_complet),
          createur:users!cree_par(nom_complet)
        `)
        .order('created_at', { ascending: false });

      // Apply role-based filters
      if (userRole === 'conseiller') {
        query = query.or(`assigne_a.eq.${user.id},cree_par.eq.${user.id}`);
      } else if (userRole === 'gestionnaire' && user.profile?.equipe_id) {
        const { data: teamMembers } = await supabase
          .from('users')
          .select('id')
          .eq('equipe_id', user.profile.equipe_id);

        if (teamMembers && teamMembers.length > 0) {
          const memberIds = teamMembers.map(m => m.id);
          query = query.or(`assigne_a.in.(${memberIds.join(',')}),cree_par.in.(${memberIds.join(',')})`);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTaches(data || []);
    } catch (err) {
      console.error('Error fetching taches:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createTache = async (tacheData: Partial<Tache>) => {
    try {
      const { data, error } = await supabase
        .from('taches')
        .insert([{
          ...tacheData,
          cree_par: user?.id,
          assigne_a: tacheData.assigne_a || user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchTaches();
      return data;
    } catch (err) {
      console.error('Error creating tache:', err);
      throw err;
    }
  };

  const updateTache = async (id: string, updates: Partial<Tache>) => {
    try {
      const { data, error } = await supabase
        .from('taches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchTaches();
      return data;
    } catch (err) {
      console.error('Error updating tache:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTaches();
  }, [user, userRole]);

  return {
    taches,
    loading,
    error,
    fetchTaches,
    createTache,
    updateTache
  };
};
