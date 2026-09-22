import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { 
  IconDashboard, 
  IconChat, 
  IconAgent, 
  IconTeams, 
  IconCpu, 
  IconSkills, 
  IconTools, 
  IconProjects, 
  IconTasks, 
  IconKnowledge, 
  IconFiles, 
  IconAutomations, 
  IconTelegram, 
  IconAnalytics, 
  IconSettings 
} from '../common/Icons';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isSidebarCollapsed, setIsSidebarCollapsed } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'chat', label: 'AI Chat', icon: IconChat },
    { id: 'agents', label: 'Agents', icon: IconAgent },
    { id: 'teams', label: 'Agent Teams', icon: IconTeams, badge: 'Pro' },
    { id: 'models', label: 'Models', icon: IconCpu, badge: '11 ta' },
    { id: 'skills', label: 'Skills', icon: IconSkills },
    { id: 'tools', label: 'Tools', icon: IconTools },
    { id: 'projects', label: 'Projects', icon: IconProjects },
    { id: 'tasks', label: 'Tasks', icon: IconTasks },
    { id: 'knowledge', label: 'Knowledge', icon: IconKnowledge },
    { id: 'files', label: 'Files', icon: IconFiles },
    { id: 'automations', label: 'Automations', icon: IconAutomations },
    { id: 'telegram', label: 'Telegram', icon: IconTelegram, badge: '5 Rejim' },
    { id: 'analytics', label: 'Analytics', icon: IconAnalytics },
    { id: 'settings', label: 'Settings', icon: IconSettings }
  ];

  return (
    <aside className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 z-20 ${
      isSidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
              N
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight leading-none">Nexus AI</h1>
              <span className="text-[10px] text-blue-400 font-mono">Enterprise SaaS</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition mx-auto"
          title={isSidebarCollapsed ? 'Kengaytirish' : 'Yig‘ish'}
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!isSidebarCollapsed && item.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer user card */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-800 m-2 bg-slate-950 rounded-xl flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
            AV
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">Alisher Vance</p>
            <p className="text-[10px] text-emerald-400 font-mono">Admin • Enterprise</p>
          </div>
        </div>
      )}
    </aside>
  );
};
