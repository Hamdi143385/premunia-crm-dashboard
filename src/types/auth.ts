
import { User } from '@supabase/supabase-js';

export interface UserRole {
  id: string;
  nom: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nom_complet: string;
  equipe_id?: string;
  role_id?: string;
  statut: string;
  created_at: string;
  role?: UserRole;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: any;
  app_metadata?: any;
  profile?: UserProfile;
}
