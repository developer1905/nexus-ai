import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MobileNav } from './components/layout/MobileNav';

import { DashboardView } from './components/dashboard/DashboardView';
import { ChatView } from './components/chat/ChatView';
import { AgentsView } from './components/agents/AgentsView';
import { AgentTeamsView } from './components/teams/AgentTeamsView';
import { ModelsView } from './components/models/ModelsView';
import { SkillsView } from './components/skills/SkillsView';
import { ToolsView } from './components/tools/ToolsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { TasksView } from './components/tasks/TasksView';
import { KnowledgeView } from './components/knowledge/KnowledgeView';
import { FilesView } from './components/files/FilesView';
import { AutomationsView } from './components/automations/AutomationsView';
import { TelegramView } from './components/telegram/TelegramView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'chat': return <ChatView />;
      case 'agents': return <AgentsView />;
      case 'teams': return <AgentTeamsView />;
      case 'models': return <ModelsView />;
      case 'skills': return <SkillsView />;
      case 'tools': return <ToolsView />;
      case 'projects': return <ProjectsView />;
      case 'tasks': return <TasksView />;
      case 'knowledge': return <KnowledgeView />;
      case 'files': return <FilesView />;
      case 'automations': return <AutomationsView />;
      case 'telegram': return <TelegramView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
