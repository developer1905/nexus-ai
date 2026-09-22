export type NavigationTab = 
  | 'dashboard'
  | 'chat'
  | 'agents'
  | 'teams'
  | 'models'
  | 'skills'
  | 'tools'
  | 'projects'
  | 'tasks'
  | 'knowledge'
  | 'files'
  | 'automations'
  | 'telegram'
  | 'analytics'
  | 'settings';

export type TelegramSubSection = 
  | 'overview'
  | 'bots'
  | 'groups'
  | 'channels'
  | 'connections'
  | 'collaboration'
  | 'tasks'
  | 'automations'
  | 'logs'
  | 'permissions'
  | 'simulator';

export type AIProvider = 'google' | 'openai' | 'anthropic' | 'groq' | 'mistral' | 'openrouter' | 'navy' | 'custom';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: number;
  maxOutputTokens: number;
  pricing: {
    inputPerMillion: number;
    outputPerMillion: number;
  };
  latencyAvgMs: number;
  capabilities: ('text' | 'code' | 'vision' | 'reasoning' | 'function_calling' | 'free')[];
  status: 'active' | 'deprecated' | 'beta';
  isDefault?: boolean;
  isFree?: boolean;
  description?: string;
}

export type AgentStatus = 'active' | 'idle' | 'paused' | 'archived';

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  systemPrompt: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  skills: string[];
  tools: string[];
  knowledgeBases: string[];
  assignedProjects: string[];
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
  metrics: {
    tasksCompleted: number;
    messagesHandled: number;
    tokensConsumed: number;
    costUSD: number;
    avgLatencyMs: number;
    successRatePct: number;
  };
}

export type TeamRoleType = 'Jarvis' | 'Manager' | 'Researcher' | 'Analyst' | 'Writer' | 'Developer' | 'Reviewer' | 'Publisher' | 'Specialist' | 'leader' | 'contributor' | 'executor' | 'reviewer' | string;

export interface TeamMember {
  agentId: string;
  roleInTeam: TeamRoleType;
  order: number;
}

export interface AgentTeam {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  workflowType: 'sequential' | 'hierarchical' | 'collaborative' | 'consensus';
  status: 'idle' | 'running' | 'paused';
  activeTaskId?: string;
  createdAt: string;
}

export type TaskStatus = 'Pending' | 'PLANNING' | 'In Progress' | 'IN_PROGRESS' | 'Review' | 'Completed' | 'COMPLETED' | 'Failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskLogEntry {
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  detail: string;
  traceId?: string;
}

