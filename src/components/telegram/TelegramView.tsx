import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TelegramGroupMode } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { TelegramService, InlineKeyboardButton } from '../../services/telegramService';
import { ProviderService } from '../../services/providerService';
import { 
  IconSend, 
  IconPlus, 
  IconCheck, 
  IconTelegram, 
  IconPlay 
} from '../common/Icons';

export const TelegramView: React.FC = () => {
  const {
    telegramBots,
    telegramGroups,
    telegramChannels,
    telegramDrafts,
    telegramLogs,
    agentMessages,
    tasks,
    activeTelegramTab,
    setActiveTelegramTab,
    connectTelegramBot,
    disconnectTelegramBot,
    updateGroupMode,
    updateGroupSettings,
    createPostDraft,
    publishPostDraft,
    runAcceptanceTestWorkflow,
    isAcceptanceRunning,
    isEmergencyStopped,
    settings
  } = useApp();

  const [activeSection, setActiveSection] = useState<string>(activeTelegramTab || 'overview');

  // Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [botNameInput, setBotNameInput] = useState('');
  const [botTokenInput, setBotTokenInput] = useState('');
  const [connectResult, setConnectResult] = useState<{ success?: boolean; message?: string }>({});

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'poll'>('text');
  const [pollOpts, setPollOpts] = useState('Ha, albatta\nQayta ko‘rib chiqish lozim\nKeyingi tsiklga qoldirish');

  // Filters
  const [logFilterBot, setLogFilterBot] = useState('all');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Simulator State
  const [simSelectedModel, setSimSelectedModel] = useState('deepseek/deepseek-r1:free');
  const [simSelectedAgent, setSimSelectedAgent] = useState('Nova PM (Manager)');
  const [isSimTyping, setIsSimTyping] = useState(false);

  interface SimMsg {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    time: string;
    keyboardType?: 'main_menu' | 'context_chat' | 'context_approval' | 'none';
  }

  const [simulatorMessages, setSimulatorMessages] = useState<SimMsg[]>([
    {
      id: 'm1',
      sender: 'user',
      text: '/start',
      time: '14:20'
    },
    {
      id: 'm2',
      sender: 'bot',
      text: '👋 *Nexus AI Enterprise Telegram Botiga xush kelibsiz!*\n\nMen ko‘p agentli avtonom tizimlar, OpenRouter bepul modellari va Mistral AI bilan integratsiyalashgan aqlli yordamchingizman. Kerakli bo‘limni tanlang:',
      time: '14:20',
      keyboardType: 'main_menu'
    }
  ]);

  const [simulatorInput, setSimulatorInput] = useState('');

  const handleConnectBot = (e: React.FormEvent) => {
    e.preventDefault();
    const res = connectTelegramBot(botNameInput, botTokenInput);
    setConnectResult(res);
    if (res.success) {
      setTimeout(() => {
        setIsConnectModalOpen(false);
        setBotNameInput('');
        setBotTokenInput('');
        setConnectResult({});
      }, 1000);
    }
  };

  const handleAIGeneratePostDraft = () => {
    setPostContent(
      `🚀 **Nexus AI: Haftalik Texnologiya va AI Dayjesti**\n\n` +
      `Bugungi kunda avtonom ko‘p agentli tizimlar dasturiy ta'minot yaratish jarayonini tubdan o‘zgartirmoqda:\n\n` +
      `🔹 **OpenRouter Bepul Modellari:** DeepSeek R1, Llama 3.3 70B va Qwen Coder orqali xarajatlar $0 da saqlandi.\n` +
      `🔹 **Mistral AI:** Codestral 2501 yuqori aniqlikdagi Python kodlarini ishlab chiqmoqda.\n` +
      `🔹 **Inson Tasdig‘i:** Telegram guruh va kanallariga post chiqarish to‘liq nazorat ostida.\n\n` +
      `Savollaringiz bormi? Fikr-mulohazalaringizni izohlarda qoldiring! 👇\n\n` +
      `#AI #OpenRouter #Mistral #NexusAI #TechUzbekistan`
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    createPostDraft({
      content: postContent,
      mediaType: postType,
      pollOptions: postType === 'poll' ? pollOpts.split('\n').filter(x => x.trim().length > 0) : undefined
    });

    setPostContent('');
    setIsNewPostModalOpen(false);
  };

  const handleSimulatorSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorInput.trim()) return;

    const userText = simulatorInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSimulatorMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: userText, time }]);
    setSimulatorInput('');
    setIsSimTyping(true);

    if (userText.startsWith('/')) {
      setTimeout(() => {
        setIsSimTyping(false);
        const cmdResult = TelegramService.handleSlashCommand(userText);
        setSimulatorMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: cmdResult.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            keyboardType: userText === '/start' ? 'main_menu' : 'context_chat'
          }
        ]);
      }, 350);
      return;
    }

    // Call ProviderService
    const openRouterKey = settings.apiKeys.find(k => k.provider === 'openrouter')?.rawKey;
    const mistralKey = settings.apiKeys.find(k => k.provider === 'mistral')?.rawKey;

    try {
      const res = await ProviderService.generate({
        modelId: simSelectedModel,
        prompt: userText,
        systemInstruction: `Siz Telegramda javob beruvchi ${simSelectedAgent} siz. Har doim o‘zbek tilida muloyim va aniq yozing.`,
        openRouterKey,
        mistralKey
      });

      setIsSimTyping(false);
      setSimulatorMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🤖 *[${simSelectedModel.split('/')[0]}]:*\n\n${res.text}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          keyboardType: 'context_chat'
        }
      ]);
    } catch {
      setIsSimTyping(false);
      setSimulatorMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Xabaringiz qabul qilindi. Agentlararo vazifa shakllantirildi.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          keyboardType: 'context_chat'
        }
      ]);
    }
  };

  const handleSimulatorButtonClick = (btn: InlineKeyboardButton) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSimulatorMessages(prev => [...prev, { id: `click-${Date.now()}`, sender: 'user', text: `[Tugma bosildi: ${btn.text}]`, time }]);
    setIsSimTyping(true);

    setTimeout(() => {
      setIsSimTyping(false);
      const res = TelegramService.handleCallbackQuery(btn.callbackData);
      setSimulatorMessages(prev => [
        ...prev,
        {
          id: `bot-reply-${Date.now()}`,
          sender: 'bot',
          text: res.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          keyboardType: btn.callbackData.includes('task') ? 'context_approval' : 'main_menu'
        }
      ]);
    }, 300);
  };

  const mainMenuKb = TelegramService.getMainMenuKeyboard();
  const contextChatKb = TelegramService.getContextButtons('chat_response');
  const contextApprovalKb = TelegramService.getContextButtons('approval');
  const replyKb = TelegramService.getReplyKeyboard();

  const subsections = [
    { id: 'overview', label: '📊 Umumiy Ko‘rinish' },
    { id: 'bots', label: '🤖 Botlar' },
    { id: 'groups', label: '👥 Guruhlar (5 Rejim)' },
    { id: 'channels', label: '📢 Kanallar & Workflow' },
    { id: 'connections', label: '🔗 Agent Ulanishlari' },
    { id: 'collaboration', label: '🤝 Bot Hamkorligi' },
    { id: 'tasks', label: '📋 Telegram Vazifalari' },
    { id: 'automations', label: '⏰ Avtomatlashtirish' },
    { id: 'logs', label: '📜 Jurnallar (Logs)' },
    { id: 'permissions', label: '🔒 Ruxsatlar & Cheklovlar' },
    { id: 'simulator', label: '📱 Telegram Simulyatori' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <IconTelegram className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Telegram AI Agent Ekotizimi</h2>
            <Badge variant="blue">Phase 2 Pro</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Telegram botlari, 5 xil rejimdagi guruhlar, kanallar kontenti va OpenRouter/Mistral integratsiyasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runAcceptanceTestWorkflow}
            disabled={isAcceptanceRunning || isEmergencyStopped}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <IconPlay className="w-3.5 h-3.5" />
            <span>{isAcceptanceRunning ? 'Test Bajarilmoqda...' : 'Haftalik Test Ssenariysi'}</span>
          </button>

          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 transition"
          >
            Yangi Post Yozish
          </button>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <IconPlus className="w-4 h-4" />
            <span>Bot Qo‘shish</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar border-b border-slate-800">
        {subsections.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSection(tab.id);
              if (setActiveTelegramTab) setActiveTelegramTab(tab.id as any);
            }}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition border-b-2 -mb-[1px] ${
              activeSection === tab.id
                ? 'border-sky-500 text-sky-400 font-semibold bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-[11px] font-medium text-slate-400">Ulangan Botlar</p>
              <p className="text-2xl font-bold text-white mt-1">{telegramBots.length}</p>
              <p className="text-[10px] text-emerald-400 mt-1">● Faol</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-[11px] font-medium text-slate-400">Guruhlar (5 rejim)</p>
              <p className="text-2xl font-bold text-white mt-1">{telegramGroups.length}</p>
              <p className="text-[10px] text-sky-400 mt-1">2,480 a'zolar</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-[11px] font-medium text-slate-400">Kanallar</p>
              <p className="text-2xl font-bold text-white mt-1">{telegramChannels.length}</p>
              <p className="text-[10px] text-purple-400 mt-1">12,400 obunachi</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-[11px] font-medium text-slate-400">Vazifalar</p>
              <p className="text-2xl font-bold text-white mt-1">{tasks.length}</p>
              <p className="text-[10px] text-amber-400 mt-1">Avtonom rejimda</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-[11px] font-medium text-slate-400">Xabarlar</p>
              <p className="text-2xl font-bold text-white mt-1">1,482</p>
              <p className="text-[10px] text-slate-400 mt-1">99.8% aniqlik</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-[11px] font-medium text-slate-400">Kechikish</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">38ms</p>
              <p className="text-[10px] text-emerald-500 mt-1">Optimal</p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 border border-sky-900/40 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  ⚡ Avtonom Telegram Gateway & Protokol Marshrutlash
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Telegram foydalanuvchisi /start yoki buyruq berganda, Nexus Gateway uni Manager Agent (Nova PM)ga uzatadi. Agentlar DeepSeek R1 va Mistral yordamida vazifani bajaradi.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('simulator')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition whitespace-nowrap"
              >
                Simulyatorda Sinash →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOTS */}
      {activeSection === 'bots' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {telegramBots.map(bot => (
            <div key={bot.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{bot.botName}</h4>
                    <p className="text-xs text-sky-400 font-mono">{bot.username}</p>
                  </div>
                </div>
                <Badge variant={bot.status === 'connected' ? 'green' : 'red'}>
                  {bot.status === 'connected' ? 'Ulangan' : 'Uzilgan'}
                </Badge>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Token:</span>
                  <span className="text-slate-300">{bot.tokenMasked}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Webhook:</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">{bot.webhookUrl}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <button
                  onClick={() => setActiveSection('simulator')}
                  className="px-3 py-1.5 bg-sky-600/20 text-sky-300 rounded-lg font-medium"
                >
                  Simulyatorda ochish
                </button>
                <button
                  onClick={() => disconnectTelegramBot(bot.id)}
                  className="text-rose-400 hover:text-rose-300"
                >
                  Ulanishni uzish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. GROUPS (5 MODES) */}
      {activeSection === 'groups' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300">
            <span className="font-semibold text-white">5 Xil Guruh Ishlash Rejimi:</span>
            <p className="text-slate-400 mt-0.5">
              LISTEN (monitoring & RAG), ASSIST (@mention javob), TASK (vazifaga aylantirish), SCHEDULED (vaqtli postlar), TEAM (multi-agent muhokamasi).
            </p>
          </div>

          <div className="space-y-3">
            {telegramGroups.map(group => (
              <div key={group.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-base">👥 {group.title}</h4>
                    <p className="text-xs text-slate-400">{group.memberCount} a'zo | {group.chatId}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Rejim:</span>
                    <select
                      value={group.mode}
                      onChange={(e) => updateGroupMode(group.id, e.target.value as TelegramGroupMode)}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-sky-400 focus:outline-none"
                    >
                      <option value="LISTEN">LISTEN (Tinglash)</option>
                      <option value="ASSIST">ASSIST (@mention)</option>
                      <option value="TASK">TASK (Vazifa)</option>
                      <option value="SCHEDULED">SCHEDULED (Vaqtli)</option>
                      <option value="TEAM">TEAM (Jamoaviy)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex gap-4">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={group.respondWhenMentioned}
                      onChange={(e) => updateGroupSettings(group.id, { respondWhenMentioned: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <span>@mention bo‘yicha</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={group.readAllMessages}
                      onChange={(e) => updateGroupSettings(group.id, { readAllMessages: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <span>Barcha xabarlar (RAG)</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CHANNELS */}
      {activeSection === 'channels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {telegramChannels.map(channel => (
              <div key={channel.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">📢 {channel.title}</h4>
                    <p className="text-xs text-sky-400 font-mono">{channel.username}</p>
                  </div>
                  <Badge variant="green">Faol</Badge>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setIsNewPostModalOpen(true);
                      handleAIGeneratePostDraft();
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium"
                  >
                    AI Post Yozish
                  </button>
                  <span className="text-slate-400">{channel.subscriberCount.toLocaleString()} obunachi</span>
                </div>
              </div>
            ))}
          </div>

          {/* Drafts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tayyor Qoralamalar (Approval Queue)
            </h4>
            {telegramDrafts.map(draft => (
              <div key={draft.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">Muallif: {draft.agentName}</span>
                  <Badge variant={draft.status === 'published' ? 'green' : 'amber'}>
                    {draft.status === 'pending_approval' ? 'Tasdiq kutilmoqda' : draft.status}
                  </Badge>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-200 whitespace-pre-wrap font-mono">
                  {draft.content}
                </div>
                {draft.status === 'pending_approval' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => publishPostDraft(draft.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                      <span>Tasdiqlash & Nashr Qilish</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CONNECTIONS */}
      {activeSection === 'connections' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Agent va Telegram Resurslari Bog‘liqligi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Resurs</th>
                  <th className="py-2.5 px-3">Asosiy Agent</th>
                  <th className="py-2.5 px-3">AI Modeli</th>
                  <th className="py-2.5 px-3">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">@JarvisUniversalBot (8993321594)</td>
                  <td className="py-3 px-3 text-purple-400 font-bold">🦾 JARVIS (Universal)</td>
                  <td className="py-3 px-3 font-mono">Navy AI Ultra</td>
                  <td className="py-3 px-3"><Badge variant="green" size="sm">Faol & Ulangan</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">@NexusAIOfficialBot</td>
                  <td className="py-3 px-3 text-sky-400 font-medium">Nova PM (Manager)</td>
                  <td className="py-3 px-3 font-mono">Gemini 3.6 Flash</td>
                  <td className="py-3 px-3"><Badge variant="green" size="sm">Faol</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Developers Group</td>
                  <td className="py-3 px-3 text-sky-400 font-medium">Kite Developer</td>
                  <td className="py-3 px-3 font-mono">Codestral 2501 (Mistral)</td>
                  <td className="py-3 px-3"><Badge variant="green" size="sm">Faol</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">@ai_daily_uz (Kanal)</td>
                  <td className="py-3 px-3 text-sky-400 font-medium">Lyra Copywriter</td>
                  <td className="py-3 px-3 font-mono">Llama 3.3 70B (OpenRouter Bepul)</td>
                  <td className="py-3 px-3"><Badge variant="green" size="sm">Faol</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. COLLABORATION */}
      {activeSection === 'collaboration' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white">Agentlararo Telegram Protokol Xabarlari</h3>
            <span className="text-xs font-mono text-slate-400">{agentMessages.length} xabar</span>
          </div>

          <div className="space-y-2">
            {agentMessages.slice(0, 8).map(msg => (
              <div key={msg.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-white">{msg.senderAgentName} → {msg.receiverAgentName}</span>
                  <p className="text-slate-300 font-mono text-[11px] mt-0.5">{msg.content}</p>
                </div>
                <Badge variant="purple" size="sm">{msg.messageType}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TASKS */}
      {activeSection === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map(task => (
            <div key={task.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-white text-sm">{task.title}</h4>
                <Badge variant={task.status === 'Completed' ? 'green' : 'blue'}>{task.status}</Badge>
              </div>
              <p className="text-xs text-slate-400">{task.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* 8. AUTOMATIONS */}
      {activeSection === 'automations' && (
        <div className="space-y-3">
          {[
            { title: 'Kunlik 09:00 Telegram Dayjest', schedule: 'Har kuni 09:00' },
            { title: 'Haftalik AI Hisoboti (Req 49)', schedule: 'Har juma 18:00' },
            { title: 'Guruh Sentiment Monitor', schedule: 'Har 4 soatda' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <span className="text-xs text-purple-400 font-mono">{item.schedule}</span>
              </div>
              <button
                onClick={runAcceptanceTestWorkflow}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
              >
                Hozir Ishga Tushirish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 9. LOGS */}
      {activeSection === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Vaqt</th>
                <th className="py-2.5 px-3">Bot / Chat</th>
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Tafsilotlar</th>
                <th className="py-2.5 px-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {telegramLogs.map(log => (
                <tr key={log.id}>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-mono text-sky-400">{log.bot}</td>
                  <td className="py-2.5 px-3 text-white">{log.agent}</td>
                  <td className="py-2.5 px-3">{log.details}</td>
                  <td className="py-2.5 px-3"><Badge variant="green" size="sm">{log.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 10. PERMISSIONS */}
      {activeSection === 'permissions' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-white">Telegram Whitelist & Xavfsizlik</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">SuperAdmin ID</span>
              <span className="font-bold text-white font-mono">109283741 (@alisher_vance)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Flood Wait</span>
              <span className="font-bold text-emerald-400 font-mono">5 soniya himoya</span>
            </div>
          </div>
        </div>
      )}

      {/* 11. SIMULATOR (UZBEK INTERFACE + OPENROUTER/MISTRAL MODEL PICKER) */}
      {activeSection === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0e1621] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[700px]">
            {/* Header */}
            <div className="bg-[#17212b] px-4 py-3 border-b border-[#0e1621] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-base font-bold shadow">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                    <span>Nexus AI Rasmiy Bot</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-sky-400">@NexusAIOfficialBot • onlayn</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-1 rounded font-mono border border-slate-700">
                  {simSelectedModel.split('/')[1] || simSelectedModel}
                </span>
              </div>
            </div>

            {/* Quick Slash Commands */}
            <div className="bg-[#131c26] px-3 py-1.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-[11px]">
              <span className="text-slate-500 font-semibold uppercase text-[9px] flex-shrink-0">Buyruqlar:</span>
              {['/start', '/help', '/chat', '/agent', '/tasks', '/skills', '/tools', '/stats', '/admin', '/logs'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => setSimulatorInput(cmd)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[10px] flex-shrink-0 transition"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1621] custom-scrollbar">
              {simulatorMessages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                        isUser
                          ? 'bg-[#2b5278] text-white rounded-br-xs'
                          : 'bg-[#182533] text-slate-100 rounded-bl-xs border border-[#233140]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</div>
                      <div className="text-[9px] text-right mt-1 text-slate-400 font-mono">
                        {msg.time} {isUser && '✓✓'}
                      </div>
                    </div>

                    {!isUser && msg.keyboardType && msg.keyboardType !== 'none' && (
                      <div className="mt-2 space-y-1.5 max-w-[85%] w-full">
                        {msg.keyboardType === 'main_menu' && mainMenuKb.inline_keyboard.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-2 gap-1.5">
                            {row.map(btn => (
                              <button
                                key={btn.text}
                                onClick={() => handleSimulatorButtonClick(btn)}
                                className="px-3 py-1.5 bg-[#243447] hover:bg-[#2e4259] text-white rounded-lg text-xs font-medium border border-[#2f435a] shadow-sm transition truncate"
                              >
                                {btn.text}
                              </button>
                            ))}
                          </div>
                        ))}

                        {msg.keyboardType === 'context_chat' && contextChatKb.inline_keyboard.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-2 gap-1.5">
                            {row.map(btn => (
                              <button
                                key={btn.text}
                                onClick={() => handleSimulatorButtonClick(btn)}
                                className="px-3 py-1.5 bg-[#243447] hover:bg-[#2e4259] text-white rounded-lg text-xs font-medium border border-[#2f435a] shadow-sm transition truncate"
                              >
                                {btn.text}
                              </button>
                            ))}
                          </div>
                        ))}

                        {msg.keyboardType === 'context_approval' && contextApprovalKb.inline_keyboard.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-2 gap-1.5">
                            {row.map(btn => (
                              <button
                                key={btn.text}
                                onClick={() => handleSimulatorButtonClick(btn)}
                                className="px-3 py-1.5 bg-[#243447] hover:bg-[#2e4259] text-white rounded-lg text-xs font-medium border border-[#2f435a] shadow-sm transition truncate"
                              >
                                {btn.text}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isSimTyping && (
                <div className="flex items-center gap-1.5 text-xs text-sky-400 italic">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span>Agent javob tayyorlamoqda...</span>
                </div>
              )}
            </div>

            {/* ReplyKeyboard */}
            <div className="bg-[#17212b] px-3 py-2 border-t border-[#0e1621] grid grid-cols-4 gap-1.5 text-center">
              {replyKb.keyboard.flat().map(btnText => (
                <button
                  key={btnText}
                  onClick={() => setSimulatorInput(btnText)}
                  className="px-2 py-1.5 bg-[#233140] hover:bg-[#2c3d4f] text-slate-200 text-xs rounded font-medium truncate transition"
                >
                  {btnText}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSimulatorSend} className="bg-[#17212b] p-3 border-t border-[#0e1621] flex items-center gap-2">
              <input
                type="text"
                value={simulatorInput}
                onChange={(e) => setSimulatorInput(e.target.value)}
                placeholder="O‘zbekcha xabar yozing yoki /start bosing..."
                className="flex-1 bg-[#242f3d] border-none text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow transition"
              >
                <IconSend className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Configuration Panel */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white">Simulyator AI Modeli</h4>
            <p className="text-xs text-slate-400">
              OpenRouter bepul modellari va Mistral modellarini simulyatorda sinab ko‘ring
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">AI Modeli:</label>
              <select
                value={simSelectedModel}
                onChange={(e) => setSimSelectedModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              >
                <optgroup label="Navy AI (Universal JARVIS Modellar)">
                  <option value="navy-ultra-latest">Navy AI Ultra (JARVIS)</option>
                  <option value="navy-fast-v1">Navy AI Fast</option>
                  <option value="navy-coder">Navy AI Coder</option>
                </optgroup>
                <optgroup label="OpenRouter (Bepul Modellar)">
                  <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Bepul)</option>
                  <option value="deepseek/deepseek-chat:free">DeepSeek V3 (Bepul)</option>
                  <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (Bepul)</option>
                  <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Bepul)</option>
                  <option value="qwen/qwen-2.5-coder-32b-instruct:free">Qwen 2.5 Coder (Bepul)</option>
                  <option value="mistralai/mistral-small-24b-instruct-2501:free">Mistral Small 24B (Bepul)</option>
                </optgroup>
                <optgroup label="Mistral AI">
                  <option value="mistral-large-latest">Mistral Large 2</option>
                  <option value="codestral-latest">Codestral 2501</option>
                </optgroup>
                <optgroup label="Google Gemini">
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Muloqotchi Agent:</label>
              <select
                value={simSelectedAgent}
                onChange={(e) => setSimSelectedAgent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              >
                <option value="JARVIS (Universal Agent)">🦾 JARVIS (Universal Hamma Ishlar)</option>
                <option value="Nova PM (Manager)">🎯 Nova PM (Manager)</option>
                <option value="Atlas Researcher">🔬 Atlas Researcher</option>
                <option value="Cipher Analyst">📊 Cipher Analyst</option>
                <option value="Lyra Copywriter">✍️ Lyra Copywriter</option>
                <option value="Kite Developer">💻 Kite Developer</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Provayder Kalitlari:</span>
              <p className="text-purple-400">✅ Navy AI: sk-navy-b5HS...lMUM</p>
              <p className="text-emerald-400">✅ OpenRouter: sk-or-v1-9a8b...1308</p>
              <p className="text-amber-400">✅ Mistral: mstrl_YlHK...QPpq</p>
              <p className="text-sky-400">✅ Bot Token: 899332****:AAFo1U...mR_Y</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title="Yangi Telegram Bot Ulash"
        subtitle="@BotFather tomonidan berilgan tokenni kiriting"
        maxWidth="md"
      >
        <form onSubmit={handleConnectBot} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bot Nomi</label>
            <input
              type="text"
              required
              placeholder="masalan: Nexus AI Ops Bot"
              value={botNameInput}
              onChange={(e) => setBotNameInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Telegram Bot Token</label>
            <input
              type="password"
              required
              placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ_123456"
              value={botTokenInput}
              onChange={(e) => setBotTokenInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
            />
          </div>
          {connectResult.message && (
            <p className={`text-xs ${connectResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
              {connectResult.message}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsConnectModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg"
            >
              Ulash
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        title="Telegram Kanaliga Post Qoralamasi"
        subtitle="Inson tasdig‘idan so‘ng kanalga chiqariladi"
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="postType"
                  checked={postType === 'text'}
                  onChange={() => setPostType('text')}
                  className="text-sky-600"
                />
                <span>Standart Post</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="postType"
                  checked={postType === 'poll'}
                  onChange={() => setPostType('poll')}
                  className="text-sky-600"
                />
                <span>So‘rovnoma (Poll)</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleAIGeneratePostDraft}
              className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded text-xs font-medium border border-purple-500/30"
            >
              ✨ AI Avto-Post Yaratish
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Post Matni (MarkdownV2)</label>
            <textarea
              rows={6}
              required
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsNewPostModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg"
            >
              Tasdiqlash Navbatiga Qo‘yish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
