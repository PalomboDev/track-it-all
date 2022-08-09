import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabaseServiceRole: string = process.env.SERVICE_ROLE as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = typeof window === "undefined" ? createClient(supabaseUrl, supabaseServiceRole) : undefined;
