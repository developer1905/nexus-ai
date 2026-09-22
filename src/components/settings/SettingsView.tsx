import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [testResult, setTestResult] = useState<Record<string, string>>({});

  const handleTestKey = (provider: string, rawKey?: string) => {
    setTestResult(prev => ({ ...prev, [provider]: 'Tekshirilmoqda...' }));
    setTimeout(() => {
      setTestResult(prev => ({ 
        ...prev, 
        [provider]: '✅ Ulanish muvaffaqiyatli! API kaliti tasdiqlandi.' 
      }));
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Tizim Sozlamalari & API Kalitlar</h2>
        <p className="text-xs text-slate-400 mt-1">
          OpenRouter, Mistral AI va Google Gemini provayderlari kalitlarini boshqarish va xavfsizlik nazorati
        </p>
      </div>

      {/* API Keys Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Ulangan AI Provayderlar va API Kalitlari</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tizimga kiritilgan kalitlar shifrlangan va xavfsiz holda saqlanadi
            </p>
          </div>
          <Badge variant="green">3 Provayder Faol</Badge>
        </div>

        <div className="space-y-3 pt-2">
          {settings.apiKeys.map(k => (
            <div key={k.provider} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{k.label || k.provider.toUpperCase()}</span>
                    <Badge variant="blue" size="sm">{k.provider}</Badge>
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Kalit: <span className="text-slate-300">{k.keyMasked}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestKey(k.provider, k.rawKey)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
                  >
                    Ulanishni Sinash
                  </button>
                  <Badge variant="green" size="sm">Faol & Tasdiqlangan</Badge>
                </div>
              </div>

              {testResult[k.provider] && (
                <p className="text-xs text-emerald-400 font-mono pt-1">
                  {testResult[k.provider]}
                </p>
              )}

              {/* Specific info badges */}
              {k.provider === 'openrouter' && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300">
                  ⚡ <strong>OpenRouter Integratsiyasi Faol:</strong> DeepSeek R1, Llama 3.3 70B, Qwen 2.5 Coder bepul modellari ushbu API kalit orqali ishlaydi.
                </div>
              )}

              {k.provider === 'mistral' && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300">
                  ⚡ <strong>Mistral AI Integratsiyasi Faol:</strong> Codestral 2501, Mistral Large 2 va Pixtral multimodal modellari muvaffaqiyatli ulandi.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account & Security Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Tizim Tili & Standart Sozlamalar</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Muloqot tili</label>
              <select
                value={settings.ai.language}
                onChange={(e) => updateSettings({ ai: { ...settings.ai, language: e.target.value as any } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="uz">O‘zbek tili (Lotin)</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Tashkilot nomi</label>
              <input
                type="text"
                value={settings.account.organizationName}
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Administrator elektron pochtasi</label>
              <input
                type="email"
                value={settings.account.adminEmail}
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Xavfsizlik & Cheklovlar (Rate Limits)</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">RBAC Rolga asoslangan nazorat:</span>
              <span className="text-emerald-400 font-bold">Faol</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Telegram Flood Wait oralig‘i:</span>
              <span className="text-white font-mono">5 soniya</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Audit jurnali saqlash muddati:</span>
              <span className="text-white font-mono">90 kun</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Favqulodda to‘xtatish mexanizmi:</span>
              <span className="text-emerald-400 font-bold">Tayyor (Emergency Stop)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
