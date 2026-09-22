import React from 'react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { models } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Telemetriya & Token Tahlili</h2>
        <p className="text-xs text-slate-400 mt-1">
          OpenRouter, Mistral va Gemini modellarining resurs sarfi va unumdorlik statistikasi
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">OpenRouter Bepul Modellari Sarfi</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">0.00$</p>
          <p className="text-[10px] text-slate-500 mt-1">DeepSeek R1, Llama 3.3, Qwen</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">O‘rtacha Kechikish</p>
          <p className="text-2xl font-bold text-sky-400 mt-1">42ms</p>
          <p className="text-[10px] text-slate-500 mt-1">Optimal so‘rov tezligi</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">Muvaffaqiyat Darajasi</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">99.8%</p>
          <p className="text-[10px] text-slate-500 mt-1">Telegram webhook va agentlar</p>
        </div>
      </div>
    </div>
  );
};
