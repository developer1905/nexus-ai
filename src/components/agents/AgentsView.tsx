import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Agent } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AgentsView: React.FC = () => {
  const { agents, models, createAgent, updateAgent, deleteAgent, setActiveTab, setActiveAgentId } = useApp();
  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formAvatar, setFormAvatar] = useState('🤖');
  const [formModel, setFormModel] = useState('deepseek/deepseek-r1:free');
  const [formPrompt, setFormPrompt] = useState('');

  const handleOpenCreate = () => {
    setEditingAgent(null);
    setFormName('');
    setFormRole('');
    setFormAvatar('🤖');
    setFormModel('deepseek/deepseek-r1:free');
    setFormPrompt('Siz aqlli yordamchisiz. Har doim o‘zbek tilida sifatli javob bering.');
    setIsNewAgentModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingAgent) {
      updateAgent(editingAgent.id, {
        name: formName,
        role: formRole,
        avatar: formAvatar,
        modelId: formModel,
        systemPrompt: formPrompt
      });
    } else {
      createAgent({
        name: formName,
        role: formRole,
        avatar: formAvatar,
        modelId: formModel,
        systemPrompt: formPrompt
      });
    }
    setIsNewAgentModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Agentlar Katalogi & Konstruktori</h2>
          <p className="text-xs text-slate-400 mt-1">
            Har bir agentga OpenRouter bepul modellari yoki Mistral AI modellarini biriktirishingiz mumkin
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          + Yangi Agent Yaratish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => {
          const model = models.find(m => m.id === agent.modelId);
          return (
            <div
              key={agent.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{agent.avatar}</span>
                    <div>
                      <h3 className="font-bold text-white text-base">{agent.name}</h3>
                      <p className="text-xs text-blue-400 font-medium">{agent.role}</p>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'green' : 'gray'}>
                    {agent.status}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model:</span>
                    <span className="font-mono text-white font-semibold truncate max-w-[150px]">{model?.name || agent.modelId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Provayder:</span>
                    <span className="text-sky-400 font-mono capitalize">{model?.provider || 'LLM'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 italic">
                  "{agent.systemPrompt}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setActiveAgentId(agent.id);
                    setActiveTab('chat');
                  }}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg font-medium transition"
                >
                  Suhbatlashish
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingAgent(agent);
                      setFormName(agent.name);
                      setFormRole(agent.role);
                      setFormAvatar(agent.avatar);
                      setFormModel(agent.modelId);
                      setFormPrompt(agent.systemPrompt);
                      setIsNewAgentModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Tahrirlash
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isNewAgentModalOpen}
        onClose={() => setIsNewAgentModalOpen(false)}
        title={editingAgent ? "Agentni Tahrirlash" : "Yangi Agent Yaratish"}
        subtitle="AI model va tizim yo‘riqnomasini sozlang"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Agent Nomi</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="masalan: Qwen Kod Eksperti"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Avatar</label>
              <input
                type="text"
                value={formAvatar}
                onChange={(e) => setFormAvatar(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-center text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Rol / Mutaxassislik</label>
            <input
              type="text"
              required
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              placeholder="masalan: Jarvis (Universal Hamma Ishlarni Bajaruvchi) yoki Muhandis"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bog‘langan AI Modeli</label>
            <select
              value={formModel}
              onChange={(e) => setFormModel(e.target.value)}
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
              <optgroup label="Google Gemini (Native)">
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (Default)</option>
                <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tizim Yo‘riqnomasi (System Prompt)</label>
            <textarea
              rows={4}
              required
              value={formPrompt}
              onChange={(e) => setFormPrompt(e.target.value)}
              placeholder="Agent nima qilishi kerakligini o‘zbek tilida yozing..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsNewAgentModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
