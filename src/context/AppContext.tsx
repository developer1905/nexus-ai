import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NavigationTab, 
  TelegramSubSection,
  AIModel, 
  Agent, 
  AgentTeam, 
  InterAgentTask, 
  Skill, 
  Tool, 
  Project, 
  TelegramBot, 
  TelegramGroup, 
  TelegramChannel, 
  TelegramPostDraft, 
  TelegramLogEntry, 
  CollaborationTrace, 
  AgentProtocolMessage, 
  AppSettings,
  AutomationWorkflow,
  ApprovalRequest,
  ChatSession,
  ChatMessage
} from '../types';
import { 
  INITIAL_MODELS, 
  INITIAL_AGENTS, 
  INITIAL_TEAMS, 
  INITIAL_TASKS, 
  INITIAL_SKILLS, 
  INITIAL_TOOLS, 
  INITIAL_PROJECTS, 
  INITIAL_AUTOMATIONS, 
  INITIAL_TELEGRAM_BOTS, 
  INITIAL_TELEGRAM_GROUPS, 
  INITIAL_TELEGRAM_CHANNELS, 
  INITIAL_TELEGRAM_DRAFTS, 
  INITIAL_TELEGRAM_LOGS, 
  INITIAL_COLLABORATION_TRACES, 
  INITIAL_AGENT_MESSAGES, 
  INITIAL_SETTINGS 
} from '../services/mockData';
import { ProviderService } from '../services/providerService';
import { CollaborationGateway } from '../services/collaborationGateway';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeTelegramTab: TelegramSubSection;
  setActiveTelegramTab: (tab: TelegramSubSection) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;

  // Emergency Stop
  isEmergencyStopped: boolean;
  emergencyStopReason: string;
  emergencyStopAll: (reason?: string) => void;
  resumeAllAgents: () => void;

  // Models
  models: AIModel[];
  activeModelId: string;
  setActiveModelId: (id: string) => void;

  // Agents
  agents: Agent[];
  activeAgentId: string;
  setActiveAgentId: (id: string) => void;
  createAgent: (agent: Partial<Agent>) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;

  // Teams & Workflows
  teams: AgentTeam[];
  createTeam: (team: Partial<AgentTeam>) => void;
  runTeamWorkflow: (teamId: string, taskTitle: string) => void;
  runAcceptanceTestWorkflow: () => Promise<void>;
  isAcceptanceRunning: boolean;

  // Tasks & Messages
  tasks: InterAgentTask[];
  createTask: (task: Partial<InterAgentTask>) => void;
  agentMessages: AgentProtocolMessage[];
  collaborationTraces: CollaborationTrace[];
  dispatchProtocolMessage: (senderId: string, receiverId: string, taskId: string, taskTitle: string, type: AgentProtocolMessage['messageType'], content: string) => void;

  // Skills & Tools
  skills: Skill[];
  toggleSkill: (id: string) => void;
  tools: Tool[];
  toggleTool: (id: string) => void;

  // Projects
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;

  // Chat
  chatSessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  startNewChat: () => void;
  sendChatMessage: (content: string) => Promise<void>;
  isGeneratingResponse: boolean;

  // Telegram
  telegramBots: TelegramBot[];
  telegramGroups: TelegramGroup[];
  telegramChannels: TelegramChannel[];
  telegramDrafts: TelegramPostDraft[];
  telegramLogs: TelegramLogEntry[];
  connectTelegramBot: (name: string, token: string) => { success: boolean; message: string };
  disconnectTelegramBot: (botId: string) => void;
  updateGroupMode: (groupId: string, mode: TelegramGroup['mode']) => void;
  updateGroupSettings: (groupId: string, updates: Partial<TelegramGroup>) => void;
  createPostDraft: (draft: Partial<TelegramPostDraft>) => void;
  publishPostDraft: (draftId: string) => void;

  // Automations & Approvals
  automations: AutomationWorkflow[];
  approvals: ApprovalRequest[];
  resolveApproval: (approvalId: string, decision: 'approved' | 'rejected') => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [activeTelegramTab, setActiveTelegramTab] = useState<TelegramSubSection>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Emergency Stop State
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);
  const [emergencyStopReason, setEmergencyStopReason] = useState('');

  // Core Data State
  const [models, setModels] = useState<AIModel[]>(INITIAL_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>('gemini-3.6-flash');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState<string>('agent-chief-pm');
  const [teams, setTeams] = useState<AgentTeam[]>(INITIAL_TEAMS);
  const [tasks, setTasks] = useState<InterAgentTask[]>(INITIAL_TASKS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>('proj-core');
  const [automations, setAutomations] = useState<AutomationWorkflow[]>(INITIAL_AUTOMATIONS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Telegram State
  const [telegramBots, setTelegramBots] = useState<TelegramBot[]>(INITIAL_TELEGRAM_BOTS);
  const [telegramGroups, setTelegramGroups] = useState<TelegramGroup[]>(INITIAL_TELEGRAM_GROUPS);
  const [telegramChannels, setTelegramChannels] = useState<TelegramChannel[]>(INITIAL_TELEGRAM_CHANNELS);
  const [telegramDrafts, setTelegramDrafts] = useState<TelegramPostDraft[]>(INITIAL_TELEGRAM_DRAFTS);
  const [telegramLogs, setTelegramLogs] = useState<TelegramLogEntry[]>(INITIAL_TELEGRAM_LOGS);
  const [collaborationTraces, setCollaborationTraces] = useState<CollaborationTrace[]>(INITIAL_COLLABORATION_TRACES);
  const [agentMessages, setAgentMessages] = useState<AgentProtocolMessage[]>(INITIAL_AGENT_MESSAGES);
  const [isAcceptanceRunning, setIsAcceptanceRunning] = useState(false);

  // Approvals
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([
    {
      id: 'appr-001',
      type: 'Telegram Post',
      title: 'Haftalik AI Yangiliklari Dayjesti E\'loni',
      description: '@ai_daily_uz kanaliga yangi post chiqarish uchun inson tasdig‘i',
      requesterAgentId: 'agent-copywriter',
      requesterAgentName: 'Lyra Copywriter',
      destination: '@ai_daily_uz',
      payload: { draftId: 'draft-001' },
      status: 'pending',
      createdAt: '14:15'
    }
  ]);

  // Chat State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'sess-default',
      title: 'Yangi AI Suhbat',
      createdAt: '14:00',
      updatedAt: '14:00',
      projectId: 'proj-core',
      messages: [
        {
          id: 'msg-init',
          sender: 'agent',
          agentId: 'agent-chief-pm',
          agentName: 'Nova PM',
          content: 'Assalomu alaykum! Men Nexus AI boshqaruvchisiman. OpenRouter bepul modellari (DeepSeek, Llama 3.3, Qwen) va Mistral AI ulandi. Qanday vazifani bajaramiz?',
          timestamp: '14:00',
          modelUsed: 'gemini-3.6-flash'
        }
      ]
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess-default');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  // Emergency Stop Handlers
  const emergencyStopAll = (reason: string = 'Operator buyrug‘i (Emergency Stop)') => {
    setIsEmergencyStopped(true);
    setEmergencyStopReason(reason);
    setAgents(prev => prev.map(a => ({ ...a, status: 'paused' })));
    setTeams(prev => prev.map(t => ({ ...t, status: 'paused' })));
  };

  const resumeAllAgents = () => {
    setIsEmergencyStopped(false);
    setEmergencyStopReason('');
    setAgents(prev => prev.map(a => ({ ...a, status: 'active' })));
    setTeams(prev => prev.map(t => ({ ...t, status: 'idle' })));
  };

  // Dispatch Protocol Message
  const dispatchProtocolMessage = (
    senderId: string, 
    receiverId: string, 
    taskId: string, 
    taskTitle: string, 
    type: AgentProtocolMessage['messageType'], 
    content: string
  ) => {
    const sender = agents.find(a => a.id === senderId) || { id: senderId, name: 'Agent' };
    const receiver = agents.find(a => a.id === receiverId) || { id: receiverId, name: 'Agent' };
    const traceId = CollaborationGateway.generateTraceId();

    const pMsg: AgentProtocolMessage = {
      id: `pmsg_${Date.now()}`,
      senderAgentId: sender.id,
      senderAgentName: sender.name,
      receiverAgentId: receiver.id,
      receiverAgentName: receiver.name,
      taskId,
      messageType: type,
      priority: 'high',
      context: 'Multi-Agent Execution',
      instructions: taskTitle,
      expectedOutput: 'Output result',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      traceId,
      status: 'delivered',
      durationMs: 40
    };

    setAgentMessages(prev => [pMsg, ...prev]);

    const trace = CollaborationGateway.createTrace(pMsg);
    setCollaborationTraces(prev => [trace, ...prev]);
  };

  // Acceptance Test (Requirement 49)
  const runAcceptanceTestWorkflow = async () => {
    if (isEmergencyStopped || isAcceptanceRunning) return;
    setIsAcceptanceRunning(true);

    const traceId = CollaborationGateway.generateTraceId('tr_acc');
    const taskId = `task_acc_${Date.now().toString().slice(-4)}`;

    const manager = agents[0];
    const researcher = agents[1];
    const analyst = agents[2];
    const writer = agents[3];
    const reviewer = agents[4];

    // Step 1: Initialize Task
    const newTask: InterAgentTask = {
      id: taskId,
      title: 'Haftalik AI Yangiliklari Hisoboti va Telegram Guruhiga Yuborish',
      description: 'Foydalanuvchi so‘rovi: Har hafta AI yangiliklari bo‘yicha report tayyorla va Telegram guruhimga yubor.',
      senderId: manager.id,
      senderName: manager.name,
      receiverId: researcher.id,
      receiverName: researcher.name,
      context: 'OpenRouter bepul modellari va Mistral ma\'lumotlarini yig‘ish',
      requirements: ['Web Search', 'Taqqoslama tahlil', 'O‘zbekcha post', 'Inson tasdig‘i'],
      priority: 'high',
      status: 'IN_PROGRESS',
      traceId,
      logs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: manager.id,
          agentName: manager.name,
          action: 'TASK_PLANNED',
          detail: 'Vazifa rejalashtirildi va Atlas Researcher ga yo‘naltirildi.',
          traceId
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);

    // Step 2: Manager -> Researcher
    await new Promise(r => setTimeout(r, 900));
    dispatchProtocolMessage(manager.id, researcher.id, taskId, newTask.title, 'TASK', 'Topshiriq: So‘nggi AI modellari yangiliklarini qidiring.');

    // Step 3: Researcher -> Analyst
    await new Promise(r => setTimeout(r, 900));
    dispatchProtocolMessage(researcher.id, analyst.id, taskId, newTask.title, 'RESULT', 'Qidiruv natijalari: DeepSeek R1 va Mistral Large 2 yangiliklari topildi.');

    // Step 4: Analyst -> Writer
    await new Promise(r => setTimeout(r, 900));
    dispatchProtocolMessage(analyst.id, writer.id, taskId, newTask.title, 'RESULT', 'Statistik taqqoslash yakunlandi (+216% unumdorlik). O‘zbekcha post yozing.');

    // Step 5: Writer -> Reviewer -> Manager
    await new Promise(r => setTimeout(r, 900));
    dispatchProtocolMessage(writer.id, reviewer.id, taskId, newTask.title, 'REVIEW', 'Hisobot loyihasi tayyorlandi.');
    dispatchProtocolMessage(reviewer.id, manager.id, taskId, newTask.title, 'COMPLETION', 'Sifat tekshiruvi a\'lo. Inson tasdig‘iga yuborildi.');

    // Step 6: Create Approval Request
    const approvalId = `appr_${Date.now()}`;
    const newApproval: ApprovalRequest = {
      id: approvalId,
      type: 'Telegram Post',
      title: 'Haftalik AI Hisoboti (Telegram Guruhiga Yuborish)',
      description: 'Foydalanuvchi so‘rovi bo‘yicha tayyorlangan haftalik AI yangiliklari posti',
      requesterAgentId: writer.id,
      requesterAgentName: writer.name,
      destination: 'Nexus Enterprise Developers Group',
      payload: { taskId, content: '🚀 Haftalik AI Yangiliklari Hisoboti tayyorlandi.' },
      status: 'pending',
      createdAt: new Date().toLocaleTimeString(),
      traceId
    };
    setApprovals(prev => [newApproval, ...prev]);

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    setIsAcceptanceRunning(false);
  };

  // Run Team Workflow
  const runTeamWorkflow = (teamId: string, prompt: string) => {
    if (isEmergencyStopped) return;
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status: 'running' } : t));
    setTimeout(() => {
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status: 'idle' } : t));
    }, 2000);
  };

  // Chat send
  const sendChatMessage = async (content: string) => {
    if (!content.trim() || isEmergencyStopped) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s,
      messages: [...s.messages, userMsg],
      updatedAt: new Date().toLocaleTimeString()
    } : s));

    setIsGeneratingResponse(true);

    const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];
    const openRouterKey = settings.apiKeys.find(k => k.provider === 'openrouter')?.rawKey;
    const mistralKey = settings.apiKeys.find(k => k.provider === 'mistral')?.rawKey;
    const navyKey = settings.apiKeys.find(k => k.provider === 'navy')?.rawKey;

    try {
      const res = await ProviderService.generate({
        modelId: activeModelId,
        prompt: content,
        systemInstruction: activeAgent.systemPrompt,
        openRouterKey,
        mistralKey,
        navyKey
      });

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'agent',
        agentId: activeAgent.id,
        agentName: activeAgent.name,
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.model,
        tokensUsed: res.tokens.total
      };

      setChatSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        messages: [...s.messages, botMsg]
      } : s));
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const startNewChat = () => {
    const newSess: ChatSession = {
      id: `sess_${Date.now()}`,
      title: `Yangi Suhbat #${chatSessions.length + 1}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      projectId: activeProjectId || 'proj-core',
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'agent',
          agentId: activeAgentId,
          agentName: agents.find(a => a.id === activeAgentId)?.name || 'Nova PM',
          content: 'Yangi suhbat ochildi. Modellardan birini tanlab savol bering:',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: activeModelId
        }
      ]
    };
    setChatSessions(prev => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
  };

  // Telegram Helpers
  const connectTelegramBot = (name: string, token: string) => {
    if (!token.includes(':') || token.length < 20) {
      return { success: false, message: 'BotFather token formati noto‘g‘ri!' };
    }
    const newBot: TelegramBot = {
      id: `bot_${Date.now()}`,
      botName: name,
      username: `@${name.replace(/\s+/g, '')}Bot`,
      tokenMasked: `${token.slice(0, 6)}****:${token.slice(-6)}`,
      status: 'connected',
      webhookUrl: 'https://nexus-ai.corp/api/telegram/webhook',
      webhookStatus: 'active',
      connectedAt: 'Hozirgina',
      groupsCount: 0,
      channelsCount: 0
    };
    setTelegramBots(prev => [...prev, newBot]);
    return { success: true, message: 'Bot muvaffaqiyatli ulandi va webhook faollashtirildi!' };
  };

  const disconnectTelegramBot = (id: string) => {
    setTelegramBots(prev => prev.filter(b => b.id !== id));
  };

  const updateGroupMode = (id: string, mode: TelegramGroup['mode']) => {
    setTelegramGroups(prev => prev.map(g => g.id === id ? { ...g, mode } : g));
  };

  const updateGroupSettings = (id: string, updates: Partial<TelegramGroup>) => {
    setTelegramGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const createPostDraft = (draft: Partial<TelegramPostDraft>) => {
    const newDraft: TelegramPostDraft = {
      id: `draft_${Date.now()}`,
      channelId: draft.channelId || 'chan-daily-uz',
      channelTitle: draft.channelTitle || 'AI & Tech Daily Uzbekistan',
      agentId: activeAgentId,
      agentName: agents.find(a => a.id === activeAgentId)?.name || 'Nova PM',
      content: draft.content || '',
      mediaType: draft.mediaType || 'text',
      pollOptions: draft.pollOptions,
      status: 'pending_approval',
      createdAt: new Date().toLocaleTimeString()
    };
    setTelegramDrafts(prev => [newDraft, ...prev]);
  };

  const publishPostDraft = (draftId: string) => {
    setTelegramDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'published' } : d));
  };

  const resolveApproval = (approvalId: string, decision: 'approved' | 'rejected') => {
    setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: decision } : a));
  };

  // Agent CRUD
  const createAgent = (agent: Partial<Agent>) => {
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: agent.name || 'Yangi Agent',
      role: agent.role || 'Yordamchi Mutaxassis',
      avatar: agent.avatar || '🤖',
      systemPrompt: agent.systemPrompt || 'Siz aqlli yordamchisiz.',
      modelId: agent.modelId || activeModelId,
      temperature: agent.temperature || 0.3,
      maxTokens: agent.maxTokens || 4096,
      skills: agent.skills || [],
      tools: agent.tools || [],
      knowledgeBases: [],
      assignedProjects: [activeProjectId || 'proj-core'],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        tasksCompleted: 0,
        messagesHandled: 0,
        tokensConsumed: 0,
        costUSD: 0,
        avgLatencyMs: 40,
        successRatePct: 100
      }
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const createTeam = (team: Partial<AgentTeam>) => {
    const newTeam: AgentTeam = {
      id: `team_${Date.now()}`,
      name: team.name || 'Yangi Jamoa',
      description: team.description || '',
      workflowType: team.workflowType || 'hierarchical',
      status: 'idle',
      createdAt: new Date().toISOString(),
      members: team.members || []
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const createTask = (task: Partial<InterAgentTask>) => {
    const newTask: InterAgentTask = {
      id: `task_${Date.now()}`,
      title: task.title || 'Yangi Vazifa',
      description: task.description || '',
      senderId: task.senderId || activeAgentId,
      senderName: agents.find(a => a.id === task.senderId)?.name || 'Operator',
      receiverId: task.receiverId || 'agent-chief-pm',
      receiverName: agents.find(a => a.id === task.receiverId)?.name || 'Nova PM',
      context: task.context || '',
      requirements: task.requirements || [],
      priority: task.priority || 'medium',
      status: 'Pending',
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
  };

  const toggleTool = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, isEnabled: !t.isEnabled } : t));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeTelegramTab,
        setActiveTelegramTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isEmergencyStopped,
        emergencyStopReason,
        emergencyStopAll,
        resumeAllAgents,
        models,
        activeModelId,
        setActiveModelId,
        agents,
        activeAgentId,
        setActiveAgentId,
        createAgent,
        updateAgent,
        deleteAgent,
        teams,
        createTeam,
        runTeamWorkflow,
        runAcceptanceTestWorkflow,
        isAcceptanceRunning,
        tasks,
        createTask,
        agentMessages,
        collaborationTraces,
        dispatchProtocolMessage,
        skills,
        toggleSkill,
        tools,
        toggleTool,
        projects,
        activeProjectId,
        setActiveProjectId,
        chatSessions,
        activeSessionId,
        setActiveSessionId,
        startNewChat,
        sendChatMessage,
        isGeneratingResponse,
        telegramBots,
        telegramGroups,
        telegramChannels,
        telegramDrafts,
        telegramLogs,
        connectTelegramBot,
        disconnectTelegramBot,
        updateGroupMode,
        updateGroupSettings,
        createPostDraft,
        publishPostDraft,
        automations,
        approvals,
        resolveApproval,
        settings,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
