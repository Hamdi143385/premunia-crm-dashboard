
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Phone, Calendar, Tag } from 'lucide-react';
import OggoComparator from '@/components/contacts/OggoComparator';
import { Contact } from '@/hooks/useContacts';
import { Proposition } from '@/hooks/usePropositions';
import { Contrat } from '@/hooks/useContrats';
import { Tache } from '@/hooks/useTaches';

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchContactData();
    }
  }, [id]);

  const fetchContactData = async () => {
    if (!id || !user?.id) return;

    try {
      setLoading(true);

      // Fetch contact details
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();

      if (contactError) throw contactError;
      setContact(contactData);

      // Fetch related propositions
      const { data: propositionsData } = await supabase
        .from('propositions')
        .select(`
          *,
          conseiller:users!conseiller_id(nom_complet)
        `)
        .eq('contact_id', id);

      setPropositions(propositionsData || []);

      // Fetch related contracts
      const { data: contratsData } = await supabase
        .from('contrats')
        .select('*')
        .eq('contact_client_id', id);

      setContrats(contratsData || []);

      // Fetch related tasks
      const { data: tachesData } = await supabase
        .from('taches')
        .select(`
          *,
          assignee:users!assigne_a(nom_complet),
          createur:users!cree_par(nom_complet)
        `)
        .eq('contact_id', id);

      setTaches(tachesData || []);

    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Contact non trouvé</h1>
        <Button onClick={() => navigate('/contacts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {contact.prenom} {contact.nom}
            </h1>
            <p className="text-slate-600">{contact.statut_lead}</p>
          </div>
        </div>
        <OggoComparator />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <span>{contact.email || 'Non renseigné'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <span>{contact.telephone || 'Non renseigné'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Créé le {new Date(contact.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex items-start space-x-2">
                <Tag className="h-4 w-4 text-slate-500 mt-1" />
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {contact.notes && (
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Notes</h4>
                <p className="text-sm text-slate-600">{contact.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="propositions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="propositions">Propositions ({propositions.length})</TabsTrigger>
              <TabsTrigger value="contrats">Contrats ({contrats.length})</TabsTrigger>
              <TabsTrigger value="taches">Tâches ({taches.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="propositions" className="space-y-4">
              {propositions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-slate-500">Aucune proposition pour ce contact</p>
                  </CardContent>
                </Card>
              ) : (
                propositions.map((proposition) => (
                  <Card key={proposition.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{proposition.produit || 'Produit non spécifié'}</h3>
                          <p className="text-sm text-slate-600">{proposition.compagnie}</p>
                          <p className="text-sm text-slate-500">
                            Statut: <span className="capitalize">{proposition.statut}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          {proposition.montant_mensuel && (
                            <p className="font-bold text-green-600">
                              {proposition.montant_mensuel.toLocaleString()} €/mois
                            </p>
                          )}
                          <p className="text-xs text-slate-500">
                            {new Date(proposition.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="contrats" className="space-y-4">
              {contrats.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-slate-500">Aucun contrat pour ce contact</p>
                  </CardContent>
                </Card>
              ) : (
                contrats.map((contrat) => (
                  <Card key={contrat.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Contrat #{contrat.numero_contrat}</h3>
                          <p className="text-sm text-slate-600">{contrat.compagnie}</p>
                          <p className="text-sm text-slate-500">
                            Signé le {new Date(contrat.date_signature).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {contrat.cotisation_mensuelle.toLocaleString()} €/mois
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="taches" className="space-y-4">
              {taches.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-slate-500">Aucune tâche pour ce contact</p>
                  </CardContent>
                </Card>
              ) : (
                taches.map((tache) => (
                  <Card key={tache.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{tache.titre}</h3>
                          {tache.description && (
                            <p className="text-sm text-slate-600 mt-1">{tache.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              tache.statut === 'termine' ? 'bg-green-100 text-green-800' :
                              tache.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {tache.statut.replace('_', ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              tache.priorite === 'haute' ? 'bg-red-100 text-red-800' :
                              tache.priorite === 'normale' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {tache.priorite}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                          {tache.date_echeance && (
                            <p>Échéance: {new Date(tache.date_echeance).toLocaleDateString('fr-FR')}</p>
                          )}
                          <p>Créé le {new Date(tache.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
