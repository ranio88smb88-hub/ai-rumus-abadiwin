
# 🚀 Panduan Deployment - ai-rumus-abadiwin

Gunakan panduan ini untuk mengaktifkan database dan integrasi Google Sheets.

## 🛠️ Langkah 1: Setup Database (Supabase)
1. Buka project Anda di Supabase.
2. **Cari Project URL**: Klik menu **Project Settings > API**.
3. Copy **Project URL** (Contoh: `https://ebumpfvebtpxnzbhngef.supabase.co`).
4. Copy **anon / public key**.
5. Buka **SQL Editor** dan jalankan script ini untuk membuat tabel:

```sql
-- Tabel Profil Pengguna
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'operator',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Riwayat Audit AI
CREATE TABLE IF NOT EXISTS ai_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  prompt TEXT,
  response TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Langkah 2: Environment Variables (Vercel)
Wajib diisi di **Settings > Environment Variables**:

| Key | Value |
|---|---|
| `API_KEY` | (Dari Google AI Studio) |
| `GOOGLE_CLIENT_ID` | (Dari Google Cloud Console) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ebumpfvebtpxnzbhngef.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Kunci 'anon' dari Supabase API Settings) |

## 🌐 Langkah 3: OAuth Google Cloud
Pada Client ID Anda, masukkan:
- **Authorized JavaScript Origins**: 
  `https://ai-rumus-abadiwin.vercel.app`
- **Authorized Redirect URIs**: 
  `https://ai-rumus-abadiwin.vercel.app/api/auth/callback/google`
