import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const SkillsView: React.FC = () => {
  const { skills, toggleSkill } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Ko‘nikmalar Modullari (Skills)</h2>
        <p className="text-xs text-slate-400 mt-1">
          Agentlarga beriladigan ixtisoslashgan amaliy qobiliyatlar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(s => (
          <div key={s.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm">{s.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{s.category} • v{s.version}</span>
                </div>
              </div>
              <Badge variant={s.isEnabled ? 'green' : 'gray'}>
                {s.isEnabled ? 'Faol' : 'O‘chiq'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{s.description}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => toggleSkill(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  s.isEnabled ? 'bg-slate-800 text-slate-300' : 'bg-blue-600 text-white'
                }`}
              >
                {s.isEnabled ? 'O‘chirish' : 'Yoqish'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
