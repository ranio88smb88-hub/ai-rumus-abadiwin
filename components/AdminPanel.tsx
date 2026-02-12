
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { mockSupabase } from '../services/mockSupabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Fix: Added tableStyle to Props to match the properties passed from Dashboard.tsx
interface Props {
  onActionComplete: () => void;
  tableStyle?: 'glass' | 'solid' | 'minimal';
}

const AdminPanel: React.FC<Props> = ({ onActionComplete, tableStyle = 'glass' }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    const [u, s] = await Promise.all([
      mockSupabase.getAllUsers(),
      mockSupabase.getStats()
    ]);
    setUsers(u);
    setStats(s);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handlePromote = async (id: string) => {
    await mockSupabase.promoteUser(id);
    fetchAdminData();
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      await mockSupabase.deleteUser(id);
      fetchAdminData();
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Hapus SEMUA riwayat AI secara global? Tindakan ini tidak dapat dibatalkan.')) {
      await mockSupabase.clearGlobalHistory();
      fetchAdminData();
      onActionComplete();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <i className="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-600"></i>
    </div>
  );

  const chartData = [
    { name: 'Generator', value: stats?.types.generator || 0, color: '#6366f1' },
    { name: 'Pemeriksa', value: stats?.types.checker || 0, color: '#f43f5e' },
    { name: 'Ide', value: stats?.types.ideas || 0, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-users text-indigo-400"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Pengguna</p>
            <h4 className="text-2xl font-bold text-white">{stats?.activeUsers}</h4>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-bolt text-emerald-400"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Permintaan AI</p>
            <h4 className="text-2xl font-bold text-white">{stats?.totalRequests}</h4>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <button 
            onClick={handleClearHistory}
            className="w-full text-left flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center group-hover:bg-rose-500 transition-colors">
              <i className="fa-solid fa-dumpster-fire text-rose-400 group-hover:text-white"></i>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Pemeliharaan Sistem</p>
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-tighter">Hapus Semua Riwayat</h4>
            </div>
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Distribusi Penggunaan Fitur</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`rounded-2xl overflow-hidden ${tableStyle === 'glass' ? 'glass' : tableStyle === 'solid' ? 'bg-slate-900 border-2 border-slate-800' : 'border-t border-slate-800'}`}>
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Manajemen Pengguna</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Peran</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Terdaftar</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {u.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-200">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Operator'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(u.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handlePromote(u.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Promosikan
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
