import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApprovalQueueModal } from '../common/ApprovalQueueModal';
import { Modal } from '../common/Modal';

export const TopHeader: React.FC = () => {
  const {
    activeTab,
    models,
    activeModelId,
    setActiveModelId,
    projects,
    activeProjectId,
    setActiveProjectId,
    approvals,
    settings,
    updateSettings,
    startNewChat,
    setActiveTab,
    setIsMobileMenuOpen,
    isEmergencyStopped,
    emergencyStopReason,
    emergencyStopAll,
    resumeAllAgents
  } = useApp();

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [stopReasonInput, setStopReasonInput] = useState('Operator buyrug‘i / Xavfsizlik');

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;
  const currentProject = projects.find(p => p.id === activeProjectId);

  const tabLabels: Record<string, string> = {
    dashboard: 'Workspace Dashboard',
    chat: 'AI Chat & Mantiqiy Muloqot',
    agents: 'Agentlar Katalogi & Konstruktori',
    teams: 'Multi-Agent Jamoalari & Protokol',
    models: 'AI Modellar Registri (OpenRouter, Mistral, Gemini)',
    skills: 'Ko‘nikmalar Modullari',
    tools: 'Asboblar & Sandbox Ijrochisi',
    projects: 'Loyihalar & Kontekst',
    tasks: 'Vazifalar Paneli & Handoffs',
    knowledge: 'RAG & Bilimlar Bazasi',
    files: 'Fayllar Kutubxonasi',
    automations: 'Vizual Workflow Avtomatlashtirish',
    telegram: 'Telegram Hub, Guruhlar & Kanallar',
    analytics: 'Telemetriya & Xarajatlar Tahlili',
    settings: 'Sozlamalar & API Kalitlar'
  };

  const toggleTheme = () => {
    updateSettings({ appearance: { theme: settings.appearance.theme === 'dark' ? 'light' : 'dark' } });
  };

  return (
    <>
      {/* Emergency Stop Active Warning Banner */}
      {isEmergencyStopped && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-0 z-30 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="font-mono uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded text-[10px]">EMERGENCY STOP FAOL</span>
            <span className="hidden sm:inline">|</span>
            <span className="truncate max-w-xs sm:max-w-md md:max-w-xl">
              {emergencyStopReason || 'Barcha agent jarayonlari va Telegram xabarlari to‘xtatildi.'}
            </span>
          </div>
          <button
            onClick={resumeAllAgents}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-rose-700 font-bold rounded-md shadow text-xs transition flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Qayta Yoqish (Resume All)</span>
          </button>
        </div>
      )}

      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-20 sticky top-0">
        {/* Left: Mobile Nav & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            ☰
          </button>
          <h1 className="text-sm md:text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <span>{tabLabels[activeTab] || 'Nexus AI'}</span>
            <span className="hidden sm:inline-block text-xs text-slate-500">|</span>
            <span className="hidden sm:inline-block text-xs font-normal text-slate-400">
              {currentProject?.name || 'Global Context'}
            </span>
          </h1>
        </div>

        {/* Right: Emergency Stop, Model Selector, Approvals, New Chat */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Emergency Stop Button */}
          {isEmergencyStopped ? (
            <button
              onClick={resumeAllAgents}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 animate-pulse transition"
              title="Agentlarni qayta yoqish"
            >
              <span>RESUME AGENTS</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition group"
              title="Favqulodda to‘xtatish"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:animate-ping" />
              <span className="hidden sm:inline">STOP ALL AGENTS</span>
              <span className="sm:hidden">STOP</span>
            </button>
          )}

          {/* Model Selector Pill (Gemini, OpenRouter Free, Mistral) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <select
              value={activeModelId}
              onChange={(e) => setActiveModelId(e.target.value)}
              className="bg-transparent border-none text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <optgroup label="Navy AI (Universal Engine)">
                <option value="navy-ultra-latest">Navy AI Ultra (JARVIS)</option>
                <option value="navy-fast-v1">Navy AI Fast</option>
                <option value="navy-coder">Navy AI Coder</option>
              </optgroup>
              <optgroup label="Google Gemini (Native)">
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (Default)</option>
                <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite</option>
              </optgroup>
              <optgroup label="OpenRouter (Bepul Modellar)">
                <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Bepul)</option>
                <option value="deepseek/deepseek-chat:free">DeepSeek V3 (Bepul)</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (Bepul)</option>
                <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Bepul)</option>
                <option value="qwen/qwen-2.5-coder-32b-instruct:free">Qwen 2.5 Coder 32B (Bepul)</option>
                <option value="mistralai/mistral-small-24b-instruct-2501:free">Mistral Small 24B (Bepul)</option>
                <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Bepul)</option>
              </optgroup>
              <optgroup label="Mistral AI">
                <option value="mistral-large-latest">Mistral Large 2</option>
                <option value="mistral-small-latest">Mistral Small 3</option>
                <option value="codestral-latest">Codestral 2501</option>
                <option value="pixtral-12b-2409">Pixtral 12B Multimodal</option>
              </optgroup>
            </select>
          </div>

          {/* Human Approvals Button */}
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              pendingApprovalsCount > 0
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:text-slate-200'
            }`}
          >
            <span>Tasdiqlar</span>
            {pendingApprovalsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {/* Quick New Chat Button */}
          <button
            onClick={() => {
              startNewChat();
              setActiveTab('chat');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition"
          >
            <span>+ Yangi Suhbat</span>
          </button>

          {/* Theme Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            title="Mavzuni almashtirish"
          >
            {settings.appearance.theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <ApprovalQueueModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
      />

      <Modal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        title="🛑 Favqulodda to‘xtatish (Emergency Stop)"
        subtitle="Barcha agentlar, guruh va kanallarga xabar yuborish darhol muzlatiladi"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-200 text-xs">
            Ushbu amal bajarilganda barcha ishlayotgan multi-agent jamoalari va Telegram bot javoblari to‘xtatiladi.
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">To‘xtatish sababi:</label>
            <input
              type="text"
              value={stopReasonInput}
              onChange={(e) => setStopReasonInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsEmergencyModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              onClick={() => {
                emergencyStopAll(stopReasonInput.trim() || 'Xavfsizlik');
                setIsEmergencyModalOpen(false);
              }}
              className="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
            >
              Zudlik bilan to‘xtatish
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
