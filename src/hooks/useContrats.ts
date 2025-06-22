
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Contrat {
  id: string;
  numero_contrat: string;
  compagnie: string;
  cotisation_mensuelle: number;
  date_signature: string;
  contact_client_id: string;
  created_at: string;
  contact?: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export const useContrats = () => {
  const { user, userRole } = useAuth();
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContrats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('contrats')
        .select(`
          *,
          contact:contacts!contact_client_id(nom, prenom, email)
        `)
        .order('created_at', { ascending: false });

      // Apply role-based filters
      if (userRole === 'conseiller') {
        // Get contracts for contacts assigned to this user
        const { data: userContacts } = await supabase
          .from('contacts')
          .select('id')
          .eq('collaborateur_en_charge', user.id);

        if (userContacts && userContacts.length > 0) {
          const contactIds = userContacts.map(c => c.id);
          query = query.in('contact_client_id', contactIds);
        }
      } else if (userRole === 'gestionnaire' && user.profile?.equipe_id) {
        const { data: teamMembers } = await supabase
          .from('users')
          .select('id')
          .eq('equipe_id', user.profile.equipe_id);

        if (teamMembers && teamMembers.length > 0) {
          const memberIds = teamMembers.map(m => m.id);
          const { data: teamContacts } = await supabase
            .from('contacts')
            .select('id')
            .in('collaborateur_en_charge', memberIds);

          if (teamContacts && teamContacts.length > 0) {
            const contactIds = teamContacts.map(c => c.id);
            query = query.in('contact_client_id', contactIds);
          }
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setContrats(data || []);
    } catch (err) {
      console.error('Error fetching contrats:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createContrat = async (contratData: Omit<Contrat, 'id' | 'created_at' | 'contact'>) => {
    try {
      const { data, error } = await supabase
        .from('contrats')
        .insert([contratData])
        .select()
        .single();

      if (error) throw error;
      await fetchContrats();
      return data;
    } catch (err) {
      console.error('Error creating contrat:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchContrats();
  }, [user, userRole]);

  return {
    contrats,
    loading,
    error,
    fetchContrats,
    createContrat
  };
};
