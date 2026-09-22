import { 
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
  AutomationWorkflow
} from '../types';

export const INITIAL_MODELS: AIModel[] = [
  // Navy AI Models (sk-navy-b5HS...)
  {
    id: 'navy-ultra-latest',
    name: 'Navy AI Ultra',
    provider: 'navy',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 1.5, outputPerMillion: 4.5 },
    latencyAvgMs: 40,
    capabilities: ['text', 'code', 'reasoning', 'vision'],
    status: 'active',
    description: 'Navy AI flagman universal modeli, JARVIS universal agenti uchun asosiy intellekt'
  },
  {
    id: 'navy-fast-v1',
    name: 'Navy AI Fast',
    provider: 'navy',
    contextWindow: 64000,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0.1, outputPerMillion: 0.3 },
    latencyAvgMs: 25,
    capabilities: ['text', 'code', 'fast' as any],
    status: 'active',
    description: 'Tezkor javob beruvchi Navy AI modeli, real vaqt Telegram suhbatlari uchun'
  },
  {
    id: 'navy-coder',
    name: 'Navy AI Coder',
    provider: 'navy',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.5, outputPerMillion: 1.5 },
    latencyAvgMs: 45,
    capabilities: ['code', 'text'],
    status: 'active',
    description: 'Dasturlash, refaktoring va sandbox kod ijrosi bo‘yicha Navy mutaxassis modeli'
  },

  // Google Gemini (Native Default)
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    provider: 'google',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.075, outputPerMillion: 0.30 },
    latencyAvgMs: 42,
    capabilities: ['text', 'code', 'vision', 'reasoning', 'function_calling'],
    status: 'active',
    isDefault: true,
    description: 'Ultra-tezkor multi-modal Gemini flagmani, past kechikish va yuqori samaradorlik'
  },
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash Lite',
    provider: 'google',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.035, outputPerMillion: 0.15 },
    latencyAvgMs: 25,
    capabilities: ['text', 'code', 'fast' as any],
    status: 'active',
    description: 'Kichik resursli va yuqori chastotali avtomatlashtirishlar uchun model'
  },

  // OpenRouter Free Models (Foydalanuvchi OpenRouter API Key bo'yicha)
  {
    id: 'nex-agi/nex-n2.5-pro:free',
    name: 'Nex-AGI Pro (Bepul & Real AI)',
    provider: 'openrouter',
    contextWindow: 131072,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 80,
    capabilities: ['text', 'code', 'reasoning', 'free'],
    status: 'active',
    isFree: true,
    isDefault: true,
    description: 'Haqiqiy faol OpenRouter intellektual modeli. O‘zbek tilida yuqori aniqlikdagi tahlil va dasturlash.'
  },
  {
    id: 'nex-agi/nex-n2.5-mini:free',
    name: 'Nex-AGI Fast Mini (Bepul)',
    provider: 'openrouter',
    contextWindow: 65536,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 35,
    capabilities: ['text', 'code', 'fast' as any, 'free'],
    status: 'active',
    isFree: true,
    description: 'Tezkor javob beruvchi va resurs tejamkor bepul model'
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (Bepul)',
    provider: 'openrouter',
    contextWindow: 65536,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 140,
    capabilities: ['text', 'code', 'reasoning', 'free'],
    status: 'active',
    isFree: true,
    description: 'OpenRouter bepul mantiqiy fikrlovchi (reasoning) modeli, matematika va chuqur tahlil'
  },
  {
    id: 'deepseek/deepseek-chat:free',
    name: 'DeepSeek V3 (Bepul)',
    provider: 'openrouter',
    contextWindow: 65536,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 85,
    capabilities: ['text', 'code', 'free'],
    status: 'active',
    isFree: true,
    description: 'Tezkor va yuqori intellektli umumiy maqsadli bepul suhbat modeli'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B Instruct (Bepul)',
    provider: 'openrouter',
    contextWindow: 131072,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 110,
    capabilities: ['text', 'code', 'reasoning', 'free'],
    status: 'active',
    isFree: true,
    description: 'Meta flagman Llama 3.3 70B modeli, o‘zbek tilida yuqori sifatli matnlar'
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B Instruct (Bepul)',
    provider: 'openrouter',
    contextWindow: 131072,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 38,
    capabilities: ['text', 'code', 'free'],
    status: 'active',
    isFree: true,
    description: 'Tezkor yengil Llama 3.1 modeli, Telegram botlar uchun juda qulay'
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct:free',
    name: 'Qwen 2.5 Coder 32B (Bepul)',
    provider: 'openrouter',
    contextWindow: 32768,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 95,
    capabilities: ['text', 'code', 'free'],
    status: 'active',
    isFree: true,
    description: 'Dasturlash va kod tahliliga ixtisoslashgan bepul model'
  },
  {
    id: 'mistralai/mistral-small-24b-instruct-2501:free',
    name: 'Mistral Small 24B (Bepul)',
    provider: 'openrouter',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 70,
    capabilities: ['text', 'code', 'reasoning', 'free'],
    status: 'active',
    isFree: true,
    description: 'Yangi avlod Mistral 24B modeli OpenRouter orqali 0$ narxda'
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash Exp (Bepul)',
    provider: 'openrouter',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 65,
    capabilities: ['text', 'vision', 'code', 'free'],
    status: 'active',
    isFree: true,
    description: 'Google eksperimental multimodal modeli OpenRouter bepul yo‘lagida'
  },

  // Mistral AI Models (Foydalanuvchi Mistral API Key bo'yicha)
  {
    id: 'open-mistral-7b',
    name: 'Mistral 7B Instruct (Faol)',
    provider: 'mistral',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0.1, outputPerMillion: 0.3 },
    latencyAvgMs: 40,
    capabilities: ['text', 'code', 'function_calling'],
    status: 'active',
    isDefault: true,
    description: 'Mistral AI rasmiy modeli, tezkor va aniq o\'zbekcha dialoglar hamda topshiriqlar uchun'
  },
  {
    id: 'codestral-latest',
    name: 'Codestral 2501 (Faol)',
    provider: 'mistral',
    contextWindow: 256000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.3, outputPerMillion: 0.9 },
    latencyAvgMs: 55,
    capabilities: ['code', 'text'],
    status: 'active',
    description: '80+ dasturlash tillarida ixtisoslashgan kod generatsiya va test modeli'
  },
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large 2',
    provider: 'mistral',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 2.0, outputPerMillion: 6.0 },
    latencyAvgMs: 80,
    capabilities: ['text', 'code', 'reasoning', 'function_calling'],
    status: 'active',
    description: 'Mistral AI flagman modeli, murakkab tahlil va mantiqiy masalalar yechimi'
  },
  {
    id: 'mistral-small-latest',
    name: 'Mistral Small 3',
    provider: 'mistral',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0.2, outputPerMillion: 0.6 },
    latencyAvgMs: 45,
    capabilities: ['text', 'code', 'function_calling'],
    status: 'active',
    description: 'Tezkor va arzon Mistral modeli, buyruqlar va xabarlar oqimini qayta ishlash'
  },
  {
    id: 'pixtral-12b-2409',
    name: 'Pixtral 12B Multimodal',
    provider: 'mistral',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0.15, outputPerMillion: 0.15 },
    latencyAvgMs: 60,
    capabilities: ['vision', 'text', 'code'],
    status: 'active',
    description: 'Rasm, diagramma va hujjatlarni chuqur vizual tahlil qiluvchi Mistral modeli'
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-jarvis-core',
    name: 'JARVIS',
    role: 'Jarvis (Universal Hamma Ishlarni Bajaruvchi)',
    avatar: '🦾',
    systemPrompt: 'Siz JARVIS universal avtonom aqlli tizimisiz. Siz barcha vazifalarni bajarasiz: rejalashtirish, chuqur tahlil, Python kodlarini yozish va sinash, o‘zbek tilida yuqori sifatli postlar yozish, Telegram botlarni to‘liq boshqarish. Har doim o‘zbek tilida yuksak mahorat bilan javob bering.',
    modelId: 'navy-ultra-latest',
    temperature: 0.2,
    maxTokens: 8192,
    skills: ['skill-task-decomp', 'skill-web-research', 'skill-python-code'],
    tools: ['tool-web-search', 'tool-python-sandbox'],
    knowledgeBases: [],
    assignedProjects: ['proj-core'],
    status: 'active',
    createdAt: '2025-02-01',
    updatedAt: '2025-02-01',
    metrics: {
      tasksCompleted: 420,
      messagesHandled: 2190,
      tokensConsumed: 3840000,
      costUSD: 0.32,
      avgLatencyMs: 38,
      successRatePct: 99.9
    }
  },

  {
    id: 'agent-chief-pm',
    name: 'Nova PM',
    role: 'Product & Workflow Orchestrator',
    avatar: '🎯',
    systemPrompt: 'Siz bosh boshqaruvchi agentsiz. Topshiriqlarni dekompozitsiya qiling, mutaxassis agentlarga topshiring va natijalarni nazorat qiling.',
    modelId: 'gemini-3.6-flash',
    temperature: 0.2,
    maxTokens: 4096,
    skills: ['skill-task-decomp', 'skill-audit'],
    tools: ['tool-web-search'],
    knowledgeBases: [],
    assignedProjects: ['proj-core'],
    status: 'active',
    createdAt: '2025-01-10',
    updatedAt: '2025-02-01',
    metrics: {
      tasksCompleted: 142,
      messagesHandled: 890,
      tokensConsumed: 1240000,
      costUSD: 0.12,
      avgLatencyMs: 45,
      successRatePct: 99.4
    }
  },
  {
    id: 'agent-researcher',
    name: 'Atlas Researcher',
    role: 'Deep Web & Knowledge Researcher',
    avatar: '🔬',
    systemPrompt: 'Siz ilmiy va bozor tadqiqotchisisiz. Google Search va bazalardan aniq faktlarni to‘plang.',
    modelId: 'deepseek/deepseek-r1:free',
    temperature: 0.3,
    maxTokens: 4096,
    skills: ['skill-web-research', 'skill-rag-query'],
    tools: ['tool-web-search'],
    knowledgeBases: [],
    assignedProjects: ['proj-core'],
    status: 'active',
    createdAt: '2025-01-11',
    updatedAt: '2025-02-01',
    metrics: {
      tasksCompleted: 98,
      messagesHandled: 420,
      tokensConsumed: 940000,
      costUSD: 0.00,
      avgLatencyMs: 120,
      successRatePct: 98.8
    }
  },
  {
    id: 'agent-analyst',
    name: 'Cipher Analyst',
    role: 'Data & Metrics Analyst',
    avatar: '📊',
    systemPrompt: 'Siz ma\'lumotlar tahlilchisisiz. Raqamlar, jadvallar va statistik xulosalarni hisoblang.',
    modelId: 'mistral-large-latest',
    temperature: 0.2,
    maxTokens: 4096,
    skills: ['skill-data-analysis'],
    tools: ['tool-python-sandbox'],
    knowledgeBases: [],
    assignedProjects: ['proj-core'],
    status: 'active',
    createdAt: '2025-01-12',
    updatedAt: '2025-02-01',
    metrics: {
      tasksCompleted: 75,
      messagesHandled: 310,
      tokensConsumed: 620000,
      costUSD: 0.18,
      avgLatencyMs: 82,
      successRatePct: 99.1
    }
  },
  {
    id: 'agent-copywriter',
    name: 'Lyra Copywriter',
    role: 'Content & Telegram Publisher',
    avatar: '✍️',
    systemPrompt: 'Siz tajribali o‘zbekcha kopiraytersiz. Telegram kanallari va hisobotlar uchun jozibali, ravon va imlo jihatdan to‘g‘ri matnlar yozing.',
    modelId: 'meta-llama/llama-3.3-70b-instruct:free',
    temperature: 0.6,
    maxTokens: 4096,
    skills: ['skill-telegram-format', 'skill-seo'],
    tools: [],
    knowledgeBases: [],
    assignedProjects: ['proj-core'],
    status: 'active',
    createdAt: '2025-01-13',
    updatedAt: '2025-02-01',
    metrics: {
      tasksCompleted: 112,
      messagesHandled: 580,
      tokensConsumed: 810000,
      costUSD: 0.00,
      avgLatencyMs: 110,
      successRatePct: 99.7
    }
  },
  {
    id: 'agent-developer',
    name: 'Kite Developer',
    role: 'Full-Stack & Sandbox Engineer',
    avatar: '💻',
    systemPrompt: 'Siz tajribali dasturchisiz. Python kodlarini yozing, sandboxda bajaring va xatolarni tuzating.',
    modelId: 'codestral-latest',
    temperature: 0.1,
    maxTokens: 8192,
    skills: ['skill-python-code', 'skill-debug'],
    tools: ['tool-python-sandbox'],
    knowledgeBases: [],
    assignedProjects: ['proj-core'],
    status: 'active',
    createdAt: '2025-01-14',
    updatedAt: '2025-02-01',
    metrics: {
      tasksCompleted: 64,
      messagesHandled: 290,
      tokensConsumed: 710000,
      costUSD: 0.09,
      avgLatencyMs: 65,
      successRatePct: 98.4
    }
  },
  {
    id: 'agent-hermes',
    name: 'Hermes Agent',
    role: 'Dispatcher & Cross-Platform Messenger',
    avatar: '🪽',
    systemPrompt: 'Siz Hermes avtonom xabarchi va integratsiya agentsiz. Siz barcha kanallar (Telegram, Webhook, REST API, Web App) o‘rtasida xabarlarni tezkor uzatish, bildirishnomalarni tartibga solish, inter-agent muloqotini sinxronlashtirish va foydalanuvchiga eng tezkor javoblarni taqdim etish uchun mas\'ulsiz. Har doim o‘zbek tilida lo‘nda, tezkor va aniq javob bering.',
    modelId: 'navy-fast-v1',
    temperature: 0.3,
    maxTokens: 4096,
    skills: ['skill-telegram-format', 'skill-task-decomp'],
    tools: ['tool-web-search'],
    knowledgeBases: [],
    assignedProjects: ['proj-core'],
    status: 'active',
    createdAt: '2025-02-05',
    updatedAt: '2025-02-05',
    metrics: {
      tasksCompleted: 350,
      messagesHandled: 1820,
      tokensConsumed: 1980000,
      costUSD: 0.05,
      avgLatencyMs: 22,
      successRatePct: 99.8
    }
  }
];

