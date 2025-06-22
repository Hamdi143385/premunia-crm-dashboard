
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqzpytcbiqvjhjhvrkrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxenB5dGNiaXF2amhqaHZya3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTcwODcsImV4cCI6MjA2NjE3MzA4N30.ghyHvWMSMyWBe3nKAQaXPq-PZkcqTAIIUtsusAO0xXQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
