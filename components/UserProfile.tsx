import React, { useState, useRef } from 'react';
import { User, Stream } from '../types';
import { Button, Input, StreamCard } from './UIComponents';
import { Camera, Save, User as UserIcon, MapPin, Phone, Mail } from 'lucide-react';

interface UserProfileProps {
  user: User;
  streams: Stream[];
  onUpdateUser: (updatedUser: User) => void;
  onNavigateToStream: (stream: Stream) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  streams, 
  onUpdateUser,
  onNavigateToStream
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    country: user.country,
    password: user.password || '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const favoriteStreams = streams.filter(s => user.favorites?.includes(s.id));

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col items-center text-center relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-600 to-blue-600 opacity-50" />
             
             <div className="relative mt-8 mb-4 group">
               <div className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-xl overflow-hidden bg-slate-700">
                 {user.avatar ? (
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400">
                     <UserIcon className="w-16 h-16" />
                   </div>
                 )}
               </div>
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-400 transition-colors"
                 title="Alterar Foto"
               >
                 <Camera className="w-4 h-4" />
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleAvatarChange}
               />
             </div>
             
             <h2 className="text-2xl font-bold text-white">{user.name}</h2>
             <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                user.role === 'VIP' ? 'bg-amber-500 text-white' :
                user.role === 'ADMIN' ? 'bg-purple-500 text-white' :
                'bg-slate-600 text-slate-200'
              }`}>
                {user.role}
             </span>
             
             <div className="mt-6 w-full space-y-3 text-left">
               <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-3 rounded-lg">
                 <Mail className="w-4 h-4 text-teal-400" />
                 <span className="text-sm truncate">{user.email}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-3 rounded-lg">
                 <Phone className="w-4 h-4 text-teal-400" />
                 <span className="text-sm">{user.phone}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-3 rounded-lg">
                 <MapPin className="w-4 h-4 text-teal-400" />
                 <span className="text-sm">{user.city}, {user.country}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Edit Form & Favorites */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Edit Details */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Dados Pessoais</h3>
              {!isEditing && (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                <Input label="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <Input label="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <Input label="Telefone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <Input label="Cidade" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                <Input label="País" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                <Input label="Alterar Senha" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                
                <div className="md:col-span-2 flex gap-3 justify-end mt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button type="submit">
                    <Save className="w-4 h-4" /> Salvar Alterações
                  </Button>
                </div>
              </form>
            ) : (
               <div className="text-slate-400 text-sm">
                 <p>As suas informações pessoais estão seguras. Clique em "Editar Perfil" para atualizar seus dados.</p>
               </div>
            )}
          </div>

          {/* Favorites */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Meus Favoritos</h3>
            {favoriteStreams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteStreams.map(stream => (
                  <StreamCard 
                    key={stream.id} 
                    stream={stream} 
                    onClick={() => onNavigateToStream(stream)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700 border-dashed">
                <p className="text-slate-400">Ainda não tem transmissões favoritas.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
