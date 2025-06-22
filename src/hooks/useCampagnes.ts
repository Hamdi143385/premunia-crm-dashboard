
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Campagne {
  id: string;
  nom: string;
  description?: string;
  type: string;
  statut: string;
  date_debut?: string;
  date_fin?: string;
  declencheur: any;
  etapes: any[];
  cree_par: string;
  created_at: string;
  updated_at: string;
  createur?: {
    nom_complet: string;
  };
}

export const useCampagnes = () => {
  const { user } = useAuth();
  const [campagnes, setCampagnes] = useState<Campagne[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampagnes = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('campagnes')
        .select(`
          *,
          createur:users!cree_par(nom_complet)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCampagnes(data || []);
    } catch (err) {
      console.error('Error fetching campagnes:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createCampagne = async (campagneData: Omit<Campagne, 'id' | 'created_at' | 'updated_at' | 'createur'>) => {
    try {
      const { data, error } = await supabase
        .from('campagnes')
        .insert([{
          ...campagneData,
          cree_par: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchCampagnes();
      return data;
    } catch (err) {
      console.error('Error creating campagne:', err);
      throw err;
    }
  };

  const updateCampagne = async (id: string, updates: Partial<Campagne>) => {
    try {
      const { data, error } = await supabase
        .from('campagnes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchCampagnes();
      return data;
    } catch (err) {
      console.error('Error updating campagne:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCampagnes();
  }, [user]);

  return {
    campagnes,
    loading,
    error,
    fetchCampagnes,
    createCampagne,
    updateCampagne
  };
};