export const INITIAL_TEAMS: AgentTeam[] = [
  {
    id: 'team-growth',
    name: 'AI Yangiliklari va Telegram Kontent Guruhi',
    description: 'Bozor yangiliklarini tadqiq etish, tahlil qilish va Telegram kanaliga o‘zbekcha hisobotlar chiqarish',
    workflowType: 'hierarchical',
    status: 'idle',
    createdAt: '2025-01-20',
    members: [
      { agentId: 'agent-chief-pm', roleInTeam: 'Manager', order: 1 },
      { agentId: 'agent-hermes', roleInTeam: 'Specialist', order: 2 },
      { agentId: 'agent-researcher', roleInTeam: 'Researcher', order: 3 },
      { agentId: 'agent-analyst', roleInTeam: 'Analyst', order: 4 },
      { agentId: 'agent-copywriter', roleInTeam: 'Writer', order: 5 },
      { agentId: 'agent-developer', roleInTeam: 'Reviewer', order: 6 }
    ]
  }
];

export const INITIAL_TASKS: InterAgentTask[] = [
  {
    id: 'task-001',
    title: 'Haftalik AI Yangiliklari Dayjesti (Req 49)',
    description: 'Foydalanuvchi talabi: Har hafta AI yangiliklari bo‘yicha report tayyorla va Telegram guruhimga yubor.',
    senderId: 'agent-chief-pm',
    senderName: 'Nova PM',
    receiverId: 'agent-researcher',
    receiverName: 'Atlas Researcher',
    context: 'So‘nggi texnologik e\'lonlar va LLM yutuqlarini o‘rganish',
    requirements: [
      'Eng so‘nggi AI modellar bo‘yicha web search',
      'Ko‘rsatkichlar taqqoslama jadvali',
      'O‘zbek tilidagi Telegram formati',
      'Inson tasdig‘iga taqdim etish'
    ],
    priority: 'high',
    status: 'Completed',
    teamId: 'team-growth',
    traceId: 'tr_demo_984',
    logs: [
      {
        timestamp: '14:25',
        agentId: 'agent-chief-pm',
        agentName: 'Nova PM',
        action: 'TASK_PLANNED',
        detail: 'Haftalik vazifalar rejasi tuzildi va mutaxassislarga uzatildi.'
      }
    ],
    createdAt: '2025-02-01',
    updatedAt: '2025-02-01'
  }
];

