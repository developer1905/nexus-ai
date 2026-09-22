import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const ProjectsView: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Loyihalar & Ishchi Muhitlar</h2>
        <p className="text-xs text-slate-400 mt-1">
          Agentlarni loyiha va jamoaviy kontekstlarga ajratish
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p => {
          const isActive = activeProjectId === p.id;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition ${
                isActive ? 'border-blue-500' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <Badge variant={isActive ? 'blue' : 'gray'}>{isActive ? 'Faol Loyiha' : 'Loyiha'}</Badge>
              </div>
              <h3 className="font-bold text-white text-base">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">{p.description}</p>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">{p.agentIds.length} Agent biriktirilgan</span>
                <button
                  onClick={() => setActiveProjectId(p.id)}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  {isActive ? 'Tanlangan' : 'O‘tish'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
