
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { UserProfile, AIHistoryItem } from '../types';

// Gunakan default string kosong agar tidak error saat build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validasi konfigurasi
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Inisialisasi client hanya jika konfigurasi tersedia
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseService = {
  async login(email: string) {
    if (!supabase) throw new Error("Database belum dikonfigurasi di Vercel.");
    
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
      
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ email, role: 'operator' }])
        .select()
        .single();
      if (insertError) throw insertError;
      profile = newProfile;
    }
    
    localStorage.setItem('op_user', JSON.stringify(profile));
    return profile;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const saved = localStorage.getItem('op_user');
    return saved ? JSON.parse(saved) : null;
  },

  async logout() {
    localStorage.removeItem('op_user');
    if (supabase) await supabase.auth.signOut();
  },

  async addHistory(item: Omit<AIHistoryItem, 'id' | 'created_at'>) {
    if (!supabase) return;
    const { error } = await supabase
      .from('ai_history')
      .insert([item]);
    if (error) console.error("Gagal simpan riwayat:", error);
  },

  async getHistory() {
    if (!supabase) return [];
    const user = await this.getCurrentUser();
    if (!user) return [];
    
    let query = supabase.from('ai_history').select('*').order('created_at', { ascending: false });
    if (user.role !== 'admin') {
      query = query.eq('user_id', user.id);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async deleteHistory(id: string) {
    if (!supabase) return;
    await supabase.from('ai_history').delete().eq('id', id);
  },

  async clearGlobalHistory() {
    if (!supabase) return;
    await supabase.from('ai_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },

  async getAllUsers() {
    if (!supabase) return [];
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async promoteUser(id: string) {
    if (!supabase) return;
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', id);
  },

  async deleteUser(id: string) {
    if (!supabase) return;
    await supabase.from('profiles').delete().eq('id', id);
  },

  async getStats() {
    if (!supabase) return { totalRequests: 0, activeUsers: 0, types: { generator: 0, checker: 0, ideas: 0, analysis: 0 } };
    const [historyRes, usersRes] = await Promise.all([
      supabase.from('ai_history').select('type'),
      supabase.from('profiles').select('id')
    ]);

    const history = historyRes.data || [];
    return {
      totalRequests: history.length,
      activeUsers: (usersRes.data || []).length,
      types: {
        generator: history.filter(h => h.type === 'generator').length,
        checker: history.filter(h => h.type === 'error').length,
        ideas: history.filter(h => h.type === 'idea').length,
        analysis: history.filter(h => h.type === 'sheet-analysis').length,
      }
    };
  }
};
