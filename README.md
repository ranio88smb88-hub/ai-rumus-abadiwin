
# 🚀 Panduan Deployment Produksi - Operator AI Formula Pro

Gunakan panduan ini untuk memastikan fitur "Real-Time Audit" berjalan lancar dengan integrasi Google Sheets API.

## 🛠️ Langkah 1: Setup Database (Supabase)
Jalankan script SQL berikut di SQL Editor Supabase Anda:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'operator',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  prompt TEXT,
  response TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Langkah 2: Environment Variables (Vercel)
Wajib diisi di **Settings > Environment Variables** di dasbor Vercel:

| Variable | Sumber | Deskripsi |
|---|---|---|
| `API_KEY` | [Google AI Studio](https://aistudio.google.com/) | API Key untuk Gemini AI |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/) | OAuth 2.0 Client ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings | URL API Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings | Anon Key Supabase |

## 🌐 Langkah 3: Konfigurasi OAuth Google
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Pilih proyek Anda, buka **APIs & Services > Credentials**.
3. Edit **OAuth 2.0 Client ID** Anda.
4. **Authorized JavaScript Origins**:
   - Tambahkan `http://localhost:3000`
   - Tambahkan `https://nama-aplikasi-anda.vercel.app` (Dapatkan dari Vercel Dashboard)
5. **Authorized Redirect URIs**:
   - Tambahkan `http://localhost:3000/api/auth/callback/google`
   - Tambahkan `https://nama-aplikasi-anda.vercel.app/api/auth/callback/google`
6. Pastikan Anda sudah mengaktifkan **Google Sheets API** di menu "Library".

## 🚀 Langkah 4: Deployment
Push kode ke GitHub, hubungkan ke Vercel. Jangan lupa melakukan **Redeploy** setiap kali Anda mengubah Environment Variables di dasbor Vercel.

## 🛡️ Jaminan Keamanan
Aplikasi ini menggunakan scope `auth/spreadsheets.readonly`. 
- **Read-Only**: Aplikasi hanya membaca struktur metadata.
- **No Data Storage**: Isi sel spreadsheet tidak pernah disimpan di database kami.
- **Encrypted**: Koneksi menggunakan terowongan aman HTTPS Google.
