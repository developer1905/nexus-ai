import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentTeam, TeamRoleType } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { IconPlus, IconPlay, IconTasks } from '../common/Icons';

export const AgentTeamsView: React.FC = () => {
  const { 
    teams, 
    agents, 
    tasks, 
    collaborationTraces,
    agentMessages,
    createTeam, 
    runTeamWorkflow, 
    runAcceptanceTestWorkflow,
    isAcceptanceRunning,
    isEmergencyStopped,
    setActiveTab 
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'teams' | 'canvas' | 'traces' | 'acceptance'>('teams');

  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [workflowType, setWorkflowType] = useState<AgentTeam['workflowType']>('hierarchical');
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([
    'agent-chief-pm', 
    'agent-researcher', 
    'agent-analyst', 
    'agent-copywriter',
    'agent-developer'
  ]);

  const [activeSimulationTeamId, setActiveSimulationTeamId] = useState<string | null>(null);
  const [simulationPrompt, setSimulationPrompt] = useState('');
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    createTeam({
      name: teamName.trim(),
      description: teamDesc.trim() || 'Ko‘p agentli avtonom hamkorlik guruhi',
      workflowType,
      members: selectedAgentIds.map((id, idx) => {
        let role: TeamRoleType = 'Specialist';
        if (idx === 0) role = 'Manager';
        else if (idx === 1) role = 'Researcher';
        else if (idx === 2) role = 'Analyst';
        else if (idx === 3) role = 'Writer';
        else if (idx === selectedAgentIds.length - 1) role = 'Reviewer';

        return {
          agentId: id,
          roleInTeam: role,
          order: idx + 1
        };
      })
    });

    setTeamName('');
    setTeamDesc('');
    setIsNewTeamModalOpen(false);
  };

  const handleStartSimulation = (teamId: string) => {
    setActiveSimulationTeamId(teamId);
    setSimulationPrompt('Har hafta AI yangiliklari bo‘yicha report tayyorla va Telegram guruhimga yubor');
    setIsSimModalOpen(true);
  };

  const executeSimulation = () => {
    if (!activeSimulationTeamId) return;
    runTeamWorkflow(activeSimulationTeamId, simulationPrompt);
    setIsSimModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Multi-Agent Hamkorlik & Jamoalar</h2>
            <Badge variant="purple" size="sm">Phase 2 Gateway</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Nova PM (Manager), Atlas (DeepSeek R1), Cipher (Mistral Large), Lyra (Llama 3.3) va Kite (Codestral) hamkorligi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runAcceptanceTestWorkflow}
            disabled={isAcceptanceRunning || isEmergencyStopped}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <IconPlay className="w-3.5 h-3.5" />
            <span>{isAcceptanceRunning ? 'Test Ijro Etilmoqda...' : 'Acceptance Test (Req 49)'}</span>
          </button>

          <button
            onClick={() => setIsNewTeamModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <IconPlus className="w-4 h-4" />
            <span>Jamoa Tuzish</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar border-b border-slate-800">
        {[
          { id: 'teams', label: '👥 Jamoalar Katalogi' },
          { id: 'canvas', label: '🕸️ Vizual Workflow Grafigi (Canvas)' },
          { id: 'traces', label: '🔍 Gateway Traces (tr_...)' },
          { id: 'acceptance', label: '🎯 User Acceptance Scenario (Req 49)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabSub(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap transition border-b-2 -mb-[1px] ${
              activeTabSub === tab.id
                ? 'border-purple-500 text-purple-400 font-semibold bg-purple-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: TEAMS LIST */}
      {activeTabSub === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map(team => {
            const teamTasks = tasks.filter(t => t.teamId === team.id);
            const activeTask = tasks.find(t => t.id === team.activeTaskId) || teamTasks[0];

            return (
              <div
                key={team.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-white">{team.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{team.description}</p>
                    </div>
                    <Badge variant={team.status === 'running' ? 'green' : 'gray'}>
                      {team.status === 'running' ? 'Pipeline Faol' : 'Kutishda'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                    <span className="text-slate-500">Koordinatsiya:</span>
                    <Badge variant="purple" size="sm">{team.workflowType.toUpperCase()}</Badge>
                    <span className="text-slate-500">|</span>
                    <span>{team.members.length} Agent</span>
                  </div>

                  {/* Pipeline Visual */}
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 mb-4">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Agentlararo Vazifalar Zanjiri (Pipeline)
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
                      {team.members.map((member, idx) => {
                        const agent = agents.find(a => a.id === member.agentId);
                        return (
                          <React.Fragment key={member.agentId}>
                            <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 flex-shrink-0">
                              <span className="text-lg">{agent?.avatar || '🤖'}</span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate max-w-[90px]">
                                  {agent?.name || 'Agent'}
                                </p>
                                <p className="text-[10px] text-purple-400 truncate capitalize font-mono">
                                  {member.roleInTeam}
                                </p>
                              </div>
                            </div>
                            {idx < team.members.length - 1 && (
                              <span className="text-slate-600 font-bold text-xs flex-shrink-0">→</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {activeTask && (
                    <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 mb-4 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Joriy Vazifa</span>
                        <Badge variant={activeTask.status === 'Completed' ? 'green' : 'blue'}>
                          {activeTask.status}
                        </Badge>
                      </div>
                      <p className="font-medium text-white truncate">{activeTask.title}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <IconTasks className="w-3.5 h-3.5" />
                    <span>Jamoa Vazifalari ({teamTasks.length})</span>
                  </button>

                  <button
                    onClick={() => handleStartSimulation(team.id)}
                    disabled={team.status === 'running' || isEmergencyStopped}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Workflow Boshlash
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: VISUAL WORKFLOW CANVAS */}
      {activeTabSub === 'canvas' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">Avtonom Multi-Agent Workflow Grafigi</h3>
              <p className="text-xs text-slate-400">
                START → AGENT → PARALLEL → JOIN → APPROVAL → TELEGRAM → END
              </p>
            </div>
            <Badge variant="blue" size="sm">Auto-Layout Engine</Badge>
          </div>

          <div className="p-6 bg-[#090d16] rounded-xl border border-slate-800 overflow-x-auto min-w-[700px]">
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl text-center min-w-[110px]">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">TRIGGER</span>
                <p className="font-bold text-white mt-0.5">START</p>
                <span className="text-[10px] text-slate-400">Telegram / Cron</span>
              </div>

              <span className="text-slate-600 font-bold text-lg">→</span>

              <div className="p-3 bg-blue-500/10 border-2 border-blue-500 rounded-xl text-center min-w-[120px]">
                <span className="text-[10px] font-mono font-bold text-blue-400 block uppercase">MANAGER</span>
                <p className="font-bold text-white mt-0.5">Nova PM</p>
                <span className="text-[10px] text-slate-400">Plan & Delegate</span>
              </div>

              <span className="text-slate-600 font-bold text-lg">→</span>

              <div className="p-2.5 bg-purple-500/10 border-2 border-purple-500/80 rounded-xl space-y-2 min-w-[140px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-purple-300 uppercase">PARALLEL EXEC</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                </div>
                <div className="p-1.5 bg-slate-900/90 rounded border border-slate-700 text-[11px] text-slate-200">
                  🔬 Atlas (DeepSeek R1)
                </div>
                <div className="p-1.5 bg-slate-900/90 rounded border border-slate-700 text-[11px] text-slate-200">
                  📊 Cipher (Mistral Large)
                </div>
              </div>

              <span className="text-slate-600 font-bold text-lg">→</span>

              <div className="p-3 bg-indigo-500/10 border-2 border-indigo-500 rounded-xl text-center min-w-[120px]">
                <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">WRITER</span>
                <p className="font-bold text-white mt-0.5">Lyra (Llama 3.3)</p>
                <span className="text-[10px] text-slate-400">Uzbek Report</span>
              </div>

              <span className="text-slate-600 font-bold text-lg">→</span>

              <div className="p-3 bg-amber-500/10 border-2 border-amber-500 rounded-xl text-center min-w-[120px]">
                <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">REVIEWER</span>
                <p className="font-bold text-white mt-0.5">Kite (Codestral)</p>
                <span className="text-[10px] text-slate-400">Quality Check</span>
              </div>

              <span className="text-slate-600 font-bold text-lg">→</span>

              <div className="p-3 bg-rose-500/10 border-2 border-rose-500 rounded-xl text-center min-w-[120px]">
                <span className="text-[10px] font-mono font-bold text-rose-400 block uppercase">HUMAN GATE</span>
                <p className="font-bold text-white mt-0.5">Approval</p>
                <span className="text-[10px] text-slate-400">Operator review</span>
              </div>

              <span className="text-slate-600 font-bold text-lg">→</span>

              <div className="p-3 bg-sky-500/10 border-2 border-sky-500 rounded-xl text-center min-w-[120px]">
                <span className="text-[10px] font-mono font-bold text-sky-400 block uppercase">DELIVERY</span>
                <p className="font-bold text-white mt-0.5">Telegram</p>
                <span className="text-[10px] text-slate-400">Guruhga yuborish</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRACES INSPECTOR */}
      {activeTabSub === 'traces' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Gateway Traces & Protokol Audit Jurnali</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Agentlararo xabarlar almashinuvi va unikal tr_... Trace ID lar
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
              {collaborationTraces.length} Traces
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Trace ID</th>
                  <th className="py-2.5 px-3">Vaqt</th>
                  <th className="py-2.5 px-3">Yo‘nalish</th>
                  <th className="py-2.5 px-3">Turi</th>
                  <th className="py-2.5 px-3">Tafsilotlar</th>
                  <th className="py-2.5 px-3">Kechikish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {collaborationTraces.map(trace => (
                  <tr key={trace.traceId} className="hover:bg-slate-850">
                    <td className="py-2.5 px-3 font-mono text-sky-400">{trace.traceId}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{trace.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-white font-medium">{trace.senderName}</span>
                      <span className="text-slate-500 mx-1">→</span>
                      <span className="text-purple-400">{trace.receiverName}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant="purple" size="sm">{trace.messageType}</Badge>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs truncate text-slate-300">{trace.details}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{trace.durationMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACCEPTANCE TEST (REQ 49) */}
      {activeTabSub === 'acceptance' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-800/40 rounded-2xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                  Acceptance Test Scenario (Requirement 49)
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  "Har hafta AI yangiliklari bo‘yicha report tayyorla va Telegram guruhimga yubor"
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Nova PM boshqaruvida Atlas (DeepSeek R1), Cipher (Mistral Large), Lyra (Llama 3.3) va Kite (Codestral) agentlari to‘liq tsiklni bajaradi.
                </p>
              </div>

              <button
                onClick={runAcceptanceTestWorkflow}
                disabled={isAcceptanceRunning || isEmergencyStopped}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg text-xs flex items-center gap-2 whitespace-nowrap"
              >
                <IconPlay className="w-4 h-4" />
                <span>{isAcceptanceRunning ? 'Test Ijrosi Davom Etmoqda...' : 'Ssenariyni Boshlash (Run)'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 block">1-Bosqich</span>
                <span className="font-semibold text-white">So‘rov Qabuli</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 block">2-Bosqich</span>
                <span className="font-semibold text-white">Nova PM Rejasi</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 block">3-Bosqich</span>
                <span className="font-semibold text-white">Atlas Researcher</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 block">4-Bosqich</span>
                <span className="font-semibold text-white">Cipher Analyst</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 block">5-Bosqich</span>
                <span className="font-semibold text-white">Lyra Writer</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 block">6-Bosqich</span>
                <span className="font-semibold text-white">Inson Tasdig‘i</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-emerald-400 block">7-Bosqich</span>
                <span className="font-semibold text-emerald-300">Guruhga Nashr</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Test Ssenariysi Jonli Protokol Xabarlari
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {agentMessages.map(msg => (
                <div key={msg.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="blue" size="sm">{msg.messageType}</Badge>
                      <span className="font-semibold text-white">{msg.senderAgentName} → {msg.receiverAgentName}</span>
                      <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1 rounded">{msg.traceId}</span>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px]">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simulation Modal */}
      <Modal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        title="Avtonom Workflow Jarayonini Ishga Tushirish"
        subtitle="Agentlararo vazifalar zanjiri o‘zbek tilida amalga oshiriladi"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Vazifa Maqsadi</label>
            <textarea
              rows={3}
              value={simulationPrompt}
              onChange={(e) => setSimulationPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsSimModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              onClick={executeSimulation}
              className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg"
            >
              Ishga Tushirish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
