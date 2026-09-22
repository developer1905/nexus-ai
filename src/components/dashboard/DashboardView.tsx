import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const DashboardView: React.FC = () => {
  const {
    agents,
    teams,
    tasks,
    models,
    telegramBots,
    telegramChannels,
    telegramDrafts,
    startNewChat,
    setActiveTab,
    runAcceptanceTestWorkflow,
    isAcceptanceRunning,
    isEmergencyStopped
  } = useApp();

  const openRouterFreeCount = models.filter(m => m.provider === 'openrouter' && m.isFree).length;
  const mistralCount = models.filter(m => m.provider === 'mistral').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Nexus AI Enterprise Boshqaruv Markazi</h2>
            <Badge variant="blue">v2.1 Pro</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Avtonom agentlar, OpenRouter bepul modellari, Mistral AI va 5 xil rejimdagi Telegram ekotizimi to‘liq muvofiqlashtirilgan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runAcceptanceTestWorkflow}
            disabled={isAcceptanceRunning || isEmergencyStopped}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            {isAcceptanceRunning ? 'Test Bajarilmoqda...' : 'Haftalik Test Ssenariysi (Req 49)'}
          </button>
          <button
            onClick={() => {
              startNewChat();
              setActiveTab('chat');
            }}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            + Yangi Suhbat
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Faol Agentlar</p>
          <p className="text-2xl font-bold text-white mt-1">{agents.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1">● Barchasi tayyor</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Jamoalar</p>
          <p className="text-2xl font-bold text-white mt-1">{teams.length}</p>
          <p className="text-[10px] text-purple-400 mt-1">Hierarchical & Mesh</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Topshiriqlar</p>
          <p className="text-2xl font-bold text-white mt-1">{tasks.length}</p>
          <p className="text-[10px] text-sky-400 mt-1">Avtonom bajarilmoqda</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">AI Modellar</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{models.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">{openRouterFreeCount} bepul + {mistralCount} Mistral</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Telegram Hub</p>
          <p className="text-2xl font-bold text-sky-400 mt-1">{telegramBots.length} bot / 2 guruh</p>
          <p className="text-[10px] text-emerald-400 mt-1">5 rejim faol</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Xarajatlar</p>
          <p className="text-2xl font-bold text-white mt-1">$0.21</p>
          <p className="text-[10px] text-emerald-400 mt-1">Bepul modellar bilan 95% tejamkor</p>
        </div>
      </div>

      {/* Model Providers Highlight Box */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Ulangan AI Provayderlar & Bepul Resurslar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">OpenRouter (Bepul Modellar)</span>
              <Badge variant="green" size="sm">0$ / Free</Badge>
            </div>
            <p className="text-slate-400 text-[11px]">
              DeepSeek R1, Llama 3.3 70B, Qwen Coder, Mistral Small 24B
            </p>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Mistral AI</span>
              <Badge variant="amber" size="sm">Active API</Badge>
            </div>
            <p className="text-slate-400 text-[11px]">
              Codestral 2501, Mistral Large 2, Pixtral 12B Multimodal
            </p>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Google Gemini</span>
              <Badge variant="blue" size="sm">Native Fast</Badge>
            </div>
            <p className="text-slate-400 text-[11px]">
              Gemini 3.6 Flash (past kechikish, 1M kontekst)
            </p>
          </div>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tezkor O‘tish</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('telegram')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
            >
              <span className="block font-bold text-sky-400">✈️ Telegram Hub</span>
              <span className="text-[10px] text-slate-400">Botlar, 5 rejimdagi guruhlar</span>
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
            >
              <span className="block font-bold text-purple-400">👥 Multi-Agent Teams</span>
              <span className="text-[10px] text-slate-400">Workflow grafi va zanjir</span>
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
            >
              <span className="block font-bold text-emerald-400">🧠 AI Modellar ({models.length})</span>
              <span className="text-[10px] text-slate-400">OpenRouter & Mistral</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
            >
              <span className="block font-bold text-amber-400">⚙️ Sozlamalar</span>
              <span className="text-[10px] text-slate-400">API kalitlar va xavfsizlik</span>
            </button>
          </div>
        </div>

        {/* Active Telegram Feed */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Telegram Kanali & Qoralamalar
              </h4>
              <Badge variant="green" size="sm">Jonli</Badge>
            </div>
            {telegramDrafts.slice(0, 2).map(d => (
              <div key={d.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{d.channelTitle}</span>
                  <Badge variant="amber" size="sm">Tasdiq kutilmoqda</Badge>
                </div>
                <p className="text-slate-400 line-clamp-2 text-[11px] font-mono">{d.content}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('telegram')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium text-right"
          >
            Telegram boshqaruv markaziga o‘tish →
          </button>
        </div>
      </div>
    </div>
  );
};