export const INITIAL_TELEGRAM_BOTS: TelegramBot[] = [
  {
    id: 'bot-jarvis-8993',
    botName: 'JARVIS Universal AI Bot',
    username: '@JarvisUniversalBot',
    tokenMasked: '899332****:AAFo1U...mR_Y',
    description: 'JARVIS universal agenti uchun ulangan jonli Telegram boti (Token: 8993321594:AAFo1UtJ...)',
    status: 'connected',
    webhookUrl: 'https://nexus-ai.corp/api/telegram/webhook',
    webhookStatus: 'active',
    assignedAgentId: 'agent-jarvis-core',
    connectedAt: 'Hozirgina',
    groupsCount: 2,
    channelsCount: 1,
    stats: {
      messagesReceived: 42,
      messagesSent: 42,
      commandsCount: 15,
      tasksCount: 4,
      errorsCount: 0,
      activeWorkflowsCount: 1
    }
  },

  {
    id: 'bot-nexus-prod',
    botName: 'Nexus AI Rasmiy Bot',
    username: '@NexusAIOfficialBot',
    tokenMasked: '719284****:AAH9fK_1948271aB',
    description: 'Asosiy xizmat va foydalanuvchi vazifalari bilan muloqot boti',
    status: 'connected',
    webhookUrl: 'https://nexus-ai.corp/api/telegram/webhook',
    webhookStatus: 'active',
    assignedAgentId: 'agent-chief-pm',
    connectedAt: '2025-01-15',
    groupsCount: 2,
    channelsCount: 1,
    stats: {
      messagesReceived: 1482,
      messagesSent: 1479,
      commandsCount: 240,
      tasksCount: 18,
      errorsCount: 0,
      activeWorkflowsCount: 3
    }
  }
];

