import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIModel } from '../../types';
import { Badge } from '../common/Badge';

export const ModelsView: React.FC = () => {
  const { models, activeModelId, setActiveModelId, setActiveTab } = useApp();
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = models.filter(m => {
    if (filterProvider !== 'all' && m.provider !== filterProvider) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || (m.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  const navyCount = models.filter(m => m.provider === 'navy').length;
  const openRouterFreeCount = models.filter(m => m.provider === 'openrouter' && m.isFree).length;
  const mistralCount = models.filter(m => m.provider === 'mistral').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">AI Modellar Registri</h2>
              <Badge variant="blue">Navy AI, OpenRouter & Mistral Ulandi</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              OpenRouter orqali <strong>{openRouterFreeCount} ta bepul model</strong> (DeepSeek R1, Llama 3.3 70B, Qwen Coder) va Mistral AI API orqali <strong>{mistralCount} ta flagman model</strong> (Codestral, Mistral Large 2, Pixtral) to‘liq integratsiya qilindi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              API Kalitlarni Ko‘rish
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Chatda Sinab Ko‘rish →
            </button>
          </div>
        </div>

        {/* Quick Provider Badges */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">OpenRouter Bepul Modellar</span>
            <span className="text-base font-bold text-emerald-400">{openRouterFreeCount} ta model</span>
            <span className="text-[10px] text-slate-500 block">DeepSeek R1, Llama 3.3, Qwen</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Mistral AI</span>
            <span className="text-base font-bold text-amber-400">{mistralCount} ta model</span>
            <span className="text-[10px] text-slate-500 block">Codestral, Mistral Large, Pixtral</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Navy AI (Universal)</span>
            <span className="text-base font-bold text-purple-400">{navyCount} ta model</span>
            <span className="text-[10px] text-slate-500 block">Navy Ultra (JARVIS), Fast, Coder</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Faol Tanlangan Model</span>
            <span className="text-sm font-bold text-white truncate block">{activeModelId}</span>
            <span className="text-[10px] text-emerald-400 block">● Ulangan & Tayyor</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'Barcha Modellar' },
            { id: 'openrouter', label: 'OpenRouter (Bepul)' },
            { id: 'mistral', label: 'Mistral AI' },
            { id: 'google', label: 'Google Gemini' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterProvider(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterProvider === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Model nomi yoki xususiyati bo‘yicha qidiruv..."
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 min-w-[220px]"
        />
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(model => {
          const isActive = activeModelId === model.id;
          return (
            <div
              key={model.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition flex flex-col justify-between ${
                isActive ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-white text-base tracking-tight">{model.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{model.id}</p>
                  </div>
                  <Badge variant={model.isFree ? 'green' : model.provider === 'mistral' ? 'amber' : 'blue'} size="sm">
                    {model.isFree ? 'BEPUL (0$)' : model.provider.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed line-clamp-2">
                  {model.description}
                </p>

                {/* Specs */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono">Kontekst</span>
                    <span className="font-bold text-white">{(model.contextWindow / 1000).toFixed(0)}k</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono">Narx / 1M</span>
                    <span className={`font-bold ${model.isFree ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {model.isFree ? '0$' : `$${model.pricing.inputPerMillion}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono">Kechikish</span>
                    <span className="font-bold text-sky-400">{model.latencyAvgMs}ms</span>
                  </div>
                </div>

                {/* Capability Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {model.capabilities.map(cap => (
                    <span key={cap} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {isActive ? '✅ Asosiy tanlangan' : 'Barcha agentlar uchun'}
                </span>
                <button
                  onClick={() => setActiveModelId(model.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isActive ? 'Tanlangan' : 'Faollashtirish'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
