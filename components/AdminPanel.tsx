import React, { useState } from 'react';
import { User, Stream, UserRole } from '../types';
import { Button, Input, Select, Modal } from './UIComponents';
import { 
  Users, Video, Shield, Search, Trash2, Edit, CheckCircle, 
  XCircle, Key, Activity, Plus, Save, RefreshCw, Calendar, AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdminPanelProps {
  users: User[];
  streams: Stream[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
  apiBaseUrl: string;
  authToken: string | null;
  onRefreshUsers: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  streams,
  setUsers,
  setStreams,
  apiBaseUrl,
  authToken,
  onRefreshUsers,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'streams' | 'access'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // User Form State
  const [userForm, setUserForm] = useState({
    name: '', email: '', phone: '', age: '', city: '', country: '', 
    gender: 'Masculino', role: 'USER', password: '', expirationDate: '',
    allowedStreamIds: [] as string[]
  });

  // Helper to reset form
  const resetForm = () => {
    setUserForm({
      name: '', email: '', phone: '', age: '', city: '', country: '', 
      gender: 'Masculino', role: 'USER', password: '', expirationDate: '',
      allowedStreamIds: []
    });
    setEditingUser(null);
  };

  // Helper to generate credentials
  const generateCredentials = () => {
    const randomUser = `user${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPass = Math.random().toString(36).slice(-8);
    setUserForm(prev => ({
      ...prev,
      email: prev.email || randomUser, // Use email field for username if empty
      password: randomPass
    }));
  };

  // Stats Data
  const statsData = [
    { name: 'Total', value: users.length },
    { name: 'Ativos', value: users.filter(u => u.isActive).length },
    { name: 'VIP', value: users.filter(u => u.role === UserRole.VIP).length },
    { name: 'Streams', value: streams.length },
  ];

  // User Management Logic
  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  const handleDeleteUser = async (userId: string) => {
    if (!authToken) return;
    if (confirm('Tem certeza que deseja eliminar este utilizador?')) {
      const response = await fetch(`${apiBaseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        await onRefreshUsers();
      } else {
        alert('Não foi possível eliminar o utilizador.');
      }
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age.toString(),
      city: user.city,
      country: user.country,
      gender: user.gender,
      role: user.role,
      password: user.password || '',
      expirationDate: user.expirationDate || '',
      allowedStreamIds: user.allowedStreamIds || []
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.password) {
      alert("Por favor preencha os campos obrigatórios (Nome, Email, Senha)");
      return;
    }

    if (!userForm.email.includes('@')) {
      alert('Informe um email válido (ex: nome@email.com).');
      return;
    }

    if (!authToken) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    if (editingUser) {
      const response = await fetch(`${apiBaseUrl}/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fullName: userForm.name,
          role: userForm.role,
          password: userForm.password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        alert(errorBody?.message || 'Não foi possível atualizar o utilizador.');
        return;
      }
    } else {
      const response = await fetch(`${apiBaseUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          email: userForm.email,
          password: userForm.password,
          fullName: userForm.name,
          role: userForm.role,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        alert(errorBody?.message || 'Não foi possível criar o utilizador.');
        return;
      }
    }

    await onRefreshUsers();
    setIsUserModalOpen(false);
    resetForm();
  };

  // Toggle stream selection
  const toggleStreamAccess = (streamId: string) => {
    setUserForm(prev => {
      const exists = prev.allowedStreamIds.includes(streamId);
      if (exists) {
        return { ...prev, allowedStreamIds: prev.allowedStreamIds.filter(id => id !== streamId) };
      } else {
        return { ...prev, allowedStreamIds: [...prev.allowedStreamIds, streamId] };
      }
    });
  };

  // Stream Management
  const [newStream, setNewStream] = useState<Partial<Stream>>({
    title: '', description: '', sourceType: 'YOUTUBE', sourceUrl: '', accessLevel: 'PUBLIC', category: 'Geral'
  });

  const handleAddStream = () => {
    if (!newStream.title || !newStream.sourceUrl) return;
    const stream: Stream = {
      id: Date.now().toString(),
      thumbnail: `https://picsum.photos/800/450?random=${Date.now()}`,
      isLive: true,
      viewers: 0,
      ...newStream as any
    };
    setStreams([...streams, stream]);
    setNewStream({ title: '', description: '', sourceType: 'YOUTUBE', sourceUrl: '', accessLevel: 'PUBLIC', category: 'Geral' });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Painel de Administração</h1>
          <p className="text-slate-400">Gerencie utilizadores, streams e permissões.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat, idx) => (
            <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm">{stat.name}</p>
              <p className="text-2xl font-bold text-teal-400">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700 pb-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Users className="w-5 h-5" /> Gestão de Utilizadores
          </button>
          <button 
            onClick={() => setActiveTab('streams')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'streams' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Video className="w-5 h-5" /> Gestão de Streams
          </button>
          <button 
            onClick={() => setActiveTab('access')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'access' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-5 h-5" /> Controlo de Acesso
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden min-h-[500px]">
          
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar utilizador..." 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:border-teal-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => { resetForm(); setIsUserModalOpen(true); }}>
                  <Plus className="w-4 h-4" /> Adicionar Utilizador
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-3">Nome / Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Validade</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <img 
                               src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                               alt="" 
                               className="w-8 h-8 rounded-full"
                             />
                             <div>
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-sm text-slate-400">{user.email}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                            user.role === 'VIP' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-600/20 text-slate-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {user.expirationDate ? new Date(user.expirationDate).toLocaleDateString() : 'Ilimitado'}
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleToggleStatus(user.id)} className="focus:outline-none" title="Clique para alterar">
                            {user.isActive ? 
                              <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-4 h-4"/> Ativo</span> : 
                              <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-4 h-4"/> Suspenso</span>
                            }
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleEditClick(user)}
                                title="Editar"
                                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                          {user.role !== 'ADMIN' && (
                            <>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                title="Eliminar"
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STREAMS TAB */}
          {activeTab === 'streams' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 h-fit">
                  <h3 className="font-bold text-lg mb-4 text-teal-400 flex items-center gap-2">
                    <Video className="w-5 h-5" /> Nova Transmissão
                  </h3>
                  <div className="space-y-4">
                    <Input 
                      label="Título" 
                      value={newStream.title} 
                      onChange={e => setNewStream({...newStream, title: e.target.value})}
                    />
                    <Input 
                      label="Descrição" 
                      value={newStream.description} 
                      onChange={e => setNewStream({...newStream, description: e.target.value})}
                    />
                    <Select 
                      label="Tipo de Fonte"
                      value={newStream.sourceType}
                      onChange={e => setNewStream({...newStream, sourceType: e.target.value as any})}
                    >
                      <option value="YOUTUBE">YouTube Live</option>
                      <option value="OBS">OBS / HLS Stream</option>
                    </Select>
                    <Input 
                      label={newStream.sourceType === 'YOUTUBE' ? "YouTube Video ID" : "HLS URL (.m3u8)"}
                      placeholder={newStream.sourceType === 'YOUTUBE' ? "Ex: jfKfPfyJRdk" : "https://..."}
                      value={newStream.sourceUrl} 
                      onChange={e => setNewStream({...newStream, sourceUrl: e.target.value})}
                    />
                    <Select 
                      label="Acesso"
                      value={newStream.accessLevel}
                      onChange={e => setNewStream({...newStream, accessLevel: e.target.value as any})}
                    >
                      <option value="PUBLIC">Público</option>
                      <option value="VIP">VIP Apenas</option>
                    </Select>
                    <Button onClick={handleAddStream} className="w-full mt-2">
                      <Plus className="w-4 h-4" /> Iniciar Stream
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-lg text-white">Transmissões Ativas</h3>
                  {streams.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 bg-slate-900 rounded-lg">
                      Nenhuma transmissão ativa no momento.
                    </div>
                  ) : (
                    streams.map(stream => (
                      <div key={stream.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex gap-4 items-center">
                        <img src={stream.thumbnail} className="w-32 h-20 object-cover rounded bg-slate-800" alt="" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-white">{stream.title}</h4>
                              <p className="text-xs text-slate-400 mt-1">{stream.accessLevel === 'VIP' ? '🔒 VIP' : '🌍 Público'} • {stream.sourceType}</p>
                            </div>
                            <button 
                              onClick={() => setStreams(streams.filter(s => s.id !== stream.id))}
                              className="text-red-400 hover:text-red-300"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                             <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">LIVE</span>
                             <span className="text-xs text-slate-400">{stream.viewers} assistindo</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ACCESS CONTROL TAB */}
          {activeTab === 'access' && (
            <div className="p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" /> Estatísticas de Acesso
              </h3>
              
              <div className="h-64 w-full bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#2dd4bf' }}
                    />
                    <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-white mb-2">Logs de Acesso Recente</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex justify-between"><span>Login: João Silva</span> <span>10:30 AM</span></li>
                    <li className="flex justify-between"><span>Stream Iniciada: Culto Jovem</span> <span>10:00 AM</span></li>
                    <li className="flex justify-between text-amber-400"><span>VIP Gerado: Maria Costa</span> <span>09:15 AM</span></li>
                    <li className="flex justify-between text-red-400"><span>Login Falhado: admin</span> <span>09:00 AM</span></li>
                  </ul>
                </div>
            </div>
          )}

        </div>

        {/* Add/Edit User Modal */}
        <Modal 
          isOpen={isUserModalOpen} 
          onClose={() => setIsUserModalOpen(false)}
          title={editingUser ? "Editar Utilizador" : "Adicionar Novo Utilizador"}
        >
          <form onSubmit={handleSaveUser} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Nome" 
                 value={userForm.name} 
                 onChange={e => setUserForm({...userForm, name: e.target.value})} 
               />
               <Input 
                 label="Email / Username" 
                 value={userForm.email} 
                 onChange={e => setUserForm({...userForm, email: e.target.value})} 
               />
             </div>
             
             {/* Auto Generation Section */}
             <div className="bg-slate-900/50 p-3 rounded border border-slate-700 flex justify-between items-center">
                <div>
                   <span className="text-sm font-bold text-teal-400">Credenciais</span>
                   <p className="text-xs text-slate-400">Gerar acesso automático?</p>
                </div>
                <Button type="button" variant="secondary" onClick={generateCredentials} className="text-xs py-1 h-8">
                  <RefreshCw className="w-3 h-3" /> Gerar Automático
                </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Senha" 
                 type="text" // Visible so admin can see generated password
                 value={userForm.password} 
                 onChange={e => setUserForm({...userForm, password: e.target.value})} 
                 placeholder={editingUser ? "(Não alterada)" : "Senha"}
               />
                <Select 
                 label="Função (Role)" 
                 value={userForm.role} 
                 onChange={e => setUserForm({...userForm, role: e.target.value})}
               >
                  <option value="USER">Utilizador</option>
                  <option value="VIP">VIP</option>
                  <option value="ADMIN">Administrador</option>
               </Select>
             </div>
             
             {/* Stream Selection for VIP */}
             {userForm.role === 'VIP' && (
               <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 animate-in fade-in">
                 <label className="block text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                   <Video className="w-4 h-4" /> Permitir acesso a:
                 </label>
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                   {streams.map(stream => (
                     <div key={stream.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 transition-colors">
                       <input 
                         type="checkbox" 
                         id={`stream-${stream.id}`}
                         checked={userForm.allowedStreamIds.includes(stream.id)}
                         onChange={() => toggleStreamAccess(stream.id)}
                         className="w-4 h-4 accent-teal-500"
                       />
                       <label htmlFor={`stream-${stream.id}`} className="text-sm text-slate-300 cursor-pointer flex-1">
                         {stream.title} 
                         {stream.accessLevel === 'VIP' && <span className="ml-2 text-xs text-amber-500 font-bold border border-amber-500/30 px-1 rounded">VIP</span>}
                       </label>
                     </div>
                   ))}
                   {streams.length === 0 && <p className="text-sm text-slate-500 italic">Nenhuma transmissão disponível.</p>}
                 </div>
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Data de Expiração" 
                  type="date"
                  value={userForm.expirationDate} 
                  onChange={e => setUserForm({...userForm, expirationDate: e.target.value})}
                />
                <Select 
                 label="Género" 
                 value={userForm.gender} 
                 onChange={e => setUserForm({...userForm, gender: e.target.value})}
               >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
               </Select>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Telefone" 
                 value={userForm.phone} 
                 onChange={e => setUserForm({...userForm, phone: e.target.value})} 
               />
               <Input 
                 label="Idade" 
                 type="number"
                 value={userForm.age} 
                 onChange={e => setUserForm({...userForm, age: e.target.value})} 
               />
             </div>
             
             <div className="pt-4 flex justify-end gap-3">
               <Button type="button" variant="ghost" onClick={() => setIsUserModalOpen(false)}>Cancelar</Button>
               <Button type="submit">
                 <Save className="w-4 h-4" /> {editingUser ? "Atualizar" : "Criar Utilizador"}
               </Button>
             </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};
