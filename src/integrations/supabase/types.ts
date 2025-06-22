export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campagnes: {
        Row: {
          created_at: string
          cree_par: string
          date_debut: string | null
          date_fin: string | null
          declencheur: Json
          description: string | null
          etapes: Json
          id: string
          nom: string
          statut: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cree_par: string
          date_debut?: string | null
          date_fin?: string | null
          declencheur?: Json
          description?: string | null
          etapes?: Json
          id?: string
          nom: string
          statut?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cree_par?: string
          date_debut?: string | null
          date_fin?: string | null
          declencheur?: Json
          description?: string | null
          etapes?: Json
          id?: string
          nom?: string
          statut?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campagnes_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          collaborateur_en_charge: string | null
          created_at: string
          date_dernier_statut: string | null
          date_derniere_relance: string | null
          date_naissance: string | null
          derniere_relance_envoyee: string | null
          email: string | null
          id: string
          nom: string
          notes: string | null
          prenom: string
          score: number | null
          source: string | null
          statut_lead: string
          tags: string[] | null
          telephone: string | null
          updated_at: string
        }
        Insert: {
          collaborateur_en_charge?: string | null
          created_at?: string
          date_dernier_statut?: string | null
          date_derniere_relance?: string | null
          date_naissance?: string | null
          derniere_relance_envoyee?: string | null
          email?: string | null
          id?: string
          nom: string
          notes?: string | null
          prenom: string
          score?: number | null
          source?: string | null
          statut_lead?: string
          tags?: string[] | null
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          collaborateur_en_charge?: string | null
          created_at?: string
          date_dernier_statut?: string | null
          date_derniere_relance?: string | null
          date_naissance?: string | null
          derniere_relance_envoyee?: string | null
          email?: string | null
          id?: string
          nom?: string
          notes?: string | null
          prenom?: string
          score?: number | null
          source?: string | null
          statut_lead?: string
          tags?: string[] | null
          telephone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_collaborateur_en_charge_fkey"
            columns: ["collaborateur_en_charge"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contrats: {
        Row: {
          compagnie: string
          contact_client_id: string
          cotisation_mensuelle: number
          created_at: string
          date_signature: string
          id: string
          numero_contrat: string
        }
        Insert: {
          compagnie: string
          contact_client_id: string
          cotisation_mensuelle: number
          created_at?: string
          date_signature: string
          id?: string
          numero_contrat: string
        }
        Update: {
          compagnie?: string
          contact_client_id?: string
          cotisation_mensuelle?: number
          created_at?: string
          date_signature?: string
          id?: string
          numero_contrat?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrats_contact_client_id_fkey"
            columns: ["contact_client_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      equipes: {
        Row: {
          created_at: string
          id: string
          manager_id: string | null
          nom: string
        }
        Insert: {
          created_at?: string
          id?: string
          manager_id?: string | null
          nom: string
        }
        Update: {
          created_at?: string
          id?: string
          manager_id?: string | null
          nom?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipes_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      objectifs: {
        Row: {
          assigne_a: string | null
          created_at: string
          cree_par: string
          equipe_id: string | null
          id: string
          nom: string
          periode_debut: string
          periode_fin: string
          type: string
          updated_at: string
          valeur_actuelle: number | null
          valeur_cible: number
        }
        Insert: {
          assigne_a?: string | null
          created_at?: string
          cree_par: string
          equipe_id?: string | null
          id?: string
          nom: string
          periode_debut: string
          periode_fin: string
          type: string
          updated_at?: string
          valeur_actuelle?: number | null
          valeur_cible: number
        }
        Update: {
          assigne_a?: string | null
          created_at?: string
          cree_par?: string
          equipe_id?: string | null
          id?: string
          nom?: string
          periode_debut?: string
          periode_fin?: string
          type?: string
          updated_at?: string
          valeur_actuelle?: number | null
          valeur_cible?: number
        }
        Relationships: [
          {
            foreignKeyName: "objectifs_assigne_a_fkey"
            columns: ["assigne_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objectifs_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objectifs_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      propositions: {
        Row: {
          compagnie: string | null
          conseiller_id: string
          contact_id: string
          created_at: string
          date_echeance: string | null
          date_proposition: string | null
          details: Json | null
          id: string
          montant_mensuel: number | null
          produit: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          compagnie?: string | null
          conseiller_id: string
          contact_id: string
          created_at?: string
          date_echeance?: string | null
          date_proposition?: string | null
          details?: Json | null
          id?: string
          montant_mensuel?: number | null
          produit?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          compagnie?: string | null
          conseiller_id?: string
          contact_id?: string
          created_at?: string
          date_echeance?: string | null
          date_proposition?: string | null
          details?: Json | null
          id?: string
          montant_mensuel?: number | null
          produit?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "propositions_conseiller_id_fkey"
            columns: ["conseiller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propositions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          nom: string
          permissions: Json
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          permissions?: Json
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          permissions?: Json
        }
        Relationships: []
      }
      taches: {
        Row: {
          assigne_a: string
          contact_id: string | null
          created_at: string
          cree_par: string
          date_completion: string | null
          date_echeance: string | null
          description: string | null
          id: string
          priorite: string
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          assigne_a: string
          contact_id?: string | null
          created_at?: string
          cree_par: string
          date_completion?: string | null
          date_echeance?: string | null
          description?: string | null
          id?: string
          priorite?: string
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          assigne_a?: string
          contact_id?: string | null
          created_at?: string
          cree_par?: string
          date_completion?: string | null
          date_echeance?: string | null
          description?: string | null
          id?: string
          priorite?: string
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taches_assigne_a_fkey"
            columns: ["assigne_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taches_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taches_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigne_a: string | null
          contact_id: string
          created_at: string
          cree_par: string
          description: string | null
          id: string
          priorite: string
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          assigne_a?: string | null
          contact_id: string
          created_at?: string
          cree_par: string
          description?: string | null
          id?: string
          priorite?: string
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          assigne_a?: string | null
          contact_id?: string
          created_at?: string
          cree_par?: string
          description?: string | null
          id?: string
          priorite?: string
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigne_a_fkey"
            columns: ["assigne_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          equipe_id: string | null
          id: string
          nom_complet: string
          role_id: string | null
          statut: string | null
        }
        Insert: {
          created_at?: string
          email: string
          equipe_id?: string | null
          id?: string
          nom_complet: string
          role_id?: string | null
          statut?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          equipe_id?: string | null
          id?: string
          nom_complet?: string
          role_id?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_equipe"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          campagne_id: string
          contact_id: string
          created_at: string
          date_prochaine_action: string | null
          donnees_contexte: Json | null
          etape_courante: number | null
          id: string
          statut: string
          updated_at: string
        }
        Insert: {
          campagne_id: string
          contact_id: string
          created_at?: string
          date_prochaine_action?: string | null
          donnees_contexte?: Json | null
          etape_courante?: number | null
          id?: string
          statut?: string
          updated_at?: string
        }
        Update: {
          campagne_id?: string
          contact_id?: string
          created_at?: string
          date_prochaine_action?: string | null
          donnees_contexte?: Json | null
          etape_courante?: number | null
          id?: string
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_campagne_id_fkey"
            columns: ["campagne_id"]
            isOneToOne: false
            referencedRelation: "campagnes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
