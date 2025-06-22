
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Phone, Mail, MapPin, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut_lead: string;
  collaborateur_en_charge: string;
  created_at: string;
  utilisateur?: {
    nom_complet: string;
  };
}

export default function Contacts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      let query = supabase
        .from('contacts')
        .select(`
          *,
          utilisateur:users!collaborateur_en_charge(nom_complet)
        `)
        .order('created_at', { ascending: false });

      // Apply role-based filters
      const userRole = user.role?.nom;
      if (userRole === 'conseiller') {
        query = query.eq('collaborateur_en_charge', user.id);
      } else if (userRole === 'gestionnaire' && user.equipe_id) {
        // Get team members first
        const { data: teamMembers } = await supabase
          .from('users')
          .select('id')
          .eq('equipe_id', user.equipe_id);

        if (teamMembers && teamMembers.length > 0) {
          const memberIds = teamMembers.map(m => m.id);
          query = query.in('collaborateur_en_charge', memberIds);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.prenom} ${contact.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.telephone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'nouveau':
        return 'bg-blue-100 text-blue-800';
      case 'qualifie':
        return 'bg-green-100 text-green-800';
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'converti':
        return 'bg-purple-100 text-purple-800';
      case 'perdu':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Contacts</h1>
          <p className="text-slate-600 mt-1">Gérez vos contacts et prospects</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contact
        </Button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button variant="outline" className="border-slate-300">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <Card 
            key={contact.id}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-md"
            onClick={() => navigate(`/contacts/${contact.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    {contact.prenom} {contact.nom}
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Géré par {contact.utilisateur?.nom_complet}
                  </p>
                </div>
                <Badge className={`${getStatusColor(contact.statut_lead)} border-0`}>
                  {contact.statut_lead}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.telephone && (
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{contact.telephone}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Créé le {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucun contact trouvé</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm ? 'Aucun contact ne correspond à votre recherche.' : 'Commencez par ajouter un nouveau contact.'}
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un contact
          </Button>
        </div>
      )}
    </div>
  );
}