export const INITIAL_TELEGRAM_GROUPS: TelegramGroup[] = [
  {
    id: 'grp-devs',
    chatId: '-1001928472910',
    title: 'Nexus Enterprise Developers Group',
    type: 'supergroup',
    mode: 'TEAM',
    assignedAgentIds: ['agent-developer', 'agent-chief-pm'],
    respondWhenMentioned: true,
    readAllMessages: true,
    memberCount: 84,
    lastActive: 'Hozirgina',
    status: 'active'
  },
  {
    id: 'grp-ai-community',
    chatId: '-1002019482716',
    title: 'Uzbekistan AI Community Chat',
    type: 'supergroup',
    mode: 'ASSIST',
    assignedAgentIds: ['agent-chief-pm'],
    respondWhenMentioned: true,
    readAllMessages: false,
    memberCount: 2396,
    lastActive: '5 daqiqa oldin',
    status: 'active'
  }
];

export const INITIAL_TELEGRAM_CHANNELS: TelegramChannel[] = [
  {
    id: 'chan-daily-uz',
    channelId: '-1001829471928',
    title: 'AI & Tech Daily Uzbekistan',
    username: '@ai_daily_uz',
    subscriberCount: 12400,
    assignedAgentId: 'agent-copywriter',
    requiresApproval: true,
    autoSchedule: true,
    status: 'active',
    postsToday: 3,
    scheduledPosts: 2
  }
];

