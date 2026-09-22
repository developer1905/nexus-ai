import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { IconSend } from '../common/Icons';

export const ChatView: React.FC = () => {
  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    startNewChat,
    sendChatMessage,
    isGeneratingResponse,
    models,
    activeModelId,
    setActiveModelId,
    agents,
    activeAgentId,
    setActiveAgentId
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];
  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];
  const activeModel = models.find(m => m.id === activeModelId) || models[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGeneratingResponse) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendChatMessage(msg);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6.5rem)] flex gap-4 pb-4">
      {/* Sessions Left Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <button
          onClick={startNewChat}
          className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2 mb-3"
        >
          <span>+ Yangi Suhbat</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          {chatSessions.map(sess => (
            <button
              key={sess.id}
              onClick={() => setActiveSessionId(sess.id)}
              className={`w-full text-left p-2.5 rounded-xl text-xs transition truncate ${
                activeSessionId === sess.id
                  ? 'bg-slate-800 text-white font-medium border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              <p className="truncate">{sess.title}</p>
              <span className="text-[10px] text-slate-500">{sess.updatedAt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Chat Control Header */}
        <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeAgent.avatar}</span>
            <div>
              <h3 className="text-xs font-bold text-white">{activeAgent.name}</h3>
              <p className="text-[10px] text-blue-400">{activeAgent.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300">
              <span className="text-[10px] text-slate-500 font-mono">Model:</span>
              <select
                value={activeModelId}
                onChange={(e) => setActiveModelId(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
              >
                <optgroup label="Navy AI (Universal Engine)">
                  <option value="navy-ultra-latest">Navy AI Ultra (JARVIS)</option>
                  <option value="navy-fast-v1">Navy AI Fast</option>
                  <option value="navy-coder">Navy AI Coder</option>
                </optgroup>
                <optgroup label="Google Gemini">
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                  <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite</option>
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
                  <option value="pixtral-12b-2409">Pixtral 12B</option>
                </optgroup>
              </select>
            </div>

            {/* Agent Selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300">
              <span className="text-[10px] text-slate-500 font-mono">Agent:</span>
              <select
                value={activeAgentId}
                onChange={(e) => setActiveAgentId(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {activeModel.isFree && (
              <Badge variant="green" size="sm">0$ Bepul</Badge>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/40">
          {activeSession?.messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-500">
                  <span>{isUser ? 'Siz' : msg.agentName || 'Agent'}</span>
                  {msg.modelUsed && <span className="font-mono text-slate-600">• {msg.modelUsed}</span>}
                  <span>• {msg.timestamp}</span>
                </div>

                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                </div>
              </div>
            );
          })}

          {isGeneratingResponse && (
            <div className="flex items-center gap-2 text-xs text-blue-400 italic p-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>{activeAgent.name} ({activeModelId}) javob tayyorlamoqda...</span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold flex-shrink-0">Tavsiyalar:</span>
          {[
            'JARVIS, barcha tizimlar holatini tekshir va hisobot ber',
            'Haftalik AI yangiliklari hisobotini tuzing',
            'DeepSeek R1 bilan mantiqiy masalani yeching',
            'Codestral bilan Python Telegram bot yozing',
            'Mistral Large bilan bozor tahlilini o‘tkazing'
          ].map(s => (
            <button
              key={s}
              onClick={() => setInputMessage(s)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 whitespace-nowrap transition border border-slate-800"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="O‘zbek tilida savol bering yoki topshiriq yozing..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isGeneratingResponse || !inputMessage.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-500/20 transition flex-shrink-0"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
