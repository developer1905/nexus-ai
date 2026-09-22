import React from 'react';

export const KnowledgeView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">RAG & Bilimlar Bazasi</h2>
        <p className="text-xs text-slate-400 mt-1">
          Hujjatlarni vektorlashtirish va agentlar uchun kontekst taqdim etish
        </p>
      </div>
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
        📚 3 ta bilimlar to‘plami faol (Kompaniya ma'lumotnomasi, API qo‘llanmasi, Telegram protokoli).
      </div>
    </div>
  );
};
