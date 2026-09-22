import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const AutomationsView: React.FC = () => {
  const { automations, runAcceptanceTestWorkflow, isAcceptanceRunning } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Vizual Workflow Avtomatlashtirish</h2>
          <p className="text-xs text-slate-400 mt-1">
            Rejalashtirilgan cron va avtonom ish oqimlari
          </p>
        </div>
        <button
          onClick={runAcceptanceTestWorkflow}
          disabled={isAcceptanceRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
        >
          Haftalik Workflow Sinovi
        </button>
      </div>

      <div className="space-y-4">
        {automations.map(wf => (
          <div key={wf.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">{wf.name}</h3>
              <Badge variant="purple">{wf.schedule}</Badge>
            </div>
            <p className="text-xs text-slate-400">{wf.description}</p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex gap-2 overflow-x-auto text-xs">
              {wf.nodes.map(n => (
                <span key={n.id} className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded border border-slate-800 whitespace-nowrap">
                  {n.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