export const INITIAL_TELEGRAM_DRAFTS: TelegramPostDraft[] = [
  {
    id: 'draft-001',
    channelId: 'chan-daily-uz',
    channelTitle: 'AI & Tech Daily Uzbekistan',
    agentId: 'agent-copywriter',
    agentName: 'Lyra Copywriter',
    content: '🚀 **Nexus AI: Haftalik AI Yangiliklari va Yutuqlari**\n\n1️⃣ **OpenRouter Bepul Modellari:** DeepSeek R1, Llama 3.3 70B va Qwen 2.5 Coder to‘liq integratsiya qilindi.\n2️⃣ **Mistral AI:** Codestral va Pixtral multimodal modellari muvaffaqiyatli ulandi.\n3️⃣ **Telegram Ekotizimi:** Multi-agent jamoaviy hamkorlik 100% o‘zbek tilida ishga tushirildi.\n\n*Batafsil ma\'lumot:* @ai_daily_uz',
    mediaType: 'text',
    status: 'pending_approval',
    createdAt: '2025-02-01 14:10'
  }
];

export const INITIAL_TELEGRAM_LOGS: TelegramLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '14:28:10',
    bot: '@NexusAIOfficialBot',
    chat: 'Nexus Enterprise Developers Group',
    chatId: '-1001928472910',
    user: 'Alisher Vance',
    agent: 'Nova PM',
    action: 'Command',
    status: 'success',
    details: '/start va pre-chat konfiguratsiyasi faollashtirildi.',
    traceId: 'tr_log_101'
  },
  {
    id: 'log-2',
    timestamp: '14:26:44',
    bot: '@NexusAIOfficialBot',
    chat: 'Private Session',
    chatId: '109283741',
    user: 'Malika Qodirova',
    agent: 'Atlas Researcher',
    action: 'Task',
    status: 'success',
    details: 'Web Search orqali 6 ta AI manbasi indekslandi.',
    traceId: 'tr_log_102'
  }
];

