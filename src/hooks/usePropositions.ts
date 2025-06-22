
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Proposition {
  id: string;
  contact_id: string;
  conseiller_id: string;
  produit?: string;
  compagnie?: string;
  montant_mensuel?: number;
  statut: string;
  date_proposition?: string;
  date_echeance?: string;
  details?: any;
  created_at: string;
  updated_at: string;
  contact?: {
    nom: string;
    prenom: string;
    email: string;
  };
  conseiller?: {
    nom_complet: string;
  };
}

export const usePropositions = () => {
  const { user, userRole } = useAuth();
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropositions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('propositions')
        .select(`
          *,
          contact:contacts!contact_id(nom, prenom, email),
          conseiller:users!conseiller_id(nom_complet)
        `)
        .order('created_at', { ascending: false });

      // Apply role-based filters
      if (userRole === 'conseiller') {
        query = query.eq('conseiller_id', user.id);
      } else if (userRole === 'gestionnaire' && user.profile?.equipe_id) {
        const { data: teamMembers } = await supabase
          .from('users')
          .select('id')
          .eq('equipe_id', user.profile.equipe_id);

        if (teamMembers && teamMembers.length > 0) {
          const memberIds = teamMembers.map(m => m.id);
          query = query.in('conseiller_id', memberIds);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPropositions(data || []);
    } catch (err) {
      console.error('Error fetching propositions:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createProposition = async (propositionData: Partial<Proposition>) => {
    try {
      const { data, error } = await supabase
        .from('propositions')
        .insert([{
          ...propositionData,
          conseiller_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchPropositions();
      return data;
    } catch (err) {
      console.error('Error creating proposition:', err);
      throw err;
    }
  };

  const updateProposition = async (id: string, updates: Partial<Proposition>) => {
    try {
      const { data, error } = await supabase
        .from('propositions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPropositions();
      return data;
    } catch (err) {
      console.error('Error updating proposition:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPropositions();
  }, [user, userRole]);

  return {
    propositions,
    loading,
    error,
    fetchPropositions,
    createProposition,
    updateProposition
  };
};
