import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { Stream } from '../types';

interface StreamWithAccess extends Stream {
  accessCode?: string;
}

export function VipAccess() {
  const { user, isAuthenticated } = useAuth();
  const [streams, setStreams] = useState<StreamWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'VIP') {
      fetchStreams();
    }
  }, [isAuthenticated, user]);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/vip/streams');
      setStreams(response.data);
    } catch (error) {
      console.error('Erro ao buscar streams:', error);
      setError('Erro ao carregar transmissões');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessStream = async (stream: Stream) => {
    if (!accessCode) {
      setError('Por favor, insira o código de acesso');
      return;
    }

    if (accessCode.toUpperCase() !== stream.accessCode?.toUpperCase()) {
      setError('Código de acesso inválido');
      return;
    }

    // Redirecionar para a transmissão
    window.open(stream.sourceUrl, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Área VIP</h1>
          <p className="text-xl">Faça login para acessar o conteúdo exclusivo</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'VIP') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-xl">Esta área é exclusiva para membros VIP</p>
          <p className="text-lg mt-2">Entre em contato com a administração para obter acesso</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Área VIP Exclusiva</h1>
          <p className="text-purple-200">Conteúdo exclusivo para membros VIP</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-white/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-white/30 rounded mb-2"></div>
                <div className="h-4 bg-white/30 rounded mb-4"></div>
                <div className="h-10 bg-white/30 rounded"></div>
              </div>
            ))
          ) : (
            streams.map((stream) => (
              <div key={stream.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-sm font-semibold">Transmissão VIP</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{stream.title}</h3>
                <p className="text-purple-200 text-sm mb-4 line-clamp-2">{stream.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-purple-300">
                    <span>Código de Acesso:</span>
                    <span className="font-mono bg-black/30 px-2 py-1 rounded">{stream.accessCode || 'N/A'}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite o código"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={() => handleAccessStream(stream)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold"
                    >
                      Acessar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}