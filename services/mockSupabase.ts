
import { UserProfile, AIHistoryItem, SheetConnection, UserRole } from "../types";

// Helper to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MockSupabase {
  private users: UserProfile[] = [
    { id: '1', email: 'admin@operator.ai', role: 'admin', created_at: new Date().toISOString() },
    { id: '2', email: 'user@operator.ai', role: 'operator', created_at: new Date().toISOString() }
  ];

  private history: AIHistoryItem[] = [];
  private connections: SheetConnection[] = [];
  private currentUser: UserProfile | null = null;

  async login(email: string): Promise<UserProfile> {
    await delay(800);
    let user = this.users.find(u => u.email === email);
    if (!user) {
      user = { id: Math.random().toString(36).substr(2, 9), email, role: 'operator', created_at: new Date().toISOString() };
      this.users.push(user);
    }
    this.currentUser = user;
    localStorage.setItem('op_user', JSON.stringify(user));
    return user;
  }

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('op_user');
  }

  getCurrentUser(): UserProfile | null {
    if (this.currentUser) return this.currentUser;
    const saved = localStorage.getItem('op_user');
    if (saved) {
      this.currentUser = JSON.parse(saved);
      return this.currentUser;
    }
    return null;
  }

  async addHistory(item: Omit<AIHistoryItem, 'id' | 'created_at'>) {
    const newItem: AIHistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      user_email: this.currentUser?.email
    };
    this.history.unshift(newItem);
    return newItem;
  }

  async getHistory(userId?: string): Promise<AIHistoryItem[]> {
    await delay(300);
    if (this.currentUser?.role === 'admin' && !userId) return this.history;
    return this.history.filter(h => h.user_id === (userId || this.currentUser?.id));
  }

  async deleteHistory(id: string) {
    this.history = this.history.filter(h => h.id !== id);
  }

  async clearGlobalHistory() {
    this.history = [];
  }

  async getAllUsers(): Promise<UserProfile[]> {
    return this.users;
  }

  async promoteUser(id: string) {
    const user = this.users.find(u => u.id === id);
    if (user) user.role = 'admin';
  }

  async deleteUser(id: string) {
    this.users = this.users.filter(u => u.id !== id);
  }

  getStats() {
    return {
      totalRequests: this.history.length,
      activeUsers: this.users.length,
      types: {
        generator: this.history.filter(h => h.type === 'generator').length,
        // Corrected comparison: Use 'error' instead of 'checker' to match AIRequestType
        checker: this.history.filter(h => h.type === 'error').length,
        // Corrected comparison: Use 'idea' instead of 'ideas' to match AIRequestType
        ideas: this.history.filter(h => h.type === 'idea').length,
        // Corrected comparison: Use 'sheet-analysis' instead of 'analysis' to match AIRequestType
        analysis: this.history.filter(h => h.type === 'sheet-analysis').length,
      }
    };
  }
}

export const mockSupabase = new MockSupabase();
