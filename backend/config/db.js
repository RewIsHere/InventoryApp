import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;  // Asegúrate de que esta variable esté bien definida
const supabaseAnonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('supabaseUrl and supabaseAnonKey are required');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
