import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const TasksView: React.FC = () => {
  const { tasks } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Vazifalar Paneli & Handoffs</h2>
        <p className="text-xs text-slate-400 mt-1">
          Agentlar o‘rtasida topshirilgan va bajarilgan vazifalar jurnali
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(t => (
          <div key={t.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-bold text-white text-sm">{t.title}</h4>
              <Badge variant={t.status === 'Completed' ? 'green' : 'blue'}>{t.status}</Badge>
            </div>
            <p className="text-xs text-slate-400">{t.description}</p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Yuboruvchi:</span>
                <span className="text-white font-medium">{t.senderName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bajaruvchi:</span>
                <span className="text-white font-medium">{t.receiverName}</span>
              </div>
              {t.traceId && (
                <div className="flex justify-between text-slate-400">
                  <span>Trace ID:</span>
                  <span className="text-sky-400 font-mono">{t.traceId}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
