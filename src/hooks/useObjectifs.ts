
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Objectif {
  id: string;
  nom: string;
  type: string;
  valeur_cible: number;
  valeur_actuelle?: number;
  periode_debut: string;
  periode_fin: string;
  assigne_a?: string;
  equipe_id?: string;
  cree_par: string;
  created_at: string;
  updated_at: string;
  assignee?: {
    nom_complet: string;
  };
  equipe?: {
    nom: string;
  };
  createur?: {
    nom_complet: string;
  };
}

export const useObjectifs = () => {
  const { user, userRole } = useAuth();
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectifs = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('objectifs')
        .select(`
          *,
          assignee:users!assigne_a(nom_complet),
          equipe:equipes!equipe_id(nom),
          createur:users!cree_par(nom_complet)
        `)
        .order('created_at', { ascending: false });

      // Apply role-based filters
      if (userRole === 'gestionnaire' && user.profile?.equipe_id) {
        query = query.or(`equipe_id.eq.${user.profile.equipe_id},assigne_a.in.(select id from users where equipe_id='${user.profile.equipe_id}')`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setObjectifs(data || []);
    } catch (err) {
      console.error('Error fetching objectifs:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createObjectif = async (objectifData: Omit<Objectif, 'id' | 'created_at' | 'updated_at' | 'assignee' | 'equipe' | 'createur'>) => {
    try {
      const { data, error } = await supabase
        .from('objectifs')
        .insert([{
          ...objectifData,
          cree_par: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchObjectifs();
      return data;
    } catch (err) {
      console.error('Error creating objectif:', err);
      throw err;
    }
  };

  const updateObjectif = async (id: string, updates: Partial<Objectif>) => {
    try {
      const { data, error } = await supabase
        .from('objectifs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchObjectifs();
      return data;
    } catch (err) {
      console.error('Error updating objectif:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchObjectifs();
  }, [user, userRole]);

  return {
    objectifs,
    loading,
    error,
    fetchObjectifs,
    createObjectif,
    updateObjectif
  };
};
