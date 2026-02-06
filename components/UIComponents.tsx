import React from 'react';
import { Stream } from '../types';
import { Play, Lock, Users, X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
    danger: "bg-red-500 hover:bg-red-400 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <input 
      className={`w-full bg-slate-800/50 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <select 
      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
      {...props}
    >
      {children}
    </select>
  </div>
);

export const StreamCard: React.FC<{ stream: Stream; onClick: () => void; isFavorite?: boolean; onToggleFavorite?: (e: React.MouseEvent) => void }> = ({ 
  stream, 
  onClick,
  isFavorite,
  onToggleFavorite
}) => (
  <div 
    onClick={onClick}
    className="group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 border border-slate-700 hover:border-teal-500/50"
  >
    <div className="aspect-video relative">
      <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
      
      {stream.isLive && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full" />
          AO VIVO
        </div>
      )}
      
      {stream.accessLevel === 'VIP' && (
        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <Lock className="w-3 h-3" />
          VIP
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-teal-500/90 p-4 rounded-full backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform">
          <Play className="w-8 h-8 text-white fill-current ml-1" />
        </div>
      </div>
    </div>
    
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">
          {stream.category}
        </span>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Users className="w-3 h-3" />
          {stream.viewers.toLocaleString()}
        </div>
      </div>
      <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{stream.title}</h3>
      <p className="text-slate-400 text-sm line-clamp-2">{stream.description}</p>
    </div>
  </div>
);

export const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