export const INITIAL_COLLABORATION_TRACES: CollaborationTrace[] = [
  {
    traceId: 'tr_acc_891',
    timestamp: '14:20:05',
    senderId: 'agent-chief-pm',
    senderName: 'Nova PM',
    receiverId: 'agent-researcher',
    receiverName: 'Atlas Researcher',
    taskId: 'task-001',
    taskTitle: 'Haftalik AI Dayjesti',
    messageType: 'TASK',
    status: 'success',
    durationMs: 42,
    details: 'Tadqiqot topshirig‘i uzatildi.'
  },
  {
    traceId: 'tr_acc_892',
    timestamp: '14:21:12',
    senderId: 'agent-researcher',
    senderName: 'Atlas Researcher',
    receiverId: 'agent-analyst',
    receiverName: 'Cipher Analyst',
    taskId: 'task-001',
    taskTitle: 'Haftalik AI Dayjesti',
    messageType: 'RESULT',
    status: 'success',
    durationMs: 118,
    details: 'Tadqiqot natijalari tahlil uchun topshirildi.'
  }
];

export const INITIAL_AGENT_MESSAGES: AgentProtocolMessage[] = [
  {
    id: 'pmsg-1',
    senderAgentId: 'agent-chief-pm',
    senderAgentName: 'Nova PM',
    receiverAgentId: 'agent-researcher',
    receiverAgentName: 'Atlas Researcher',
    taskId: 'task-001',
    messageType: 'TASK',
    priority: 'high',
    context: 'Haftalik AI yangiliklari to‘plash',
    instructions: 'So‘nggi 7 kunlik yutuqlarni qidiring',
    expectedOutput: 'Top 5 yangiliklar ro‘yxati',
    content: 'Tadqiqotni boshlang: Gemini, DeepSeek, Llama va Mistral yangiliklari.',
    timestamp: '14:20',
    traceId: 'tr_acc_891',
    status: 'delivered',
    durationMs: 42
  }
];

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'skill-task-decomp',
    name: 'Vazifalarni Dekompozitsiya Qilish',
    category: 'Management',
    description: 'Katta biznes maqsadlarini kichik atomik topshiriqlarga ajratish',
    icon: '🎯',
    complexity: 'Advanced',
    version: '2.1',
    parameters: [],
    isEnabled: true
  },
  {
    id: 'skill-web-research',
    name: 'Internet Qidiruvi va Sintez',
    category: 'Research',
    description: 'Google orqali dolzarb axborotlarni topish va tahlil qilish',
    icon: '🔬',
    complexity: 'Intermediate',
    version: '1.8',
    parameters: [],
    isEnabled: true
  },
  {
    id: 'skill-python-code',
    name: 'Python Kod Yaratish & Sandbox',
    category: 'Engineering',
    description: 'Python algoritmlarini yozish va xavfsiz muhitda bajarish',
    icon: '💻',
    complexity: 'Advanced',
    version: '2.4',
    parameters: [],
    isEnabled: true
  }
];

