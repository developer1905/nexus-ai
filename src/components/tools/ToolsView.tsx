import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const ToolsView: React.FC = () => {
  const { tools, toggleTool } = useApp();
  const [sandboxCode, setSandboxCode] = useState('numbers = [x**2 for x in range(6)]\nprint("Kvadratlar:", numbers)');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSandbox = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        setSandboxOutput('Kvadratlar: [0, 1, 4, 9, 16, 25]\nIjro vaqti: 18ms\nHolat: Success (Exit code: 0)');
      } finally {
        setIsRunning(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Asboblar & Sandbox Ijro Muhiti</h2>
        <p className="text-xs text-slate-400 mt-1">
          Agentlar chaqirishi mumkin bo‘lgan asboblar va xavfsiz Python sandbox
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ro‘yxatdagi Asboblar</h3>
          {tools.map(t => (
            <div key={t.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                <Badge variant={t.isEnabled ? 'green' : 'gray'}>{t.isEnabled ? 'Faol' : 'O‘chiq'}</Badge>
              </div>
              <p className="text-xs text-slate-400">{t.description}</p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Limit: {t.rateLimitPerMinute} req/min</span>
                <button
                  onClick={() => toggleTool(t.id)}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  {t.isEnabled ? 'O‘chirish' : 'Faollashtirish'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Python Sandbox */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-white">Python Sandbox Sinov Maydoni</h4>
              <Badge variant="blue" size="sm">Isolated Runtime</Badge>
            </div>
            <textarea
              rows={6}
              value={sandboxCode}
              onChange={(e) => setSandboxCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono focus:outline-none"
            />
            {sandboxOutput && (
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                {sandboxOutput}
              </div>
            )}
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunSandbox}
              disabled={isRunning}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
            >
              {isRunning ? 'Bajarilmoqda...' : 'Kodni Bajarish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
