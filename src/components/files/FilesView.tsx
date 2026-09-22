import React from 'react';

export const FilesView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Fayllar Kutubxonasi</h2>
        <p className="text-xs text-slate-400 mt-1">
          Agentlar tahlil qilgan va ishlab chiqqan fayllar arxivi
        </p>
      </div>
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
        📄 Hozircha yangi tahlil qilingan hisobot fayllari tayyorlanmoqda.
      </div>
    </div>
  );
};