export interface InterAgentTask {
  id: string;
  title: string;
  description: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  context: string;
  requirements: string[];
  priority: TaskPriority;
  deadline?: string;
  status: TaskStatus;
  teamId?: string;
  traceId?: string;
  logs: TaskLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export type AgentMessageType = 
  | 'TASK' 
  | 'QUESTION' 
  | 'RESULT' 
  | 'STATUS' 
  | 'ERROR' 
  | 'REVIEW' 
  | 'APPROVAL_REQUEST' 
  | 'COMPLETION';

export interface AgentProtocolMessage {
  id: string;
  senderAgentId: string;
  senderAgentName: string;
  receiverAgentId: string;
  receiverAgentName: string;
  taskId: string;
  messageType: AgentMessageType;
  priority: TaskPriority;
  context: string;
  instructions: string;
  expectedOutput: string;
  content: string;
  timestamp: string;
  traceId: string;
  status: 'sent' | 'processing' | 'delivered' | 'failed';
  durationMs?: number;
}

export interface CollaborationTrace {
  traceId: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  taskId: string;
  taskTitle: string;
  messageType: AgentMessageType;
  status: 'success' | 'running' | 'failed' | 'waiting_approval';
  durationMs: number;
  details: string;
}

export interface TelegramBotStats {
  messagesReceived: number;
  messagesSent: number;
  commandsCount: number;
  tasksCount: number;
  errorsCount: number;
  activeWorkflowsCount: number;
}

export interface TelegramBot {
  id: string;
  botName: string;
  username: string;
  tokenMasked: string;
  description?: string;
  status: 'connected' | 'disconnected' | 'error';
  webhookUrl: string;
  webhookStatus: 'active' | 'pending' | 'failed';
  assignedAgentId?: string;
  connectedAt: string;
  groupsCount?: number;
  channelsCount?: number;
  stats?: TelegramBotStats;
}

export type TelegramGroupMode = 'Listen' | 'Assist' | 'Task' | 'Scheduled' | 'Team' | 'LISTEN' | 'ASSIST' | 'TASK' | 'SCHEDULED' | 'TEAM';

export interface TelegramGroup {
  id: string;
  chatId: string;
  title: string;
  type: 'group' | 'supergroup';
  botId?: string;
  botName?: string;
  mode: TelegramGroupMode;
  assignedAgentIds: string[];
  respondWhenMentioned: boolean;
  readAllMessages: boolean;
  memberCount: number;
  lastActive: string;
  status: 'active' | 'paused';
}

export interface TelegramChannel {
  id: string;
  channelId: string;
  title: string;
  username: string;
  botId?: string;
  botName?: string;
  subscriberCount: number;
  assignedAgentId: string;
  requiresApproval: boolean;
  autoSchedule: boolean;
  status: 'active' | 'draft_only';
  postsToday?: number;
  scheduledPosts?: number;
}

export interface TelegramPostDraft {
  id: string;
  channelId: string;
  channelTitle: string;
  agentId: string;
  agentName: string;
  content: string;
  mediaType?: 'text' | 'photo' | 'poll' | 'document';
  pollOptions?: string[];
  status: 'draft' | 'pending_approval' | 'scheduled' | 'published' | 'rejected';
  scheduledFor?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface TelegramLogEntry {
  id: string;
  timestamp: string;
  bot: string;
  chat: string;
  chatId?: string;
  user: string;
  agent: string;
  action: 'Incoming message' | 'Outgoing message' | 'Command' | 'Task' | 'Automation' | 'Error' | 'Approval' | 'Bot event';
  status: 'success' | 'failed' | 'pending';
  details: string;
  traceId?: string;
}

export interface RateLimitsConfig {
  messagesPerMinute: number;
  messagesPerHour: number;
  messagesPerDay: number;
  apiRequestsPerMinute: number;
  toolCallsPerHour: number;
  agentTasksPerDay: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  version: string;
  parameters: { name: string; type: string; description: string; required: boolean }[];
  isEnabled: boolean;
}

export interface Tool {
  id: string;
  name: string;
  category: 'search' | 'code' | 'api' | 'data' | 'system';
  description: string;
  parametersSchema: string;
  authRequired: boolean;
  rateLimitPerMinute: number;
  isEnabled: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  agentIds: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
  modelUsed?: string;
  tokensUsed?: number;
  reasoningSteps?: string[];
  toolCalls?: { name: string; input: any; output: any }[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  messages: ChatMessage[];
}

export interface ApprovalRequest {
  id: string;
  type: string;
  title: string;
  description: string;
  requesterAgentId: string;
  requesterAgentName: string;
  destination?: string;
  payload: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  traceId?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  type: string;
  source: string;
  chunksCount: number;
  tokenCount: number;
  createdAt: string;
  status: 'ready' | 'processing';
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'ready' | 'analyzing' | 'error';
  summary?: string;
}

export type WorkflowNodeType = 
  | 'Start' | 'Agent' | 'Model' | 'Search' | 'File' | 'Condition' 
  | 'Delay' | 'Approval' | 'Telegram' | 'Webhook' | 'Database' | 'End';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  schedule: 'Manual' | 'Hourly' | 'Daily' | 'Weekly' | 'Webhook';
  nodes: WorkflowNode[];
  status: 'active' | 'paused';
  lastRun?: string;
}

export interface AppSettings {
  account: {
    organizationName: string;
    adminEmail: string;
    role: string;
  };
  ai: {
    defaultProvider: AIProvider;
    defaultModel: string;
    defaultTemperature: number;
    streamResponses: boolean;
    safetyLevel: 'high' | 'standard' | 'minimal';
    language: 'uz' | 'en' | 'ru';
  };
  security: {
    rbacEnabled: boolean;
    encryptionAtRest: boolean;
    auditLogRetentionDays: number;
    require2FA: boolean;
    rateLimitPerMinute: number;
    emergencyStopActive?: boolean;
  };
  appearance: {
    theme: 'dark' | 'light';
  };
  apiKeys: {
    provider: AIProvider;
    keyMasked: string;
    rawKey?: string;
    isValid: boolean;
    label?: string;
  }[];
  rateLimits?: RateLimitsConfig;
}

export interface DashboardStats {
  totalMessages: number;
  activeAgents: number;
  tasksCompleted: number;
  automationsRun: number;
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  estimatedCostUSD: number;
  recentActivity: {
    id: string;
    action: string;
    target: string;
    userOrAgent: string;
    timestamp: string;
    type: string;
  }[];
}
