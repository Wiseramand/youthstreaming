import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { User, Stream, UserRole, ScheduleItem } from './types';
import { MOCK_USERS, MOCK_STREAMS, MOCK_SCHEDULE } from './constants';
import { AdminPanel } from './components/AdminPanel';
import { UserProfile } from './components/UserProfile';
import { Chat } from './components/Chat';
import { DonationModal } from './components/DonationModal';
import { Button, Input, StreamCard, Select, Modal } from './components/UIComponents';
import { 
  Menu, X, Play, Calendar, User as UserIcon, LogOut, 
  Lock, Tv, Check, Mail, Star, ChevronRight, Info, Heart, Key
} from 'lucide-react';

// --- Helper Components ---

const Navbar: React.FC<{ 
  user: User | null; 
  onLogout: () => void; 
  onNavigate: (page: string) => void;
  currentPage: string;
  onDonate: () => void;
}> = ({ user, onLogout, onNavigate, currentPage, onDonate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Início', icon: <Tv className="w-4 h-4" /> },
    { id: 'schedule', label: 'Horários', icon: <Calendar className="w-4 h-4" /> },
  ];

  if (user && user.role === UserRole.ADMIN) {
    navItems.push({ id: 'admin', label: 'Painel Admin', icon: <Lock className="w-4 h-4" /> });
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-white/5 py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-teal-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform opacity-50 blur-sm"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
                  <Play className="w-5 h-5 text-teal-400 fill-current" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white tracking-tight leading-none">
                  Youth<span className="text-teal-400">Angola</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Streaming Platform</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === item.id 
                    ? 'text-white bg-teal-500 shadow-lg shadow-teal-500/25' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu & Donate */}
          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              <button 
                onClick={onDonate}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4 fill-current" /> Ofertar
              </button>
              
              <div className="h-6 w-px bg-white/10"></div>

              {user ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onNavigate('profile')}
                    className="group flex items-center gap-3 pl-1 pr-4 py-1 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="relative w-9 h-9">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-teal-500 transition-colors">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                              <UserIcon className="w-4 h-4" />
                            </div>
                          )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight">{user.name.split(' ')[0]}</span>
                      {user.role === 'VIP' && <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 rounded-sm">VIP MEMBER</span>}
                    </div>
                  </button>
                  <button 
                    onClick={onLogout} 
                    title="Sair" 
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => onNavigate('login')} className="text-sm">Entrar</Button>
                  <Button onClick={() => onNavigate('register')} className="bg-white text-slate-900 hover:bg-slate-200 hover:text-slate-900 shadow-none text-sm font-bold">Registar</Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 animate-in slide-in-from-top-5">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    currentPage === item.id 
                    ? 'bg-teal-500 text-white' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}

            <button
                onClick={() => { onDonate(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 shadow-lg shadow-amber-500/20"
              >
                <Heart className="w-5 h-5 fill-current" /> Fazer uma Oferta
            </button>
            
            <div className="my-4 border-t border-white/10"></div>

            {user ? (
              <>
                 <button
                  onClick={() => { onNavigate('profile'); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700">
                     {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <UserIcon className="w-full h-full p-1"/>}
                  </div>
                  Meu Perfil
                </button>
                <button 
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Sair da Conta
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="secondary" onClick={() => { onNavigate('login'); setIsOpen(false); }} className="w-full justify-center">Entrar</Button>
                <Button onClick={() => { onNavigate('register'); setIsOpen(false); }} className="w-full justify-center">Registar</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Hero Session Component ---

const HeroSession: React.FC<{ onWatch: () => void }> = ({ onWatch }) => (
  <div className="relative w-full h-[85vh] md:h-[75vh] overflow-hidden mb-8 group">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Pastor_Chris_Oyakhilome_DSC_0109.jpg" 
        alt="Pastor Chris Oyakhilome" 
        className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-[20s] ease-in-out"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-slate-900/40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
    </div>

    {/* Content */}
    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-24">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
           <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
           <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Live & Exclusivo</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Transforme a Sua Vida <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Com a Palavra</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Conecte-se com o Pastor Chris Oyakhilome e a comunidade Youth Angola. 
          Momentos de louvor, adoração e ensinamentos que moldam o futuro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            onClick={onWatch}
            className="flex items-center justify-center gap-3 bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1"
          >
            <Play className="w-5 h-5 fill-current" />
            Assistir Agora
          </button>
          <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all hover:border-white/40">
            <Info className="w-5 h-5" />
            Saber Mais
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [streams, setStreams] = useState<Stream[]>(MOCK_STREAMS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // The Featured Stream (Hero)
  const [featuredStream, setFeaturedStream] = useState<Stream | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // VIP Login Modal State
  const [isVipLoginModalOpen, setIsVipLoginModalOpen] = useState(false);
  const [vipLoginData, setVipLoginData] = useState({ identifier: '', password: '' });
  
  // Donation Modal State
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // Forms State
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [regData, setRegData] = useState({
    name: '', email: '', phone: '', age: '', city: '', country: '', gender: 'Masculino', password: ''
  });
  const [authError, setAuthError] = useState('');
  const [resetData, setResetData] = useState({ email: '', newPassword: '' });
  const [resetMessage, setResetMessage] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  
  // Scroll helper
  const videoSectionRef = React.useRef<HTMLDivElement>(null);

  // Set default featured stream on load
  useEffect(() => {
    // Pick the first live public stream as default, or any stream
    const defaultStream = streams.find(s => s.isLive && s.accessLevel === 'PUBLIC') || streams[0];
    setFeaturedStream(defaultStream);
  }, [streams]);

  useEffect(() => {
    if (!featuredStream || featuredStream.sourceType !== 'OBS' || !videoRef.current) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    const video = videoRef.current;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(featuredStream.sourceUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = featuredStream.sourceUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [featuredStream]);

  const fetchAdminUsers = async (token: string) => {
    const response = await fetch(`${apiBaseUrl}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return;
    }

    const adminUsers = await response.json();
    setUsers((prev) => {
      const mapped = adminUsers.map((user: any) => {
        const existing = prev.find((u) => u.id === user.id);
        return {
          id: user.id,
          name: existing?.name || user.profile?.fullName || user.email,
          email: user.email,
          phone: existing?.phone || '',
          age: existing?.age || 0,
          city: existing?.city || '',
          country: existing?.country || '',
          gender: existing?.gender || 'Masculino',
          role: user.role,
          isActive: true,
          createdAt: user.createdAt || new Date().toISOString(),
          avatar: existing?.avatar,
          favorites: existing?.favorites,
        } as User;
      });
      return mapped.length > 0 ? mapped : prev;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.identifier,
          password: loginData.password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        setAuthError(errorBody?.message || 'Credenciais inválidas.');
        return;
      }

      const result = await response.json();
      const profileName = result?.user?.profile?.fullName || result?.user?.email || 'Utilizador';
      const user: User = {
        id: result.user.id,
        name: profileName,
        email: result.user.email,
        phone: '',
        age: 0,
        city: '',
        country: '',
        gender: 'Masculino',
        role: result.user.role,
        isActive: true,
        createdAt: result.user.createdAt || new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=0D9488&color=fff`,
      };

      setAuthToken(result.token);
      setCurrentUser(user);

      if (user.role === UserRole.ADMIN) {
        await fetchAdminUsers(result.token);
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    } catch (error) {
      setAuthError('Erro ao conectar ao servidor.');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.identifier,
          password: loginData.password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        setAuthError(errorBody?.message || 'Credenciais inválidas.');
        return;
      }

      const result = await response.json();
      if (result.user.role !== UserRole.ADMIN) {
        setAuthError('Acesso restrito para administradores.');
        return;
      }

      const profileName = result?.user?.profile?.fullName || result?.user?.email || 'Administrador';
      const user: User = {
        id: result.user.id,
        name: profileName,
        email: result.user.email,
        phone: '',
        age: 0,
        city: '',
        country: '',
        gender: 'Masculino',
        role: result.user.role,
        isActive: true,
        createdAt: result.user.createdAt || new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=0D9488&color=fff`,
      };

      setAuthToken(result.token);
      setCurrentUser(user);
      await fetchAdminUsers(result.token);
      setCurrentPage('admin');
    } catch (error) {
      setAuthError('Erro ao conectar ao servidor.');
    }
  };

  const handleVipLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: vipLoginData.identifier,
          password: vipLoginData.password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        setAuthError(errorBody?.message || 'Credenciais inválidas.');
        return;
      }

      const result = await response.json();
      const profileName = result?.user?.profile?.fullName || result?.user?.email || 'Utilizador';
      const user: User = {
        id: result.user.id,
        name: profileName,
        email: result.user.email,
        phone: '',
        age: 0,
        city: '',
        country: '',
        gender: 'Masculino',
        role: result.user.role,
        isActive: true,
        createdAt: result.user.createdAt || new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=0D9488&color=fff`,
      };

      setAuthToken(result.token);
      setCurrentUser(user);
      setIsVipLoginModalOpen(false);
      setVipLoginData({ identifier: '', password: '' });
      setCurrentPage('home');

      if (user.role === UserRole.ADMIN) {
        await fetchAdminUsers(result.token);
      }
    } catch (error) {
      setAuthError('Erro ao conectar ao servidor.');
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      setAuthError('Preencha os campos obrigatórios.');
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regData.email,
          password: regData.password,
          fullName: regData.name,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        setAuthError(errorBody?.message || 'Não foi possível criar a conta.');
        return;
      }

      const result = await response.json();
      const user: User = {
        id: result.user.id,
        name: regData.name,
        email: result.user.email,
        phone: regData.phone,
        age: Number(regData.age || 0),
        city: regData.city,
        country: regData.country,
        gender: regData.gender,
        role: result.user.role,
        isActive: true,
        createdAt: result.user.createdAt || new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(regData.name)}&background=random`
      };

      setAuthToken(result.token);
      setUsers((prev) => [...prev, user]);
      setCurrentUser(user);
      setCurrentPage('home');
    } catch (error) {
      setAuthError('Erro ao conectar ao servidor.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setResetMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetData.email,
          newPassword: resetData.newPassword,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        setAuthError(body?.message || 'Não foi possível redefinir a senha.');
        return;
      }

      setResetMessage(body?.message || 'Senha atualizada com sucesso.');
      setResetData({ email: '', newPassword: '' });
    } catch (error) {
      setAuthError('Erro ao conectar ao servidor.');
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setCurrentPage('login');
    setLoginData({ identifier: '', password: '' });
  };

  const handleStreamClick = (stream: Stream) => {
    if (!currentUser) {
      // Allow clicking if it's public, otherwise prompt login
      if(stream.accessLevel === 'PUBLIC') {
         setFeaturedStream(stream);
         videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
         setIsVipLoginModalOpen(true);
      }
      return;
    }
    
    // Check permission logic
    const isAllowed = 
      currentUser.role === UserRole.ADMIN || 
      stream.accessLevel === 'PUBLIC' || 
      (currentUser.role === UserRole.VIP && (!currentUser.allowedStreamIds?.length || currentUser.allowedStreamIds.includes(stream.id)));

    if (!isAllowed) {
      alert('Acesso negado: Você não tem permissão para assistir a este conteúdo.');
      return;
    }

    setFeaturedStream(stream);
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
      videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Views ---

  const renderHome = () => {
    // Filter logic same as before
    const displayedStreams = streams.filter(s => {
      if (!currentUser) return s.accessLevel === 'PUBLIC' || s.accessLevel === 'VIP'; 
      if (currentUser.role === UserRole.ADMIN) return true;
      if (currentUser.role === UserRole.USER) return s.accessLevel === 'PUBLIC';
      if (currentUser.role === UserRole.VIP) {
        if (currentUser.allowedStreamIds && currentUser.allowedStreamIds.length > 0) {
           return s.accessLevel === 'PUBLIC' || currentUser.allowedStreamIds.includes(s.id);
        }
        return true; 
      }
      return false;
    });

    return (
      <div className="pb-12">
        {/* HERO SECTION */}
        <HeroSession onWatch={scrollToVideo} />

        {/* CONTENT SECTION */}
        <div ref={videoSectionRef} className="px-4 max-w-7xl mx-auto scroll-mt-24">
            
            {/* HERO SESSION: Media + Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 animate-in fade-in duration-500">
            
            {/* Video Player */}
            <div className="lg:col-span-2">
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl shadow-teal-500/10 border border-slate-700 aspect-video relative group">
                {featuredStream ? (
                    <>
                    {featuredStream.sourceType === 'YOUTUBE' ? (
                        <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${featuredStream.sourceUrl}?autoplay=0`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full bg-black">
                          <video
                            ref={videoRef}
                            controls
                            className="w-full h-full"
                            poster={featuredStream.thumbnail}
                          />
                        </div>
                    )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                    <p>Selecione uma transmissão</p>
                    </div>
                )}
                </div>
                
                {featuredStream && (
                    <div className="mt-4 p-6 bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {featuredStream.isLive && (
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse shadow-lg shadow-red-600/20">AO VIVO</span>
                            )}
                            {featuredStream.accessLevel === 'VIP' && (
                                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg shadow-amber-500/20">VIP</span>
                            )}
                            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{featuredStream.title}</h1>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed">{featuredStream.description}</p>
                        </div>
                        {currentUser && (
                            <button 
                            onClick={() => {
                                const isFav = currentUser.favorites?.includes(featuredStream.id);
                                const newFavs = isFav 
                                ? (currentUser.favorites || []).filter(id => id !== featuredStream.id)
                                : [...(currentUser.favorites || []), featuredStream.id];
                                handleUpdateUser({ ...currentUser, favorites: newFavs });
                            }}
                            className={`p-3 rounded-full transition-all ${
                                currentUser.favorites?.includes(featuredStream.id) 
                                ? 'bg-yellow-400/10 text-yellow-400' 
                                : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                            >
                            <Star className={`w-6 h-6 ${currentUser.favorites?.includes(featuredStream.id) ? 'fill-current' : ''}`} />
                            </button>
                        )}
                    </div>
                    </div>
                )}
            </div>

            {/* Live Chat */}
            <div className="lg:col-span-1 h-full min-h-[500px] lg:min-h-0">
                <Chat currentUser={currentUser} className="h-full shadow-2xl shadow-black/20" />
            </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-white/5 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                        <Tv className="text-teal-400 w-8 h-8" /> 
                        Transmissões Disponíveis
                    </h2>
                    <p className="text-slate-400">Escolha o seu próximo momento de inspiração</p>
                </div>
            
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsVipLoginModalOpen(true)}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5`}
                    >
                        <Lock className="w-4 h-4" /> Acesso VIP
                    </button>
                </div>
            </div>

            {/* Stream Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {displayedStreams.length > 0 ? (
                displayedStreams.map(stream => (
                <StreamCard 
                    key={stream.id} 
                    stream={stream} 
                    onClick={() => handleStreamClick(stream)} 
                />
                ))
            ) : (
                <div className="col-span-full py-20 text-center bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Acesso Restrito</h3>
                    <p className="text-slate-400 max-w-md mx-auto">Não existem eventos disponíveis para o seu nível de acesso atual. Contacte a administração ou faça login como VIP.</p>
                </div>
            )}
            </div>
        </div>
      </div>
    );
  };

  const renderSchedule = () => (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-12">
         <h1 className="text-4xl font-bold text-white mb-4">Programação Semanal</h1>
         <p className="text-slate-400">Não perca nenhum dos nossos encontros</p>
      </div>
      
      <div className="space-y-4">
        {MOCK_SCHEDULE.map(item => (
          <div key={item.id} className="group flex flex-col md:flex-row md:items-center justify-between bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-teal-500/50 hover:bg-slate-800 transition-all duration-300">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-teal-500 to-blue-600 w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                 <span className="text-xs uppercase font-bold opacity-80 tracking-wider">{item.day.slice(0,3)}</span>
                 <span className="text-2xl font-bold">{item.time}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">{item.programName}</h3>
                <p className="text-slate-400 flex items-center gap-2 text-sm">
                  <UserIcon className="w-3 h-3" /> {item.host}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center">
               {item.type === 'LIVE' ? (
                 <span className="bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold border border-red-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    DIRECTO
                 </span>
               ) : (
                 <span className="bg-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-xs font-bold">REPETIÇÃO</span>
               )}
               <ChevronRight className="w-5 h-5 text-slate-600 ml-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm"></div>

      <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20">
             <Play className="w-8 h-8 text-white fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h2>
          <p className="text-slate-400">Entre na sua conta para continuar</p>
        </div>
        
        {authError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center flex items-center justify-center gap-2">
            <Info className="w-4 h-4" /> {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Email ou Username" 
            placeholder="ex: joao@email.com"
            value={loginData.identifier}
            onChange={e => setLoginData({...loginData, identifier: e.target.value})}
            className="bg-slate-800/50 focus:bg-slate-800 transition-colors"
          />
          <Input 
            label="Senha" 
            type="password"
            placeholder="••••••••"
            value={loginData.password}
            onChange={e => setLoginData({...loginData, password: e.target.value})}
            className="bg-slate-800/50 focus:bg-slate-800 transition-colors"
          />
          <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-teal-500/20">Entrar na Plataforma</Button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Ainda não tem conta? <button onClick={() => setCurrentPage('register')} className="text-teal-400 hover:text-teal-300 font-bold transition-colors ml-1">Criar conta gratuita</button>
        </p>
        <p className="text-center mt-3 text-slate-400 text-sm">
          Esqueceu a senha? <button onClick={() => setCurrentPage('reset')} className="text-teal-400 hover:text-teal-300 font-bold transition-colors ml-1">Redefinir senha</button>
        </p>
        <p className="text-center mt-3 text-slate-400 text-sm">
          Área Admin? <button onClick={() => {
            const adminKey = prompt('Digite a chave de acesso administrativo:');
            if (adminKey === 'YOUTH_ADMIN_2025') {
              setCurrentPage('admin-login');
            } else {
              alert('Chave de acesso inválida!');
            }
          }} className="text-amber-400 hover:text-amber-300 font-bold transition-colors ml-1">Entrar como admin</button>
        </p>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
           <span className="text-xs text-slate-600 font-mono">Use suas credenciais para entrar.</span>
        </div>
      </div>
    </div>
  );

  const renderAdminLogin = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm"></div>

      <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Login Admin</h2>
          <p className="text-slate-400">Acesso restrito</p>
        </div>

        {authError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center flex items-center justify-center gap-2">
            <Info className="w-4 h-4" /> {authError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <Input
            label="Email"
            placeholder="admin@email.com"
            value={loginData.identifier}
            onChange={e => setLoginData({ ...loginData, identifier: e.target.value })}
            className="bg-slate-800/50 focus:bg-slate-800 transition-colors"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={loginData.password}
            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
            className="bg-slate-800/50 focus:bg-slate-800 transition-colors"
          />
          <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-amber-500/20 bg-amber-500 hover:bg-amber-400">
            Entrar como Admin
          </Button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Voltar para login normal? <button onClick={() => setCurrentPage('login')} className="text-teal-400 hover:text-teal-300 font-bold transition-colors ml-1">Voltar</button>
        </p>
      </div>
    </div>
  );

  const renderResetPassword = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm"></div>

      <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Redefinir Senha</h2>
          <p className="text-slate-400">Informe o email e a nova senha</p>
        </div>

        {authError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center flex items-center justify-center gap-2">
            <Info className="w-4 h-4" /> {authError}
          </div>
        )}

        {resetMessage && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm mb-6 text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> {resetMessage}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <Input
            label="Email"
            placeholder="voce@email.com"
            value={resetData.email}
            onChange={e => setResetData({ ...resetData, email: e.target.value })}
            className="bg-slate-800/50 focus:bg-slate-800 transition-colors"
          />
          <Input
            label="Nova Senha"
            type="password"
            placeholder="••••••••"
            value={resetData.newPassword}
            onChange={e => setResetData({ ...resetData, newPassword: e.target.value })}
            className="bg-slate-800/50 focus:bg-slate-800 transition-colors"
          />
          <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-teal-500/20">
            Atualizar Senha
          </Button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Voltar para login? <button onClick={() => setCurrentPage('login')} className="text-teal-400 hover:text-teal-300 font-bold transition-colors ml-1">Voltar</button>
        </p>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative">
       <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 blur-sm"></div>

      <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Criar Nova Conta</h2>
          <p className="text-slate-400">Junte-se à comunidade Youth Angola hoje</p>
        </div>

        {authError && (
           <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
             {authError}
           </div>
         )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nome Completo" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} className="bg-slate-800/50" />
          <Input label="Email" type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} className="bg-slate-800/50" />
          <Input label="Telefone" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} className="bg-slate-800/50" />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Idade" type="number" value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})} className="bg-slate-800/50" />
             <Select label="Género" value={regData.gender} onChange={e => setRegData({...regData, gender: e.target.value})}>
               <option value="Masculino">Masculino</option>
               <option value="Feminino">Feminino</option>
             </Select>
          </div>
          <Input label="Cidade" value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} className="bg-slate-800/50" />
          <Input label="País" value={regData.country} onChange={e => setRegData({...regData, country: e.target.value})} className="bg-slate-800/50" />
          <div className="md:col-span-2">
            <Input label="Senha" type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} className="bg-slate-800/50" />
          </div>
          
          <div className="md:col-span-2 pt-6">
            <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-teal-500/20">Registar Conta</Button>
          </div>
        </form>
        
        <p className="text-center mt-8 text-slate-400 text-sm">
          Já tem conta? <button onClick={() => setCurrentPage('login')} className="text-teal-400 hover:text-teal-300 font-bold transition-colors ml-1">Fazer Login</button>
        </p>
      </div>
    </div>
  );

  // --- Routing Logic ---

  if (currentPage === 'admin') {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        setCurrentPage('login');
        return null;
    }
    return (
        <div className="bg-slate-900 min-h-screen">
             <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-lg relative z-20">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="font-bold text-white text-lg">Admin Panel</h1>
                 </div>
                 <button onClick={() => setCurrentPage('home')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                     <LogOut className="w-4 h-4" /> Sair do Painel
                 </button>
             </div>
            <AdminPanel 
                users={users} 
                streams={streams} 
                setUsers={setUsers} 
                setStreams={setStreams} 
                apiBaseUrl={apiBaseUrl}
                authToken={authToken}
                onRefreshUsers={async () => {
                  if (authToken) {
                    await fetchAdminUsers(authToken);
                  }
                }}
            />
        </div>
    );
  }

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {(currentPage !== 'login' && currentPage !== 'register') && (
        <Navbar 
          user={currentUser} 
          onLogout={handleLogout} 
          onNavigate={(page) => {
              if (page === 'home') setFeaturedStream(streams[0]);
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentPage={currentPage}
          onDonate={() => setIsDonationModalOpen(true)}
        />
      )}
      
      {currentPage === 'home' && renderHome()}
      {currentPage === 'schedule' && renderSchedule()}
      {currentPage === 'login' && renderLogin()}
      {currentPage === 'register' && renderRegister()}
      {currentPage === 'admin-login' && renderAdminLogin()}
      {currentPage === 'reset' && renderResetPassword()}
      {currentPage === 'profile' && currentUser && (
        <UserProfile 
          user={currentUser}
          streams={streams}
          onUpdateUser={handleUpdateUser}
          onNavigateToStream={handleStreamClick}
        />
      )}

      {/* Donation Modal */}
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
      />

      {/* VIP Login Modal */}
      <Modal 
        isOpen={isVipLoginModalOpen} 
        onClose={() => setIsVipLoginModalOpen(false)}
        title="Área Exclusiva VIP"
      >
        <div className="text-center mb-8 pt-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30 p-1">
             <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-2 border-amber-500">
                <Lock className="w-8 h-8 text-amber-500" />
             </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Acesso Restrito</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Este conteúdo é reservado. Introduza as suas credenciais de acesso único.
          </p>
          {authError && (
             <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs font-medium">
               {authError}
             </div>
           )}
        </div>
        <form onSubmit={handleVipLogin} className="space-y-5">
           <Input 
             label="Nome de Utilizador VIP" 
             value={vipLoginData.identifier}
             onChange={e => setVipLoginData({...vipLoginData, identifier: e.target.value})}
             placeholder="ex: vip_convidado"
             className="bg-slate-700/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500/20"
           />
           <Input 
             label="Senha de Acesso" 
             type="password"
             value={vipLoginData.password}
             onChange={e => setVipLoginData({...vipLoginData, password: e.target.value})}
             placeholder="••••••••"
             className="bg-slate-700/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500/20"
           />
           <div className="pt-4 pb-2">
             <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 text-white font-bold py-3">
               Desbloquear Acesso
             </Button>
           </div>
        </form>
      </Modal>
      
      {/* Footer */}
      {(currentPage !== 'login' && currentPage !== 'register') && (
        <footer className="border-t border-white/5 bg-slate-900 py-12 text-center text-slate-500 text-sm">
          <div className="flex justify-center items-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-white">
                <Play className="w-4 h-4 fill-current" />
             </div>
             <span className="font-bold text-lg text-white">Youth<span className="text-teal-500">Angola</span></span>
          </div>
          <p className="mb-6">© {new Date().getFullYear()} LW Youth Angola. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-teal-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Suporte</a>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
