import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxqyxwjbrckbedcwhjsa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cXl4d2picmNrYmVkY3doanNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTAxNzEsImV4cCI6MjA2NDYyNjE3MX0.hE1pDjEVd4Wc1dj7_4RhqNK8CIGB1UNYjER84yp3n-8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);