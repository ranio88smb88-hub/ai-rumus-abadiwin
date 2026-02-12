
export type UserRole = 'admin' | 'operator';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type AIRequestType = 'generator' | 'error' | 'idea' | 'sheet-analysis';

export interface AppearanceSettings {
  bannerStyle: 'default' | 'sunset' | 'ocean' | 'forest' | 'monochrome';
  backgroundType: 'mesh' | 'solid' | 'dots' | 'stars';
  fontFamily: 'Raleway' | 'Poppins' | 'Inter' | 'JetBrains Mono';
  themeColor: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
  tableStyle: 'glass' | 'solid' | 'minimal';
}

export interface AIHistoryItem {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  type: AIRequestType;
  created_at: string;
  user_email?: string;
}

export interface Spreadsheet {
  id: string;
  name: string;
  updated_at: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

export interface SheetConnection {
  id: string;
  user_id: string;
  spreadsheet_id: string;
  spreadsheet_name: string;
  connected_at: string;
}