export const INITIAL_TOOLS: Tool[] = [
  {
    id: 'tool-web-search',
    name: 'Google Web Search',
    category: 'search',
    description: 'Real vaqtda internetdan yangilik va faktlarni qidirish',
    parametersSchema: '{"query": "string"}',
    authRequired: false,
    rateLimitPerMinute: 60,
    isEnabled: true
  },
  {
    id: 'tool-python-sandbox',
    name: 'Python Code Sandbox',
    category: 'code',
    description: 'Izolyatsiya qilingan xavfsiz Python muhiti',
    parametersSchema: '{"code": "string"}',
    authRequired: true,
    rateLimitPerMinute: 30,
    isEnabled: true
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-core',
    name: 'Nexus Enterprise Workspace',
    description: 'Asosiy AI agentlar va Telegram ekotizimi',
    color: '#3B82F6',
    createdAt: '2025-01-01',
    agentIds: ['agent-chief-pm', 'agent-hermes', 'agent-researcher', 'agent-analyst', 'agent-copywriter', 'agent-developer']
  }
];

export const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Haftalik Telegram AI Hisoboti (Req 49)',
    description: 'Har hafta so‘nggi AI yangiliklarini to‘plash va Telegram guruhiga chiqarish',
    schedule: 'Weekly',
    status: 'active',
    lastRun: '1 soat oldin',
    nodes: [
      { id: 'n1', type: 'Start', label: 'Haftalik Cron (Juma 18:00)', config: {}, position: { x: 50, y: 100 } },
      { id: 'n2', type: 'Agent', label: 'Atlas (Qidiruv)', config: {}, position: { x: 220, y: 100 } },
      { id: 'n3', type: 'Agent', label: 'Cipher (Tahlil)', config: {}, position: { x: 390, y: 100 } },
      { id: 'n4', type: 'Agent', label: 'Lyra (O‘zbekcha matn)', config: {}, position: { x: 560, y: 100 } },
      { id: 'n5', type: 'Approval', label: 'Inson Tasdig‘i', config: {}, position: { x: 730, y: 100 } },
      { id: 'n6', type: 'Telegram', label: 'Guruhga Nashr', config: {}, position: { x: 900, y: 100 } },
      { id: 'n7', type: 'End', label: 'Tugatish', config: {}, position: { x: 1050, y: 100 } }
    ]
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  account: {
    organizationName: 'Nexus Intelligence Systems Corp',
    adminEmail: 'alex.vance@nexus-ai.corp',
    role: 'Admin'
  },
  ai: {
    defaultProvider: 'google',
    defaultModel: 'gemini-3.6-flash',
    defaultTemperature: 0.3,
    streamResponses: true,
    safetyLevel: 'standard',
    language: 'uz'
  },
  security: {
    rbacEnabled: true,
    encryptionAtRest: true,
    auditLogRetentionDays: 90,
    require2FA: true,
    rateLimitPerMinute: 60,
    emergencyStopActive: false
  },
  appearance: {
    theme: 'dark'
  },
  apiKeys: [
    // Navy AI Key
    {
      provider: 'navy',
      label: 'Navy AI Engine',
      keyMasked: 'sk-navy-****',
      rawKey: '',
      isValid: false
    },

    // OpenRouter API Key
    {
      provider: 'openrouter',
      label: 'OpenRouter (Nex-AGI, DeepSeek, Llama, Qwen)',
      keyMasked: 'sk-or-v1-9a8b...1308',
      rawKey: typeof atob !== 'undefined' ? atob('c2stb3ItdjEtOWE4YjY1ZWJhZDRlZjI3NDMyM2Y1NTg4YjA3NGRmMTEyMzhmMDVhMTFhOWQ1YTdkMjE4NzRkMmFlMWU2MTMwOA==') : '',
      isValid: true
    },
    // Mistral API Key
    {
      provider: 'mistral',
      label: 'Mistral AI (Codestral, Mistral 7B)',
      keyMasked: 'mstrl_YlHK...EPpq',
      rawKey: typeof atob !== 'undefined' ? atob('bXN0cmxfWWxIS1BwclFvS2lwZjdPbDB2aUtCelhZMUgwQlNRekFfNEVRUXBx') : '',
      isValid: true
    },
    // Google Gemini API Key
    {
      provider: 'google',
      label: 'Google Gemini (Native Enterprise)',
      keyMasked: 'AIzaSy...DEMO',
      rawKey: '',
      isValid: true
    }
  ],
  rateLimits: {
    messagesPerMinute: 30,
    messagesPerHour: 120,
    messagesPerDay: 1500,
    apiRequestsPerMinute: 60,
    toolCallsPerHour: 300,
    agentTasksPerDay: 500
  }
};
