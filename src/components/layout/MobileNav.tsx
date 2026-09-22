import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  if (!isMobileMenuOpen) return null;

  const tabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'chat', label: 'AI Chat', icon: '💬' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'teams', label: 'Teams', icon: '👥' },
    { id: 'models', label: 'Models', icon: '🧠' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'knowledge', label: 'Knowledge', icon: '📚' },
    { id: 'files', label: 'Files', icon: '📄' },
    { id: 'automations', label: 'Automations', icon: '🔄' },
    { id: 'telegram', label: 'Telegram', icon: '✈️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex flex-col md:hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h2 className="font-bold text-white text-base">Nexus AI Menyu</h2>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-3 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
