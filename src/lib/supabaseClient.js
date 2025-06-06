import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kakrjsytqtijofhudqpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha3Jqc3l0cXRpam9maHVkcXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzE1MTcsImV4cCI6MjA2NDU0NzUxN30.bQNMOZhM9RN0m_oW0pGgXWGPTAEDih0Tao5YE5F7vbI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);