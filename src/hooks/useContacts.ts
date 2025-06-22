
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Contact {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut_lead: string;
  collaborateur_en_charge: string;
  created_at: string;
  source?: string;
  score?: number;
  notes?: string;
  tags?: string[];
  utilisateur?: {
    nom_complet: string;
  };
}

export const useContacts = () => {
  const { user, userRole } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('contacts')
        .select(`
          *,
          utilisateur:users!collaborateur_en_charge(nom_complet)
        `)
        .order('created_at', { ascending: false });

      // Apply role-based filters
      if (userRole === 'conseiller') {
        query = query.eq('collaborateur_en_charge', user.id);
      } else if (userRole === 'gestionnaire' && user.profile?.equipe_id) {
        // Get team members first
        const { data: teamMembers } = await supabase
          .from('users')
          .select('id')
          .eq('equipe_id', user.profile.equipe_id);

        if (teamMembers && teamMembers.length > 0) {
          const memberIds = teamMembers.map(m => m.id);
          query = query.in('collaborateur_en_charge', memberIds);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData: Partial<Contact>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          ...contactData,
          collaborateur_en_charge: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchContacts(); // Refresh list
      return data;
    } catch (err) {
      console.error('Error creating contact:', err);
      throw err;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchContacts(); // Refresh list
      return data;
    } catch (err) {
      console.error('Error updating contact:', err);
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchContacts(); // Refresh list
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user, userRole]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact
  };
};
