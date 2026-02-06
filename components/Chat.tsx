import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, UserRole } from '../types';
import { Send, User as UserIcon } from 'lucide-react';

interface ChatProps {
  currentUser: User | null;
  className?: string;
}

export const Chat: React.FC<ChatProps> = ({ currentUser, className = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      userName: 'Youth Angola Bot',
      text: 'Bem-vindo ao chat ao vivo! Digam de onde nos acompanham 🇦🇴',
      timestamp: new Date().toISOString(),
      isAdmin: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!currentUser) {
      alert("Faça login para participar no chat!");
      return;
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: currentUser.role === UserRole.ADMIN
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-white text-sm">Chat em Directo</h3>
        <span className="text-xs text-green-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Online
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
              {msg.userAvatar ? (
                <img src={msg.userAvatar} alt={msg.userName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-xs font-bold truncate ${msg.isAdmin ? 'text-teal-400' : 'text-white'}`}>
                  {msg.userName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-slate-300 break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-800 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={currentUser ? "Digite uma mensagem..." : "Faça login para comentar"}
            disabled={!currentUser}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!currentUser || !newMessage.trim()}
            className="bg-teal-500 hover:bg-teal-400 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
