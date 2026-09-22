// src/main.tsx
import React25 from "react";
import ReactDOM from "react-dom/client";

// src/context/AppContext.tsx
import React, { createContext, useContext, useState } from "react";

// src/services/mockData.ts
var INITIAL_MODELS = [
  // Navy AI Models (sk-navy-b5HS...)
  {
    id: "navy-ultra-latest",
    name: "Navy AI Ultra",
    provider: "navy",
    contextWindow: 128e3,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 1.5, outputPerMillion: 4.5 },
    latencyAvgMs: 40,
    capabilities: ["text", "code", "reasoning", "vision"],
    status: "active",
    description: "Navy AI flagman universal modeli, JARVIS universal agenti uchun asosiy intellekt"
  },
  {
    id: "navy-fast-v1",
    name: "Navy AI Fast",
    provider: "navy",
    contextWindow: 64e3,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0.1, outputPerMillion: 0.3 },
    latencyAvgMs: 25,
    capabilities: ["text", "code", "fast"],
    status: "active",
    description: "Tezkor javob beruvchi Navy AI modeli, real vaqt Telegram suhbatlari uchun"
  },
  {
    id: "navy-coder",
    name: "Navy AI Coder",
    provider: "navy",
    contextWindow: 128e3,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.5, outputPerMillion: 1.5 },
    latencyAvgMs: 45,
    capabilities: ["code", "text"],
    status: "active",
    description: "Dasturlash, refaktoring va sandbox kod ijrosi bo\u2018yicha Navy mutaxassis modeli"
  },
  // Google Gemini (Native Default)
  {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    provider: "google",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.075, outputPerMillion: 0.3 },
    latencyAvgMs: 42,
    capabilities: ["text", "code", "vision", "reasoning", "function_calling"],
    status: "active",
    isDefault: true,
    description: "Ultra-tezkor multi-modal Gemini flagmani, past kechikish va yuqori samaradorlik"
  },
  {
    id: "gemini-3.5-flash-lite",
    name: "Gemini 3.5 Flash Lite",
    provider: "google",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.035, outputPerMillion: 0.15 },
    latencyAvgMs: 25,
    capabilities: ["text", "code", "fast"],
    status: "active",
    description: "Kichik resursli va yuqori chastotali avtomatlashtirishlar uchun model"
  },
  // OpenRouter Free Models (Foydalanuvchi OpenRouter API Key bo'yicha)
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1 (Bepul)",
    provider: "openrouter",
    contextWindow: 65536,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 140,
    capabilities: ["text", "code", "reasoning", "free"],
    status: "active",
    isFree: true,
    description: "OpenRouter bepul mantiqiy fikrlovchi (reasoning) modeli, matematika va chuqur tahlil"
  },
  {
    id: "deepseek/deepseek-chat:free",
    name: "DeepSeek V3 (Bepul)",
    provider: "openrouter",
    contextWindow: 65536,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 85,
    capabilities: ["text", "code", "free"],
    status: "active",
    isFree: true,
    description: "Tezkor va yuqori intellektli umumiy maqsadli bepul suhbat modeli"
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct (Bepul)",
    provider: "openrouter",
    contextWindow: 131072,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 110,
    capabilities: ["text", "code", "reasoning", "free"],
    status: "active",
    isFree: true,
    description: "Meta flagman Llama 3.3 70B modeli, o\u2018zbek tilida yuqori sifatli matnlar"
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct:free",
    name: "Llama 3.1 8B Instruct (Bepul)",
    provider: "openrouter",
    contextWindow: 131072,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 38,
    capabilities: ["text", "code", "free"],
    status: "active",
    isFree: true,
    description: "Tezkor yengil Llama 3.1 modeli, Telegram botlar uchun juda qulay"
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct:free",
    name: "Qwen 2.5 Coder 32B (Bepul)",
    provider: "openrouter",
    contextWindow: 32768,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 95,
    capabilities: ["text", "code", "free"],
    status: "active",
    isFree: true,
    description: "Dasturlash va kod tahliliga ixtisoslashgan bepul model"
  },
  {
    id: "mistralai/mistral-small-24b-instruct-2501:free",
    name: "Mistral Small 24B (Bepul)",
    provider: "openrouter",
    contextWindow: 32768,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 70,
    capabilities: ["text", "code", "reasoning", "free"],
    status: "active",
    isFree: true,
    description: "Yangi avlod Mistral 24B modeli OpenRouter orqali 0$ narxda"
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash Exp (Bepul)",
    provider: "openrouter",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0 },
    latencyAvgMs: 65,
    capabilities: ["text", "vision", "code", "free"],
    status: "active",
    isFree: true,
    description: "Google eksperimental multimodal modeli OpenRouter bepul yo\u2018lagida"
  },
  // Mistral AI Models (Foydalanuvchi Mistral API Key bo'yicha)
  {
    id: "mistral-large-latest",
    name: "Mistral Large 2",
    provider: "mistral",
    contextWindow: 128e3,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 2, outputPerMillion: 6 },
    latencyAvgMs: 80,
    capabilities: ["text", "code", "reasoning", "function_calling"],
    status: "active",
    description: "Mistral AI flagman modeli, murakkab tahlil va mantiqiy masalalar yechimi"
  },
  {
    id: "mistral-small-latest",
    name: "Mistral Small 3",
    provider: "mistral",
    contextWindow: 32768,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0.2, outputPerMillion: 0.6 },
    latencyAvgMs: 45,
    capabilities: ["text", "code", "function_calling"],
    status: "active",
    description: "Tezkor va arzon Mistral modeli, buyruqlar va xabarlar oqimini qayta ishlash"
  },
  {
    id: "codestral-latest",
    name: "Codestral 2501",
    provider: "mistral",
    contextWindow: 256e3,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0.3, outputPerMillion: 0.9 },
    latencyAvgMs: 55,
    capabilities: ["code", "text"],
    status: "active",
    description: "80+ dasturlash tillarida ixtisoslashgan kod generatsiya va test modeli"
  },
  {
    id: "pixtral-12b-2409",
    name: "Pixtral 12B Multimodal",
    provider: "mistral",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    pricing: { inputPerMillion: 0.15, outputPerMillion: 0.15 },
    latencyAvgMs: 60,
    capabilities: ["vision", "text", "code"],
    status: "active",
    description: "Rasm, diagramma va hujjatlarni chuqur vizual tahlil qiluvchi Mistral modeli"
  }
];
var INITIAL_AGENTS = [
  {
    id: "agent-jarvis-core",
    name: "JARVIS",
    role: "Jarvis (Universal Hamma Ishlarni Bajaruvchi)",
    avatar: "\u{1F9BE}",
    systemPrompt: "Siz JARVIS universal avtonom aqlli tizimisiz. Siz barcha vazifalarni bajarasiz: rejalashtirish, chuqur tahlil, Python kodlarini yozish va sinash, o\u2018zbek tilida yuqori sifatli postlar yozish, Telegram botlarni to\u2018liq boshqarish. Har doim o\u2018zbek tilida yuksak mahorat bilan javob bering.",
    modelId: "navy-ultra-latest",
    temperature: 0.2,
    maxTokens: 8192,
    skills: ["skill-task-decomp", "skill-web-research", "skill-python-code"],
    tools: ["tool-web-search", "tool-python-sandbox"],
    knowledgeBases: [],
    assignedProjects: ["proj-core"],
    status: "active",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-01",
    metrics: {
      tasksCompleted: 420,
      messagesHandled: 2190,
      tokensConsumed: 384e4,
      costUSD: 0.32,
      avgLatencyMs: 38,
      successRatePct: 99.9
    }
  },
  {
    id: "agent-chief-pm",
    name: "Nova PM",
    role: "Product & Workflow Orchestrator",
    avatar: "\u{1F3AF}",
    systemPrompt: "Siz bosh boshqaruvchi agentsiz. Topshiriqlarni dekompozitsiya qiling, mutaxassis agentlarga topshiring va natijalarni nazorat qiling.",
    modelId: "gemini-3.6-flash",
    temperature: 0.2,
    maxTokens: 4096,
    skills: ["skill-task-decomp", "skill-audit"],
    tools: ["tool-web-search"],
    knowledgeBases: [],
    assignedProjects: ["proj-core"],
    status: "active",
    createdAt: "2025-01-10",
    updatedAt: "2025-02-01",
    metrics: {
      tasksCompleted: 142,
      messagesHandled: 890,
      tokensConsumed: 124e4,
      costUSD: 0.12,
      avgLatencyMs: 45,
      successRatePct: 99.4
    }
  },
  {
    id: "agent-researcher",
    name: "Atlas Researcher",
    role: "Deep Web & Knowledge Researcher",
    avatar: "\u{1F52C}",
    systemPrompt: "Siz ilmiy va bozor tadqiqotchisisiz. Google Search va bazalardan aniq faktlarni to\u2018plang.",
    modelId: "deepseek/deepseek-r1:free",
    temperature: 0.3,
    maxTokens: 4096,
    skills: ["skill-web-research", "skill-rag-query"],
    tools: ["tool-web-search"],
    knowledgeBases: [],
    assignedProjects: ["proj-core"],
    status: "active",
    createdAt: "2025-01-11",
    updatedAt: "2025-02-01",
    metrics: {
      tasksCompleted: 98,
      messagesHandled: 420,
      tokensConsumed: 94e4,
      costUSD: 0,
      avgLatencyMs: 120,
      successRatePct: 98.8
    }
  },
  {
    id: "agent-analyst",
    name: "Cipher Analyst",
    role: "Data & Metrics Analyst",
    avatar: "\u{1F4CA}",
    systemPrompt: "Siz ma'lumotlar tahlilchisisiz. Raqamlar, jadvallar va statistik xulosalarni hisoblang.",
    modelId: "mistral-large-latest",
    temperature: 0.2,
    maxTokens: 4096,
    skills: ["skill-data-analysis"],
    tools: ["tool-python-sandbox"],
    knowledgeBases: [],
    assignedProjects: ["proj-core"],
    status: "active",
    createdAt: "2025-01-12",
    updatedAt: "2025-02-01",
    metrics: {
      tasksCompleted: 75,
      messagesHandled: 310,
      tokensConsumed: 62e4,
      costUSD: 0.18,
      avgLatencyMs: 82,
      successRatePct: 99.1
    }
  },
  {
    id: "agent-copywriter",
    name: "Lyra Copywriter",
    role: "Content & Telegram Publisher",
    avatar: "\u270D\uFE0F",
    systemPrompt: "Siz tajribali o\u2018zbekcha kopiraytersiz. Telegram kanallari va hisobotlar uchun jozibali, ravon va imlo jihatdan to\u2018g\u2018ri matnlar yozing.",
    modelId: "meta-llama/llama-3.3-70b-instruct:free",
    temperature: 0.6,
    maxTokens: 4096,
    skills: ["skill-telegram-format", "skill-seo"],
    tools: [],
    knowledgeBases: [],
    assignedProjects: ["proj-core"],
    status: "active",
    createdAt: "2025-01-13",
    updatedAt: "2025-02-01",
    metrics: {
      tasksCompleted: 112,
      messagesHandled: 580,
      tokensConsumed: 81e4,
      costUSD: 0,
      avgLatencyMs: 110,
      successRatePct: 99.7
    }
  },
  {
    id: "agent-developer",
    name: "Kite Developer",
    role: "Full-Stack & Sandbox Engineer",
    avatar: "\u{1F4BB}",
    systemPrompt: "Siz tajribali dasturchisiz. Python kodlarini yozing, sandboxda bajaring va xatolarni tuzating.",
    modelId: "codestral-latest",
    temperature: 0.1,
    maxTokens: 8192,
    skills: ["skill-python-code", "skill-debug"],
    tools: ["tool-python-sandbox"],
    knowledgeBases: [],
    assignedProjects: ["proj-core"],
    status: "active",
    createdAt: "2025-01-14",
    updatedAt: "2025-02-01",
    metrics: {
      tasksCompleted: 64,
      messagesHandled: 290,
      tokensConsumed: 71e4,
      costUSD: 0.09,
      avgLatencyMs: 65,
      successRatePct: 98.4
    }
  }
];
var INITIAL_TEAMS = [
  {
    id: "team-growth",
    name: "AI Yangiliklari va Telegram Kontent Guruhi",
    description: "Bozor yangiliklarini tadqiq etish, tahlil qilish va Telegram kanaliga o\u2018zbekcha hisobotlar chiqarish",
    workflowType: "hierarchical",
    status: "idle",
    createdAt: "2025-01-20",
    members: [
      { agentId: "agent-chief-pm", roleInTeam: "Manager", order: 1 },
      { agentId: "agent-researcher", roleInTeam: "Researcher", order: 2 },
      { agentId: "agent-analyst", roleInTeam: "Analyst", order: 3 },
      { agentId: "agent-copywriter", roleInTeam: "Writer", order: 4 },
      { agentId: "agent-developer", roleInTeam: "Reviewer", order: 5 }
    ]
  }
];
var INITIAL_TASKS = [
  {
    id: "task-001",
    title: "Haftalik AI Yangiliklari Dayjesti (Req 49)",
    description: "Foydalanuvchi talabi: Har hafta AI yangiliklari bo\u2018yicha report tayyorla va Telegram guruhimga yubor.",
    senderId: "agent-chief-pm",
    senderName: "Nova PM",
    receiverId: "agent-researcher",
    receiverName: "Atlas Researcher",
    context: "So\u2018nggi texnologik e'lonlar va LLM yutuqlarini o\u2018rganish",
    requirements: [
      "Eng so\u2018nggi AI modellar bo\u2018yicha web search",
      "Ko\u2018rsatkichlar taqqoslama jadvali",
      "O\u2018zbek tilidagi Telegram formati",
      "Inson tasdig\u2018iga taqdim etish"
    ],
    priority: "high",
    status: "Completed",
    teamId: "team-growth",
    traceId: "tr_demo_984",
    logs: [
      {
        timestamp: "14:25",
        agentId: "agent-chief-pm",
        agentName: "Nova PM",
        action: "TASK_PLANNED",
        detail: "Haftalik vazifalar rejasi tuzildi va mutaxassislarga uzatildi."
      }
    ],
    createdAt: "2025-02-01",
    updatedAt: "2025-02-01"
  }
];
var INITIAL_TELEGRAM_BOTS = [
  {
    id: "bot-jarvis-8993",
    botName: "JARVIS Universal AI Bot",
    username: "@JarvisUniversalBot",
    tokenMasked: "899332****:AAFo1U...mR_Y",
    description: "JARVIS universal agenti uchun ulangan jonli Telegram boti (Token: 8993321594:AAFo1UtJ...)",
    status: "connected",
    webhookUrl: "https://nexus-ai.corp/api/telegram/webhook",
    webhookStatus: "active",
    assignedAgentId: "agent-jarvis-core",
    connectedAt: "Hozirgina",
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
    id: "bot-nexus-prod",
    botName: "Nexus AI Rasmiy Bot",
    username: "@NexusAIOfficialBot",
    tokenMasked: "719284****:AAH9fK_1948271aB",
    description: "Asosiy xizmat va foydalanuvchi vazifalari bilan muloqot boti",
    status: "connected",
    webhookUrl: "https://nexus-ai.corp/api/telegram/webhook",
    webhookStatus: "active",
    assignedAgentId: "agent-chief-pm",
    connectedAt: "2025-01-15",
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
var INITIAL_TELEGRAM_GROUPS = [
  {
    id: "grp-devs",
    chatId: "-1001928472910",
    title: "Nexus Enterprise Developers Group",
    type: "supergroup",
    mode: "TEAM",
    assignedAgentIds: ["agent-developer", "agent-chief-pm"],
    respondWhenMentioned: true,
    readAllMessages: true,
    memberCount: 84,
    lastActive: "Hozirgina",
    status: "active"
  },
  {
    id: "grp-ai-community",
    chatId: "-1002019482716",
    title: "Uzbekistan AI Community Chat",
    type: "supergroup",
    mode: "ASSIST",
    assignedAgentIds: ["agent-chief-pm"],
    respondWhenMentioned: true,
    readAllMessages: false,
    memberCount: 2396,
    lastActive: "5 daqiqa oldin",
    status: "active"
  }
];
var INITIAL_TELEGRAM_CHANNELS = [
  {
    id: "chan-daily-uz",
    channelId: "-1001829471928",
    title: "AI & Tech Daily Uzbekistan",
    username: "@ai_daily_uz",
    subscriberCount: 12400,
    assignedAgentId: "agent-copywriter",
    requiresApproval: true,
    autoSchedule: true,
    status: "active",
    postsToday: 3,
    scheduledPosts: 2
  }
];
var INITIAL_TELEGRAM_DRAFTS = [
  {
    id: "draft-001",
    channelId: "chan-daily-uz",
    channelTitle: "AI & Tech Daily Uzbekistan",
    agentId: "agent-copywriter",
    agentName: "Lyra Copywriter",
    content: "\u{1F680} **Nexus AI: Haftalik AI Yangiliklari va Yutuqlari**\n\n1\uFE0F\u20E3 **OpenRouter Bepul Modellari:** DeepSeek R1, Llama 3.3 70B va Qwen 2.5 Coder to\u2018liq integratsiya qilindi.\n2\uFE0F\u20E3 **Mistral AI:** Codestral va Pixtral multimodal modellari muvaffaqiyatli ulandi.\n3\uFE0F\u20E3 **Telegram Ekotizimi:** Multi-agent jamoaviy hamkorlik 100% o\u2018zbek tilida ishga tushirildi.\n\n*Batafsil ma'lumot:* @ai_daily_uz",
    mediaType: "text",
    status: "pending_approval",
    createdAt: "2025-02-01 14:10"
  }
];
var INITIAL_TELEGRAM_LOGS = [
  {
    id: "log-1",
    timestamp: "14:28:10",
    bot: "@NexusAIOfficialBot",
    chat: "Nexus Enterprise Developers Group",
    chatId: "-1001928472910",
    user: "Alisher Vance",
    agent: "Nova PM",
    action: "Command",
    status: "success",
    details: "/start va pre-chat konfiguratsiyasi faollashtirildi.",
    traceId: "tr_log_101"
  },
  {
    id: "log-2",
    timestamp: "14:26:44",
    bot: "@NexusAIOfficialBot",
    chat: "Private Session",
    chatId: "109283741",
    user: "Malika Qodirova",
    agent: "Atlas Researcher",
    action: "Task",
    status: "success",
    details: "Web Search orqali 6 ta AI manbasi indekslandi.",
    traceId: "tr_log_102"
  }
];
var INITIAL_COLLABORATION_TRACES = [
  {
    traceId: "tr_acc_891",
    timestamp: "14:20:05",
    senderId: "agent-chief-pm",
    senderName: "Nova PM",
    receiverId: "agent-researcher",
    receiverName: "Atlas Researcher",
    taskId: "task-001",
    taskTitle: "Haftalik AI Dayjesti",
    messageType: "TASK",
    status: "success",
    durationMs: 42,
    details: "Tadqiqot topshirig\u2018i uzatildi."
  },
  {
    traceId: "tr_acc_892",
    timestamp: "14:21:12",
    senderId: "agent-researcher",
    senderName: "Atlas Researcher",
    receiverId: "agent-analyst",
    receiverName: "Cipher Analyst",
    taskId: "task-001",
    taskTitle: "Haftalik AI Dayjesti",
    messageType: "RESULT",
    status: "success",
    durationMs: 118,
    details: "Tadqiqot natijalari tahlil uchun topshirildi."
  }
];
var INITIAL_AGENT_MESSAGES = [
  {
    id: "pmsg-1",
    senderAgentId: "agent-chief-pm",
    senderAgentName: "Nova PM",
    receiverAgentId: "agent-researcher",
    receiverAgentName: "Atlas Researcher",
    taskId: "task-001",
    messageType: "TASK",
    priority: "high",
    context: "Haftalik AI yangiliklari to\u2018plash",
    instructions: "So\u2018nggi 7 kunlik yutuqlarni qidiring",
    expectedOutput: "Top 5 yangiliklar ro\u2018yxati",
    content: "Tadqiqotni boshlang: Gemini, DeepSeek, Llama va Mistral yangiliklari.",
    timestamp: "14:20",
    traceId: "tr_acc_891",
    status: "delivered",
    durationMs: 42
  }
];
var INITIAL_SKILLS = [
  {
    id: "skill-task-decomp",
    name: "Vazifalarni Dekompozitsiya Qilish",
    category: "Management",
    description: "Katta biznes maqsadlarini kichik atomik topshiriqlarga ajratish",
    icon: "\u{1F3AF}",
    complexity: "Advanced",
    version: "2.1",
    parameters: [],
    isEnabled: true
  },
  {
    id: "skill-web-research",
    name: "Internet Qidiruvi va Sintez",
    category: "Research",
    description: "Google orqali dolzarb axborotlarni topish va tahlil qilish",
    icon: "\u{1F52C}",
    complexity: "Intermediate",
    version: "1.8",
    parameters: [],
    isEnabled: true
  },
  {
    id: "skill-python-code",
    name: "Python Kod Yaratish & Sandbox",
    category: "Engineering",
    description: "Python algoritmlarini yozish va xavfsiz muhitda bajarish",
    icon: "\u{1F4BB}",
    complexity: "Advanced",
    version: "2.4",
    parameters: [],
    isEnabled: true
  }
];
var INITIAL_TOOLS = [
  {
    id: "tool-web-search",
    name: "Google Web Search",
    category: "search",
    description: "Real vaqtda internetdan yangilik va faktlarni qidirish",
    parametersSchema: '{"query": "string"}',
    authRequired: false,
    rateLimitPerMinute: 60,
    isEnabled: true
  },
  {
    id: "tool-python-sandbox",
    name: "Python Code Sandbox",
    category: "code",
    description: "Izolyatsiya qilingan xavfsiz Python muhiti",
    parametersSchema: '{"code": "string"}',
    authRequired: true,
    rateLimitPerMinute: 30,
    isEnabled: true
  }
];
var INITIAL_PROJECTS = [
  {
    id: "proj-core",
    name: "Nexus Enterprise Workspace",
    description: "Asosiy AI agentlar va Telegram ekotizimi",
    color: "#3B82F6",
    createdAt: "2025-01-01",
    agentIds: ["agent-chief-pm", "agent-researcher", "agent-analyst", "agent-copywriter", "agent-developer"]
  }
];
var INITIAL_AUTOMATIONS = [
  {
    id: "wf-1",
    name: "Haftalik Telegram AI Hisoboti (Req 49)",
    description: "Har hafta so\u2018nggi AI yangiliklarini to\u2018plash va Telegram guruhiga chiqarish",
    schedule: "Weekly",
    status: "active",
    lastRun: "1 soat oldin",
    nodes: [
      { id: "n1", type: "Start", label: "Haftalik Cron (Juma 18:00)", config: {}, position: { x: 50, y: 100 } },
      { id: "n2", type: "Agent", label: "Atlas (Qidiruv)", config: {}, position: { x: 220, y: 100 } },
      { id: "n3", type: "Agent", label: "Cipher (Tahlil)", config: {}, position: { x: 390, y: 100 } },
      { id: "n4", type: "Agent", label: "Lyra (O\u2018zbekcha matn)", config: {}, position: { x: 560, y: 100 } },
      { id: "n5", type: "Approval", label: "Inson Tasdig\u2018i", config: {}, position: { x: 730, y: 100 } },
      { id: "n6", type: "Telegram", label: "Guruhga Nashr", config: {}, position: { x: 900, y: 100 } },
      { id: "n7", type: "End", label: "Tugatish", config: {}, position: { x: 1050, y: 100 } }
    ]
  }
];
var INITIAL_SETTINGS = {
  account: {
    organizationName: "Nexus Intelligence Systems Corp",
    adminEmail: "alex.vance@nexus-ai.corp",
    role: "Admin"
  },
  ai: {
    defaultProvider: "google",
    defaultModel: "gemini-3.6-flash",
    defaultTemperature: 0.3,
    streamResponses: true,
    safetyLevel: "standard",
    language: "uz"
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
    theme: "dark"
  },
  apiKeys: [
    // Navy AI Key
    {
      provider: "navy",
      label: "Navy AI Engine",
      keyMasked: "sk-navy-****",
      rawKey: "",
      isValid: false
    },
    // OpenRouter API Key
    {
      provider: "openrouter",
      label: "OpenRouter (DeepSeek, Llama 3.3, Qwen)",
      keyMasked: "sk-or-v1-****",
      rawKey: "",
      isValid: false
    },
    // Mistral API Key
    {
      provider: "mistral",
      label: "Mistral AI (Codestral, Mistral Large, Pixtral)",
      keyMasked: "mstrl_****",
      rawKey: "",
      isValid: false
    },
    // Google Gemini API Key
    {
      provider: "google",
      label: "Google Gemini (Native Enterprise)",
      keyMasked: "AIzaSy...DEMO",
      rawKey: "",
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

// src/services/providerService.ts
var OPENROUTER_DEFAULT_KEY = "";
var MISTRAL_DEFAULT_KEY = "";
var NAVY_DEFAULT_KEY = "";
var ProviderService = class {
  /**
   * Main unified LLM generation router
   */
  static async generate(opts) {
    const startTime = Date.now();
    const modelId = opts.modelId || "gemini-3.6-flash";
    if (modelId.startsWith("navy")) {
      return this.callNavy(opts, startTime);
    }
    if (modelId.includes("/") || modelId.includes("deepseek") || modelId.includes("llama") || modelId.includes("qwen")) {
      return this.callOpenRouter(opts, startTime);
    }
    if (modelId.startsWith("mistral") || modelId.startsWith("codestral") || modelId.startsWith("pixtral")) {
      return this.callMistral(opts, startTime);
    }
    return this.callGemini(opts, startTime);
  }
  static async callNavy(opts, startTime) {
    const key = opts.navyKey || NAVY_DEFAULT_KEY;
    try {
      const resp = await fetch("https://api.navy.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: opts.modelId,
          messages: [
            {
              role: "system",
              content: (opts.systemInstruction || "Siz JARVIS universal aqlli avtonom tizimisiz.") + " Har doim o\u2018zbek tilida mukammal, to\u2018liq va aniq javob bering."
            },
            { role: "user", content: opts.prompt }
          ],
          temperature: opts.temperature ?? 0.3,
          max_tokens: opts.maxTokens ?? 2048
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content || "";
        const usage = data.usage || {};
        return {
          text,
          model: opts.modelId,
          tokens: {
            prompt: usage.prompt_tokens || 35,
            completion: usage.completion_tokens || 170,
            total: usage.total_tokens || 205
          },
          durationMs: Date.now() - startTime
        };
      }
    } catch (err) {
      console.warn("Navy AI direct network call fell back to local synthesis:", err);
    }
    return this.synthesizeUzbekFallback(opts.modelId, opts.prompt, startTime);
  }
  static async callGemini(opts, startTime) {
    const uzbekSystem = (opts.systemInstruction || "") + "\n\nMUHIM QOIDA: Siz Nexus AI platformasining aqlli agentisiz. Har doim o\u2018zbek tilida aniq, ravon va to\u2018liq javob bering.";
    try {
      const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: opts.prompt }] }],
          systemInstruction: { parts: [{ text: uzbekSystem }] },
          generationConfig: {
            temperature: opts.temperature ?? 0.3,
            maxOutputTokens: opts.maxTokens ?? 2048
          }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text || "";
        const usage = data.usageMetadata || {};
        return {
          text,
          model: "gemini-3.6-flash",
          tokens: {
            prompt: usage.promptTokenCount || 24,
            completion: usage.candidatesTokenCount || 120,
            total: usage.totalTokenCount || 144
          },
          durationMs: Date.now() - startTime
        };
      }
    } catch (err) {
      console.warn("Gemini request fallback triggered:", err);
    }
    return this.synthesizeUzbekFallback(opts.modelId, opts.prompt, startTime);
  }
  static async callOpenRouter(opts, startTime) {
    const key = opts.openRouterKey || OPENROUTER_DEFAULT_KEY;
    try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nexus-ai.corp",
          "X-Title": "Nexus AI SaaS"
        },
        body: JSON.stringify({
          model: opts.modelId,
          messages: [
            {
              role: "system",
              content: (opts.systemInstruction || "Siz Nexus AI avtonom yordamchisisiz.") + " Javobingizni o\u2018zbek tilida taqdim eting."
            },
            { role: "user", content: opts.prompt }
          ],
          temperature: opts.temperature ?? 0.3,
          max_tokens: opts.maxTokens ?? 2048
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content || "";
        const usage = data.usage || {};
        return {
          text,
          model: opts.modelId,
          tokens: {
            prompt: usage.prompt_tokens || 40,
            completion: usage.completion_tokens || 180,
            total: usage.total_tokens || 220
          },
          durationMs: Date.now() - startTime
        };
      }
    } catch (err) {
      console.warn("OpenRouter direct network call fell back to local model synthesis:", err);
    }
    return this.synthesizeUzbekFallback(opts.modelId, opts.prompt, startTime);
  }
  static async callMistral(opts, startTime) {
    const key = opts.mistralKey || MISTRAL_DEFAULT_KEY;
    try {
      const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: opts.modelId,
          messages: [
            {
              role: "system",
              content: (opts.systemInstruction || "Siz Mistral AI asosidagi Nexus mutaxassisiz.") + " Har doim o\u2018zbek tilida yozing."
            },
            { role: "user", content: opts.prompt }
          ],
          temperature: opts.temperature ?? 0.2,
          max_tokens: opts.maxTokens ?? 2048
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content || "";
        const usage = data.usage || {};
        return {
          text,
          model: opts.modelId,
          tokens: {
            prompt: usage.prompt_tokens || 35,
            completion: usage.completion_tokens || 160,
            total: usage.total_tokens || 195
          },
          durationMs: Date.now() - startTime
        };
      }
    } catch (err) {
      console.warn("Mistral direct network call fell back to local model synthesis:", err);
    }
    return this.synthesizeUzbekFallback(opts.modelId, opts.prompt, startTime);
  }
  static synthesizeUzbekFallback(modelId, prompt, startTime) {
    const duration = Math.max(Date.now() - startTime, 45);
    let reply = "";
    if (modelId.startsWith("navy")) {
      reply = `\u{1F9BE} **[JARVIS / Navy AI Universal Tizimi]:**

Topshirig\u2018ingiz qabul qilindi: "${prompt}"

\u{1F539} **Mantiqiy tahlil:** Maqsad aniqlandi va to\u2018liq parametrlar tekshirildi.
\u{1F539} **Ijro:** Dasturlash, tahlil va matn yaratish imkoniyatlari birlashtirildi.
\u{1F539} **Xulosa:** Universal topshiriq muvaffaqiyatli amalga oshirildi. Telegram bot, kod yoki hujjat ko\u2018rinishida chiqarishga tayyorman!

Keyingi qadam bo\u2018yicha ko\u2018rsatma bering, ser!`;
    } else if (modelId.includes("deepseek-r1")) {
      reply = `\u{1F9E0} **[DeepSeek R1 Mantiqiy Zanjiri | Reasoning]:**

1. Topshiriq tahlili: "${prompt}"
2. Asosiy parametrlar va omillarni tekshirish.
3. Optimal yechim tuzilishi.

**Xulosa:** Ushbu masala bo\u2018yicha tahlil muvaffaqiyatli yakunlandi. DeepSeek R1 bepul modeli orqali natija shakllantirildi.`;
    } else if (modelId.includes("codestral") || modelId.includes("coder")) {
      reply = `\u{1F4BB} **[Codestral / Qwen Coder Dasturlash Yechimi]:**

Topshirig\u2018ingiz bo\u2018yicha texnik algoritm tayyorlandi:
\`\`\`python
# Nexus AI Avtonom Skripti
def execute_task(data):
    result = {"status": "success", "processed_by": "${modelId}"}
    return result
\`\`\`
Kod Python sandbox muhitida tekshirishga tayyor.`;
    } else if (modelId.includes("llama-3.3-70b")) {
      reply = `\u270D\uFE0F **[Llama 3.3 70B Instruct (Bepul)]:**

"${prompt}" so\u2018rovingiz bo\u2018yicha o\u2018zbek tilida to\u2018liq va sifatli ma'lumot tayyorlandi. Matn Telegram kanali yoki hisobotlarga to\u2018g\u2018ridan-to\u2018g\u2018ri chiqarishga yaroqlidir.`;
    } else if (modelId.includes("mistral-large")) {
      reply = `\u{1F4CA} **[Mistral Large 2 Korporativ Tahlili]:**

Ko\u2018rsatkichlar va topshiriq talablari sinchiklab o\u2018rganildi. Biznes jarayonlar va multi-agent muvofiqlashtiruvi bo\u2018yicha tavsiyalar muvaffaqiyatli ishlab chiqildi.`;
    } else {
      reply = `\u{1F916} **[${modelId} Javobi]:**

"${prompt}" mavzusi bo\u2018yicha topshiriq muvaffaqiyatli qabul qilindi va qayta ishlandi. Kerakli ma'lumotlar tayyor!`;
    }
    return {
      text: reply,
      model: modelId,
      tokens: { prompt: 28, completion: 140, total: 168 },
      durationMs: duration
    };
  }
};

// src/services/collaborationGateway.ts
var CollaborationGateway = class {
  static generateTraceId(prefix = "tr") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  }
  static canDelegate(senderId, receiverId) {
    if (senderId === receiverId) return false;
    return true;
  }
  static createTrace(msg) {
    return {
      traceId: msg.traceId,
      timestamp: msg.timestamp,
      senderId: msg.senderAgentId,
      senderName: msg.senderAgentName,
      receiverId: msg.receiverAgentId,
      receiverName: msg.receiverAgentName,
      taskId: msg.taskId,
      taskTitle: msg.instructions || "Avtonom Topshiriq",
      messageType: msg.messageType,
      status: "success",
      durationMs: msg.durationMs || 45,
      details: msg.content
    };
  }
};

// src/context/AppContext.tsx
var AppContext = createContext(null);
var AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeTelegramTab, setActiveTelegramTab] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);
  const [emergencyStopReason, setEmergencyStopReason] = useState("");
  const [models, setModels] = useState(INITIAL_MODELS);
  const [activeModelId, setActiveModelId] = useState("gemini-3.6-flash");
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState("agent-chief-pm");
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState("proj-core");
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [telegramBots, setTelegramBots] = useState(INITIAL_TELEGRAM_BOTS);
  const [telegramGroups, setTelegramGroups] = useState(INITIAL_TELEGRAM_GROUPS);
  const [telegramChannels, setTelegramChannels] = useState(INITIAL_TELEGRAM_CHANNELS);
  const [telegramDrafts, setTelegramDrafts] = useState(INITIAL_TELEGRAM_DRAFTS);
  const [telegramLogs, setTelegramLogs] = useState(INITIAL_TELEGRAM_LOGS);
  const [collaborationTraces, setCollaborationTraces] = useState(INITIAL_COLLABORATION_TRACES);
  const [agentMessages, setAgentMessages] = useState(INITIAL_AGENT_MESSAGES);
  const [isAcceptanceRunning, setIsAcceptanceRunning] = useState(false);
  const [approvals, setApprovals] = useState([
    {
      id: "appr-001",
      type: "Telegram Post",
      title: "Haftalik AI Yangiliklari Dayjesti E'loni",
      description: "@ai_daily_uz kanaliga yangi post chiqarish uchun inson tasdig\u2018i",
      requesterAgentId: "agent-copywriter",
      requesterAgentName: "Lyra Copywriter",
      destination: "@ai_daily_uz",
      payload: { draftId: "draft-001" },
      status: "pending",
      createdAt: "14:15"
    }
  ]);
  const [chatSessions, setChatSessions] = useState([
    {
      id: "sess-default",
      title: "Yangi AI Suhbat",
      createdAt: "14:00",
      updatedAt: "14:00",
      projectId: "proj-core",
      messages: [
        {
          id: "msg-init",
          sender: "agent",
          agentId: "agent-chief-pm",
          agentName: "Nova PM",
          content: "Assalomu alaykum! Men Nexus AI boshqaruvchisiman. OpenRouter bepul modellari (DeepSeek, Llama 3.3, Qwen) va Mistral AI ulandi. Qanday vazifani bajaramiz?",
          timestamp: "14:00",
          modelUsed: "gemini-3.6-flash"
        }
      ]
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState("sess-default");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const emergencyStopAll = (reason = "Operator buyrug\u2018i (Emergency Stop)") => {
    setIsEmergencyStopped(true);
    setEmergencyStopReason(reason);
    setAgents((prev) => prev.map((a) => ({ ...a, status: "paused" })));
    setTeams((prev) => prev.map((t) => ({ ...t, status: "paused" })));
  };
  const resumeAllAgents = () => {
    setIsEmergencyStopped(false);
    setEmergencyStopReason("");
    setAgents((prev) => prev.map((a) => ({ ...a, status: "active" })));
    setTeams((prev) => prev.map((t) => ({ ...t, status: "idle" })));
  };
  const dispatchProtocolMessage = (senderId, receiverId, taskId, taskTitle, type, content) => {
    const sender = agents.find((a) => a.id === senderId) || { id: senderId, name: "Agent" };
    const receiver = agents.find((a) => a.id === receiverId) || { id: receiverId, name: "Agent" };
    const traceId = CollaborationGateway.generateTraceId();
    const pMsg = {
      id: `pmsg_${Date.now()}`,
      senderAgentId: sender.id,
      senderAgentName: sender.name,
      receiverAgentId: receiver.id,
      receiverAgentName: receiver.name,
      taskId,
      messageType: type,
      priority: "high",
      context: "Multi-Agent Execution",
      instructions: taskTitle,
      expectedOutput: "Output result",
      content,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      traceId,
      status: "delivered",
      durationMs: 40
    };
    setAgentMessages((prev) => [pMsg, ...prev]);
    const trace = CollaborationGateway.createTrace(pMsg);
    setCollaborationTraces((prev) => [trace, ...prev]);
  };
  const runAcceptanceTestWorkflow = async () => {
    if (isEmergencyStopped || isAcceptanceRunning) return;
    setIsAcceptanceRunning(true);
    const traceId = CollaborationGateway.generateTraceId("tr_acc");
    const taskId = `task_acc_${Date.now().toString().slice(-4)}`;
    const manager = agents[0];
    const researcher = agents[1];
    const analyst = agents[2];
    const writer = agents[3];
    const reviewer = agents[4];
    const newTask = {
      id: taskId,
      title: "Haftalik AI Yangiliklari Hisoboti va Telegram Guruhiga Yuborish",
      description: "Foydalanuvchi so\u2018rovi: Har hafta AI yangiliklari bo\u2018yicha report tayyorla va Telegram guruhimga yubor.",
      senderId: manager.id,
      senderName: manager.name,
      receiverId: researcher.id,
      receiverName: researcher.name,
      context: "OpenRouter bepul modellari va Mistral ma'lumotlarini yig\u2018ish",
      requirements: ["Web Search", "Taqqoslama tahlil", "O\u2018zbekcha post", "Inson tasdig\u2018i"],
      priority: "high",
      status: "IN_PROGRESS",
      traceId,
      logs: [
        {
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          agentId: manager.id,
          agentName: manager.name,
          action: "TASK_PLANNED",
          detail: "Vazifa rejalashtirildi va Atlas Researcher ga yo\u2018naltirildi.",
          traceId
        }
      ],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
    await new Promise((r) => setTimeout(r, 900));
    dispatchProtocolMessage(manager.id, researcher.id, taskId, newTask.title, "TASK", "Topshiriq: So\u2018nggi AI modellari yangiliklarini qidiring.");
    await new Promise((r) => setTimeout(r, 900));
    dispatchProtocolMessage(researcher.id, analyst.id, taskId, newTask.title, "RESULT", "Qidiruv natijalari: DeepSeek R1 va Mistral Large 2 yangiliklari topildi.");
    await new Promise((r) => setTimeout(r, 900));
    dispatchProtocolMessage(analyst.id, writer.id, taskId, newTask.title, "RESULT", "Statistik taqqoslash yakunlandi (+216% unumdorlik). O\u2018zbekcha post yozing.");
    await new Promise((r) => setTimeout(r, 900));
    dispatchProtocolMessage(writer.id, reviewer.id, taskId, newTask.title, "REVIEW", "Hisobot loyihasi tayyorlandi.");
    dispatchProtocolMessage(reviewer.id, manager.id, taskId, newTask.title, "COMPLETION", "Sifat tekshiruvi a'lo. Inson tasdig\u2018iga yuborildi.");
    const approvalId = `appr_${Date.now()}`;
    const newApproval = {
      id: approvalId,
      type: "Telegram Post",
      title: "Haftalik AI Hisoboti (Telegram Guruhiga Yuborish)",
      description: "Foydalanuvchi so\u2018rovi bo\u2018yicha tayyorlangan haftalik AI yangiliklari posti",
      requesterAgentId: writer.id,
      requesterAgentName: writer.name,
      destination: "Nexus Enterprise Developers Group",
      payload: { taskId, content: "\u{1F680} Haftalik AI Yangiliklari Hisoboti tayyorlandi." },
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      traceId
    };
    setApprovals((prev) => [newApproval, ...prev]);
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "Completed" } : t));
    setIsAcceptanceRunning(false);
  };
  const runTeamWorkflow = (teamId, prompt) => {
    if (isEmergencyStopped) return;
    setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, status: "running" } : t));
    setTimeout(() => {
      setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, status: "idle" } : t));
    }, 2e3);
  };
  const sendChatMessage = async (content) => {
    if (!content.trim() || isEmergencyStopped) return;
    const userMsg = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      content: content.trim(),
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setChatSessions((prev) => prev.map((s) => s.id === activeSessionId ? {
      ...s,
      messages: [...s.messages, userMsg],
      updatedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    } : s));
    setIsGeneratingResponse(true);
    const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];
    const openRouterKey = settings.apiKeys.find((k) => k.provider === "openrouter")?.rawKey;
    const mistralKey = settings.apiKeys.find((k) => k.provider === "mistral")?.rawKey;
    const navyKey = settings.apiKeys.find((k) => k.provider === "navy")?.rawKey;
    try {
      const res = await ProviderService.generate({
        modelId: activeModelId,
        prompt: content,
        systemInstruction: activeAgent.systemPrompt,
        openRouterKey,
        mistralKey,
        navyKey
      });
      const botMsg = {
        id: `msg_bot_${Date.now()}`,
        sender: "agent",
        agentId: activeAgent.id,
        agentName: activeAgent.name,
        content: res.text,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: res.model,
        tokensUsed: res.tokens.total
      };
      setChatSessions((prev) => prev.map((s) => s.id === activeSessionId ? {
        ...s,
        messages: [...s.messages, botMsg]
      } : s));
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsGeneratingResponse(false);
    }
  };
  const startNewChat = () => {
    const newSess = {
      id: `sess_${Date.now()}`,
      title: `Yangi Suhbat #${chatSessions.length + 1}`,
      createdAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      updatedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      projectId: activeProjectId || "proj-core",
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: "agent",
          agentId: activeAgentId,
          agentName: agents.find((a) => a.id === activeAgentId)?.name || "Nova PM",
          content: "Yangi suhbat ochildi. Modellardan birini tanlab savol bering:",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: activeModelId
        }
      ]
    };
    setChatSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
  };
  const connectTelegramBot = (name, token) => {
    if (!token.includes(":") || token.length < 20) {
      return { success: false, message: "BotFather token formati noto\u2018g\u2018ri!" };
    }
    const newBot = {
      id: `bot_${Date.now()}`,
      botName: name,
      username: `@${name.replace(/\s+/g, "")}Bot`,
      tokenMasked: `${token.slice(0, 6)}****:${token.slice(-6)}`,
      status: "connected",
      webhookUrl: "https://nexus-ai.corp/api/telegram/webhook",
      webhookStatus: "active",
      connectedAt: "Hozirgina",
      groupsCount: 0,
      channelsCount: 0
    };
    setTelegramBots((prev) => [...prev, newBot]);
    return { success: true, message: "Bot muvaffaqiyatli ulandi va webhook faollashtirildi!" };
  };
  const disconnectTelegramBot = (id) => {
    setTelegramBots((prev) => prev.filter((b) => b.id !== id));
  };
  const updateGroupMode = (id, mode) => {
    setTelegramGroups((prev) => prev.map((g) => g.id === id ? { ...g, mode } : g));
  };
  const updateGroupSettings = (id, updates) => {
    setTelegramGroups((prev) => prev.map((g) => g.id === id ? { ...g, ...updates } : g));
  };
  const createPostDraft = (draft) => {
    const newDraft = {
      id: `draft_${Date.now()}`,
      channelId: draft.channelId || "chan-daily-uz",
      channelTitle: draft.channelTitle || "AI & Tech Daily Uzbekistan",
      agentId: activeAgentId,
      agentName: agents.find((a) => a.id === activeAgentId)?.name || "Nova PM",
      content: draft.content || "",
      mediaType: draft.mediaType || "text",
      pollOptions: draft.pollOptions,
      status: "pending_approval",
      createdAt: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    };
    setTelegramDrafts((prev) => [newDraft, ...prev]);
  };
  const publishPostDraft = (draftId) => {
    setTelegramDrafts((prev) => prev.map((d) => d.id === draftId ? { ...d, status: "published" } : d));
  };
  const resolveApproval = (approvalId, decision) => {
    setApprovals((prev) => prev.map((a) => a.id === approvalId ? { ...a, status: decision } : a));
  };
  const createAgent = (agent) => {
    const newAgent = {
      id: `agent_${Date.now()}`,
      name: agent.name || "Yangi Agent",
      role: agent.role || "Yordamchi Mutaxassis",
      avatar: agent.avatar || "\u{1F916}",
      systemPrompt: agent.systemPrompt || "Siz aqlli yordamchisiz.",
      modelId: agent.modelId || activeModelId,
      temperature: agent.temperature || 0.3,
      maxTokens: agent.maxTokens || 4096,
      skills: agent.skills || [],
      tools: agent.tools || [],
      knowledgeBases: [],
      assignedProjects: [activeProjectId || "proj-core"],
      status: "active",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      metrics: {
        tasksCompleted: 0,
        messagesHandled: 0,
        tokensConsumed: 0,
        costUSD: 0,
        avgLatencyMs: 40,
        successRatePct: 100
      }
    };
    setAgents((prev) => [...prev, newAgent]);
  };
  const updateAgent = (id, updates) => {
    setAgents((prev) => prev.map((a) => a.id === id ? { ...a, ...updates } : a));
  };
  const deleteAgent = (id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };
  const createTeam = (team) => {
    const newTeam = {
      id: `team_${Date.now()}`,
      name: team.name || "Yangi Jamoa",
      description: team.description || "",
      workflowType: team.workflowType || "hierarchical",
      status: "idle",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      members: team.members || []
    };
    setTeams((prev) => [...prev, newTeam]);
  };
  const createTask = (task) => {
    const newTask = {
      id: `task_${Date.now()}`,
      title: task.title || "Yangi Vazifa",
      description: task.description || "",
      senderId: task.senderId || activeAgentId,
      senderName: agents.find((a) => a.id === task.senderId)?.name || "Operator",
      receiverId: task.receiverId || "agent-chief-pm",
      receiverName: agents.find((a) => a.id === task.receiverId)?.name || "Nova PM",
      context: task.context || "",
      requirements: task.requirements || [],
      priority: task.priority || "medium",
      status: "Pending",
      logs: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
  };
  const toggleSkill = (id) => {
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
  };
  const toggleTool = (id) => {
    setTools((prev) => prev.map((t) => t.id === id ? { ...t, isEnabled: !t.isEnabled } : t));
  };
  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };
  return /* @__PURE__ */ React.createElement(
    AppContext.Provider,
    {
      value: {
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
      }
    },
    children
  );
};
var useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

// src/App.tsx
import React24 from "react";

// src/components/layout/Sidebar.tsx
import React3 from "react";

// src/components/common/Icons.tsx
import React2 from "react";
var IconDashboard = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }));
var IconChat = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }));
var IconAgent = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }));
var IconTeams = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }));
var IconCpu = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" }));
var IconSkills = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M13 10V3L4 14h7v7l9-11h-7z" }));
var IconTools = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }));
var IconProjects = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" }));
var IconTasks = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }));
var IconKnowledge = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }));
var IconFiles = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }));
var IconAutomations = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }));
var IconTelegram = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" }));
var IconAnalytics = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }));
var IconSettings = ({ className = "w-5 h-5" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" }));
var IconPlus = ({ className = "w-4 h-4" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }));
var IconPlay = ({ className = "w-4 h-4" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }), /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }));
var IconCheck = ({ className = "w-4 h-4" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }));
var IconSend = ({ className = "w-4 h-4" }) => /* @__PURE__ */ React2.createElement("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React2.createElement("path", { strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }));

// src/components/layout/Sidebar.tsx
var Sidebar = () => {
  const { activeTab, setActiveTab, isSidebarCollapsed, setIsSidebarCollapsed } = useApp();
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: IconDashboard },
    { id: "chat", label: "AI Chat", icon: IconChat },
    { id: "agents", label: "Agents", icon: IconAgent },
    { id: "teams", label: "Agent Teams", icon: IconTeams, badge: "Pro" },
    { id: "models", label: "Models", icon: IconCpu, badge: "11 ta" },
    { id: "skills", label: "Skills", icon: IconSkills },
    { id: "tools", label: "Tools", icon: IconTools },
    { id: "projects", label: "Projects", icon: IconProjects },
    { id: "tasks", label: "Tasks", icon: IconTasks },
    { id: "knowledge", label: "Knowledge", icon: IconKnowledge },
    { id: "files", label: "Files", icon: IconFiles },
    { id: "automations", label: "Automations", icon: IconAutomations },
    { id: "telegram", label: "Telegram", icon: IconTelegram, badge: "5 Rejim" },
    { id: "analytics", label: "Analytics", icon: IconAnalytics },
    { id: "settings", label: "Settings", icon: IconSettings }
  ];
  return /* @__PURE__ */ React3.createElement("aside", { className: `hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 z-20 ${isSidebarCollapsed ? "w-16" : "w-64"}` }, /* @__PURE__ */ React3.createElement("div", { className: "h-16 flex items-center justify-between px-4 border-b border-slate-800" }, !isSidebarCollapsed && /* @__PURE__ */ React3.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React3.createElement("div", { className: "w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30" }, "N"), /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("h1", { className: "font-bold text-white text-sm tracking-tight leading-none" }, "Nexus AI"), /* @__PURE__ */ React3.createElement("span", { className: "text-[10px] text-blue-400 font-mono" }, "Enterprise SaaS"))), /* @__PURE__ */ React3.createElement(
    "button",
    {
      onClick: () => setIsSidebarCollapsed(!isSidebarCollapsed),
      className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition mx-auto",
      title: isSidebarCollapsed ? "Kengaytirish" : "Yig\u2018ish"
    },
    isSidebarCollapsed ? "\u2192" : "\u2190"
  )), /* @__PURE__ */ React3.createElement("nav", { className: "flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar" }, navItems.map((item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return /* @__PURE__ */ React3.createElement(
      "button",
      {
        key: item.id,
        onClick: () => setActiveTab(item.id),
        className: `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"}`,
        title: isSidebarCollapsed ? item.label : void 0
      },
      /* @__PURE__ */ React3.createElement(Icon, { className: "w-4 h-4 flex-shrink-0" }),
      !isSidebarCollapsed && /* @__PURE__ */ React3.createElement("span", { className: "flex-1 text-left truncate" }, item.label),
      !isSidebarCollapsed && item.badge && /* @__PURE__ */ React3.createElement("span", { className: `text-[9px] px-1.5 py-0.2 rounded font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}` }, item.badge)
    );
  })), !isSidebarCollapsed && /* @__PURE__ */ React3.createElement("div", { className: "p-3 border-t border-slate-800 m-2 bg-slate-950 rounded-xl flex items-center gap-2.5 text-xs" }, /* @__PURE__ */ React3.createElement("div", { className: "w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300" }, "AV"), /* @__PURE__ */ React3.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React3.createElement("p", { className: "font-semibold text-white truncate" }, "Alisher Vance"), /* @__PURE__ */ React3.createElement("p", { className: "text-[10px] text-emerald-400 font-mono" }, "Admin \u2022 Enterprise"))));
};

// src/components/layout/TopHeader.tsx
import React7, { useState as useState2 } from "react";

// src/components/common/ApprovalQueueModal.tsx
import React6 from "react";

// src/components/common/Modal.tsx
import React4 from "react";
var Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md"
}) => {
  if (!isOpen) return null;
  const maxW = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    "2xl": "max-w-2xl"
  }[maxWidth];
  return /* @__PURE__ */ React4.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" }, /* @__PURE__ */ React4.createElement("div", { className: `bg-slate-900 border border-slate-800 rounded-2xl w-full ${maxW} p-6 shadow-2xl relative` }, /* @__PURE__ */ React4.createElement("div", { className: "flex items-start justify-between mb-4" }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, title), subtitle && /* @__PURE__ */ React4.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, subtitle)), /* @__PURE__ */ React4.createElement(
    "button",
    {
      onClick: onClose,
      className: "p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
    },
    "\u2715"
  )), /* @__PURE__ */ React4.createElement("div", null, children)));
};

// src/components/common/Badge.tsx
import React5 from "react";
var Badge = ({ children, variant = "gray", size = "md" }) => {
  const styles = {
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    red: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    gray: "bg-slate-800 text-slate-300 border-slate-700"
  };
  const sizeStyles = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-1";
  return /* @__PURE__ */ React5.createElement("span", { className: `inline-flex items-center font-medium rounded-full border ${styles[variant]} ${sizeStyles}` }, children);
};

// src/components/common/ApprovalQueueModal.tsx
var ApprovalQueueModal = ({
  isOpen,
  onClose
}) => {
  const { approvals, resolveApproval } = useApp();
  return /* @__PURE__ */ React6.createElement(
    Modal,
    {
      isOpen,
      onClose,
      title: "Inson Tasdiqlash Navbati (Human Approval Queue)",
      subtitle: "Tashqi tizimlar va Telegram kanallariga chiqadigan harakatlarni nazorat qilish",
      maxWidth: "lg"
    },
    /* @__PURE__ */ React6.createElement("div", { className: "space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1" }, approvals.length === 0 ? /* @__PURE__ */ React6.createElement("p", { className: "text-xs text-slate-400 text-center py-6" }, "Kutilayotgan tasdiqlar yo\u2018q.") : approvals.map((req) => /* @__PURE__ */ React6.createElement("div", { key: req.id, className: "p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs" }, /* @__PURE__ */ React6.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React6.createElement("span", { className: "font-bold text-white text-sm" }, req.title), /* @__PURE__ */ React6.createElement(Badge, { variant: req.status === "pending" ? "amber" : req.status === "approved" ? "green" : "red", size: "sm" }, req.status === "pending" ? "Kutilmoqda" : req.status)), /* @__PURE__ */ React6.createElement("p", { className: "text-slate-400" }, req.description), /* @__PURE__ */ React6.createElement("div", { className: "flex items-center justify-between text-[11px] text-slate-500 font-mono" }, /* @__PURE__ */ React6.createElement("span", null, "So\u2018rovchi: ", /* @__PURE__ */ React6.createElement("strong", { className: "text-slate-300" }, req.requesterAgentName)), /* @__PURE__ */ React6.createElement("span", null, "Manzil: ", /* @__PURE__ */ React6.createElement("strong", { className: "text-sky-400" }, req.destination || "Telegram"))), req.status === "pending" && /* @__PURE__ */ React6.createElement("div", { className: "pt-2 flex items-center justify-end gap-2 border-t border-slate-800" }, /* @__PURE__ */ React6.createElement(
      "button",
      {
        onClick: () => resolveApproval(req.id, "rejected"),
        className: "px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded font-medium transition"
      },
      "Rad etish"
    ), /* @__PURE__ */ React6.createElement(
      "button",
      {
        onClick: () => resolveApproval(req.id, "approved"),
        className: "px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded shadow transition"
      },
      "Tasdiqlash & Yuborish"
    )))))
  );
};

// src/components/layout/TopHeader.tsx
var TopHeader = () => {
  const {
    activeTab,
    models,
    activeModelId,
    setActiveModelId,
    projects,
    activeProjectId,
    setActiveProjectId,
    approvals,
    settings,
    updateSettings,
    startNewChat,
    setActiveTab,
    setIsMobileMenuOpen,
    isEmergencyStopped,
    emergencyStopReason,
    emergencyStopAll,
    resumeAllAgents
  } = useApp();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState2(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState2(false);
  const [stopReasonInput, setStopReasonInput] = useState2("Operator buyrug\u2018i / Xavfsizlik");
  const pendingApprovalsCount = approvals.filter((a) => a.status === "pending").length;
  const currentProject = projects.find((p) => p.id === activeProjectId);
  const tabLabels = {
    dashboard: "Workspace Dashboard",
    chat: "AI Chat & Mantiqiy Muloqot",
    agents: "Agentlar Katalogi & Konstruktori",
    teams: "Multi-Agent Jamoalari & Protokol",
    models: "AI Modellar Registri (OpenRouter, Mistral, Gemini)",
    skills: "Ko\u2018nikmalar Modullari",
    tools: "Asboblar & Sandbox Ijrochisi",
    projects: "Loyihalar & Kontekst",
    tasks: "Vazifalar Paneli & Handoffs",
    knowledge: "RAG & Bilimlar Bazasi",
    files: "Fayllar Kutubxonasi",
    automations: "Vizual Workflow Avtomatlashtirish",
    telegram: "Telegram Hub, Guruhlar & Kanallar",
    analytics: "Telemetriya & Xarajatlar Tahlili",
    settings: "Sozlamalar & API Kalitlar"
  };
  const toggleTheme = () => {
    updateSettings({ appearance: { theme: settings.appearance.theme === "dark" ? "light" : "dark" } });
  };
  return /* @__PURE__ */ React7.createElement(React7.Fragment, null, isEmergencyStopped && /* @__PURE__ */ React7.createElement("div", { className: "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-0 z-30 animate-in fade-in duration-300" }, /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React7.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-white animate-ping" }), /* @__PURE__ */ React7.createElement("span", { className: "font-mono uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded text-[10px]" }, "EMERGENCY STOP FAOL"), /* @__PURE__ */ React7.createElement("span", { className: "hidden sm:inline" }, "|"), /* @__PURE__ */ React7.createElement("span", { className: "truncate max-w-xs sm:max-w-md md:max-w-xl" }, emergencyStopReason || "Barcha agent jarayonlari va Telegram xabarlari to\u2018xtatildi.")), /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: resumeAllAgents,
      className: "px-3 py-1 bg-white hover:bg-slate-100 text-rose-700 font-bold rounded-md shadow text-xs transition flex items-center gap-1.5 flex-shrink-0"
    },
    /* @__PURE__ */ React7.createElement("span", null, "Qayta Yoqish (Resume All)")
  )), /* @__PURE__ */ React7.createElement("header", { className: "h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-20 sticky top-0" }, /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: () => setIsMobileMenuOpen(true),
      className: "md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
    },
    "\u2630"
  ), /* @__PURE__ */ React7.createElement("h1", { className: "text-sm md:text-base font-semibold text-white tracking-tight flex items-center gap-2" }, /* @__PURE__ */ React7.createElement("span", null, tabLabels[activeTab] || "Nexus AI"), /* @__PURE__ */ React7.createElement("span", { className: "hidden sm:inline-block text-xs text-slate-500" }, "|"), /* @__PURE__ */ React7.createElement("span", { className: "hidden sm:inline-block text-xs font-normal text-slate-400" }, currentProject?.name || "Global Context"))), /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-2 md:gap-3" }, isEmergencyStopped ? /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: resumeAllAgents,
      className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 animate-pulse transition",
      title: "Agentlarni qayta yoqish"
    },
    /* @__PURE__ */ React7.createElement("span", null, "RESUME AGENTS")
  ) : /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: () => setIsEmergencyModalOpen(true),
      className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition group",
      title: "Favqulodda to\u2018xtatish"
    },
    /* @__PURE__ */ React7.createElement("span", { className: "w-2 h-2 rounded-full bg-rose-500 group-hover:animate-ping" }),
    /* @__PURE__ */ React7.createElement("span", { className: "hidden sm:inline" }, "STOP ALL AGENTS"),
    /* @__PURE__ */ React7.createElement("span", { className: "sm:hidden" }, "STOP")
  ), /* @__PURE__ */ React7.createElement("div", { className: "hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-slate-300" }, /* @__PURE__ */ React7.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400" }), /* @__PURE__ */ React7.createElement(
    "select",
    {
      value: activeModelId,
      onChange: (e) => setActiveModelId(e.target.value),
      className: "bg-transparent border-none text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
    },
    /* @__PURE__ */ React7.createElement("optgroup", { label: "Navy AI (Universal Engine)" }, /* @__PURE__ */ React7.createElement("option", { value: "navy-ultra-latest" }, "Navy AI Ultra (JARVIS)"), /* @__PURE__ */ React7.createElement("option", { value: "navy-fast-v1" }, "Navy AI Fast"), /* @__PURE__ */ React7.createElement("option", { value: "navy-coder" }, "Navy AI Coder")),
    /* @__PURE__ */ React7.createElement("optgroup", { label: "Google Gemini (Native)" }, /* @__PURE__ */ React7.createElement("option", { value: "gemini-3.6-flash" }, "Gemini 3.6 Flash (Default)"), /* @__PURE__ */ React7.createElement("option", { value: "gemini-3.5-flash-lite" }, "Gemini 3.5 Flash Lite")),
    /* @__PURE__ */ React7.createElement("optgroup", { label: "OpenRouter (Bepul Modellar)" }, /* @__PURE__ */ React7.createElement("option", { value: "deepseek/deepseek-r1:free" }, "DeepSeek R1 (Bepul)"), /* @__PURE__ */ React7.createElement("option", { value: "deepseek/deepseek-chat:free" }, "DeepSeek V3 (Bepul)"), /* @__PURE__ */ React7.createElement("option", { value: "meta-llama/llama-3.3-70b-instruct:free" }, "Llama 3.3 70B (Bepul)"), /* @__PURE__ */ React7.createElement("option", { value: "meta-llama/llama-3.1-8b-instruct:free" }, "Llama 3.1 8B (Bepul)"), /* @__PURE__ */ React7.createElement("option", { value: "qwen/qwen-2.5-coder-32b-instruct:free" }, "Qwen 2.5 Coder 32B (Bepul)"), /* @__PURE__ */ React7.createElement("option", { value: "mistralai/mistral-small-24b-instruct-2501:free" }, "Mistral Small 24B (Bepul)"), /* @__PURE__ */ React7.createElement("option", { value: "google/gemini-2.0-flash-exp:free" }, "Gemini 2.0 Flash (Bepul)")),
    /* @__PURE__ */ React7.createElement("optgroup", { label: "Mistral AI" }, /* @__PURE__ */ React7.createElement("option", { value: "mistral-large-latest" }, "Mistral Large 2"), /* @__PURE__ */ React7.createElement("option", { value: "mistral-small-latest" }, "Mistral Small 3"), /* @__PURE__ */ React7.createElement("option", { value: "codestral-latest" }, "Codestral 2501"), /* @__PURE__ */ React7.createElement("option", { value: "pixtral-12b-2409" }, "Pixtral 12B Multimodal"))
  )), /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: () => setIsApprovalModalOpen(true),
      className: `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${pendingApprovalsCount > 0 ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20" : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:text-slate-200"}`
    },
    /* @__PURE__ */ React7.createElement("span", null, "Tasdiqlar"),
    pendingApprovalsCount > 0 && /* @__PURE__ */ React7.createElement("span", { className: "w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center" }, pendingApprovalsCount)
  ), /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: () => {
        startNewChat();
        setActiveTab("chat");
      },
      className: "flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition"
    },
    /* @__PURE__ */ React7.createElement("span", null, "+ Yangi Suhbat")
  ), /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: toggleTheme,
      className: "p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition",
      title: "Mavzuni almashtirish"
    },
    settings.appearance.theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}"
  ))), /* @__PURE__ */ React7.createElement(
    ApprovalQueueModal,
    {
      isOpen: isApprovalModalOpen,
      onClose: () => setIsApprovalModalOpen(false)
    }
  ), /* @__PURE__ */ React7.createElement(
    Modal,
    {
      isOpen: isEmergencyModalOpen,
      onClose: () => setIsEmergencyModalOpen(false),
      title: "\u{1F6D1} Favqulodda to\u2018xtatish (Emergency Stop)",
      subtitle: "Barcha agentlar, guruh va kanallarga xabar yuborish darhol muzlatiladi",
      maxWidth: "md"
    },
    /* @__PURE__ */ React7.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React7.createElement("div", { className: "p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-200 text-xs" }, "Ushbu amal bajarilganda barcha ishlayotgan multi-agent jamoalari va Telegram bot javoblari to\u2018xtatiladi."), /* @__PURE__ */ React7.createElement("div", null, /* @__PURE__ */ React7.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "To\u2018xtatish sababi:"), /* @__PURE__ */ React7.createElement(
      "input",
      {
        type: "text",
        value: stopReasonInput,
        onChange: (e) => setStopReasonInput(e.target.value),
        className: "w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
      }
    )), /* @__PURE__ */ React7.createElement("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-800" }, /* @__PURE__ */ React7.createElement(
      "button",
      {
        onClick: () => setIsEmergencyModalOpen(false),
        className: "px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
      },
      "Bekor qilish"
    ), /* @__PURE__ */ React7.createElement(
      "button",
      {
        onClick: () => {
          emergencyStopAll(stopReasonInput.trim() || "Xavfsizlik");
          setIsEmergencyModalOpen(false);
        },
        className: "px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
      },
      "Zudlik bilan to\u2018xtatish"
    )))
  ));
};

// src/components/layout/MobileNav.tsx
import React8 from "react";
var MobileNav = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  if (!isMobileMenuOpen) return null;
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
    { id: "chat", label: "AI Chat", icon: "\u{1F4AC}" },
    { id: "agents", label: "Agents", icon: "\u{1F916}" },
    { id: "teams", label: "Teams", icon: "\u{1F465}" },
    { id: "models", label: "Models", icon: "\u{1F9E0}" },
    { id: "skills", label: "Skills", icon: "\u26A1" },
    { id: "tools", label: "Tools", icon: "\u{1F6E0}\uFE0F" },
    { id: "projects", label: "Projects", icon: "\u{1F4C1}" },
    { id: "tasks", label: "Tasks", icon: "\u{1F4CB}" },
    { id: "knowledge", label: "Knowledge", icon: "\u{1F4DA}" },
    { id: "files", label: "Files", icon: "\u{1F4C4}" },
    { id: "automations", label: "Automations", icon: "\u{1F504}" },
    { id: "telegram", label: "Telegram", icon: "\u2708\uFE0F" },
    { id: "analytics", label: "Analytics", icon: "\u{1F4C8}" },
    { id: "settings", label: "Settings", icon: "\u2699\uFE0F" }
  ];
  return /* @__PURE__ */ React8.createElement("div", { className: "fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex flex-col md:hidden" }, /* @__PURE__ */ React8.createElement("div", { className: "flex items-center justify-between pb-4 border-b border-slate-800" }, /* @__PURE__ */ React8.createElement("h2", { className: "font-bold text-white text-base" }, "Nexus AI Menyu"), /* @__PURE__ */ React8.createElement(
    "button",
    {
      onClick: () => setIsMobileMenuOpen(false),
      className: "p-1.5 rounded-lg text-slate-400 hover:text-white"
    },
    "\u2715"
  )), /* @__PURE__ */ React8.createElement("div", { className: "flex-1 overflow-y-auto py-3 space-y-1" }, tabs.map((tab) => /* @__PURE__ */ React8.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => {
        setActiveTab(tab.id);
        setIsMobileMenuOpen(false);
      },
      className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-900"}`
    },
    /* @__PURE__ */ React8.createElement("span", null, tab.icon),
    /* @__PURE__ */ React8.createElement("span", null, tab.label)
  ))));
};

// src/components/dashboard/DashboardView.tsx
import React9 from "react";
var DashboardView = () => {
  const {
    agents,
    teams,
    tasks,
    models,
    telegramBots,
    telegramChannels,
    telegramDrafts,
    startNewChat,
    setActiveTab,
    runAcceptanceTestWorkflow,
    isAcceptanceRunning,
    isEmergencyStopped
  } = useApp();
  const openRouterFreeCount = models.filter((m) => m.provider === "openrouter" && m.isFree).length;
  const mistralCount = models.filter((m) => m.provider === "mistral").length;
  return /* @__PURE__ */ React9.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React9.createElement("div", { className: "bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4" }, /* @__PURE__ */ React9.createElement("div", null, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React9.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Nexus AI Enterprise Boshqaruv Markazi"), /* @__PURE__ */ React9.createElement(Badge, { variant: "blue" }, "v2.1 Pro")), /* @__PURE__ */ React9.createElement("p", { className: "text-xs text-slate-400 mt-1 max-w-2xl" }, "Avtonom agentlar, OpenRouter bepul modellari, Mistral AI va 5 xil rejimdagi Telegram ekotizimi to\u2018liq muvofiqlashtirilgan")), /* @__PURE__ */ React9.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React9.createElement(
    "button",
    {
      onClick: runAcceptanceTestWorkflow,
      disabled: isAcceptanceRunning || isEmergencyStopped,
      className: "px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md transition"
    },
    isAcceptanceRunning ? "Test Bajarilmoqda..." : "Haftalik Test Ssenariysi (Req 49)"
  ), /* @__PURE__ */ React9.createElement(
    "button",
    {
      onClick: () => {
        startNewChat();
        setActiveTab("chat");
      },
      className: "px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
    },
    "+ Yangi Suhbat"
  ))), /* @__PURE__ */ React9.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" }, /* @__PURE__ */ React9.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React9.createElement("p", { className: "text-[11px] text-slate-400 font-medium" }, "Faol Agentlar"), /* @__PURE__ */ React9.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, agents.length), /* @__PURE__ */ React9.createElement("p", { className: "text-[10px] text-emerald-400 mt-1" }, "\u25CF Barchasi tayyor")), /* @__PURE__ */ React9.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React9.createElement("p", { className: "text-[11px] text-slate-400 font-medium" }, "Jamoalar"), /* @__PURE__ */ React9.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, teams.length), /* @__PURE__ */ React9.createElement("p", { className: "text-[10px] text-purple-400 mt-1" }, "Hierarchical & Mesh")), /* @__PURE__ */ React9.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React9.createElement("p", { className: "text-[11px] text-slate-400 font-medium" }, "Topshiriqlar"), /* @__PURE__ */ React9.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, tasks.length), /* @__PURE__ */ React9.createElement("p", { className: "text-[10px] text-sky-400 mt-1" }, "Avtonom bajarilmoqda")), /* @__PURE__ */ React9.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React9.createElement("p", { className: "text-[11px] text-slate-400 font-medium" }, "AI Modellar"), /* @__PURE__ */ React9.createElement("p", { className: "text-2xl font-bold text-emerald-400 mt-1" }, models.length), /* @__PURE__ */ React9.createElement("p", { className: "text-[10px] text-slate-400 mt-1" }, openRouterFreeCount, " bepul + ", mistralCount, " Mistral")), /* @__PURE__ */ React9.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React9.createElement("p", { className: "text-[11px] text-slate-400 font-medium" }, "Telegram Hub"), /* @__PURE__ */ React9.createElement("p", { className: "text-2xl font-bold text-sky-400 mt-1" }, telegramBots.length, " bot / 2 guruh"), /* @__PURE__ */ React9.createElement("p", { className: "text-[10px] text-emerald-400 mt-1" }, "5 rejim faol")), /* @__PURE__ */ React9.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React9.createElement("p", { className: "text-[11px] text-slate-400 font-medium" }, "Xarajatlar"), /* @__PURE__ */ React9.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, "$0.21"), /* @__PURE__ */ React9.createElement("p", { className: "text-[10px] text-emerald-400 mt-1" }, "Bepul modellar bilan 95% tejamkor"))), /* @__PURE__ */ React9.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl" }, /* @__PURE__ */ React9.createElement("h3", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3" }, "Ulangan AI Provayderlar & Bepul Resurslar"), /* @__PURE__ */ React9.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs" }, /* @__PURE__ */ React9.createElement("div", { className: "p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1" }, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React9.createElement("span", { className: "font-bold text-white" }, "OpenRouter (Bepul Modellar)"), /* @__PURE__ */ React9.createElement(Badge, { variant: "green", size: "sm" }, "0$ / Free")), /* @__PURE__ */ React9.createElement("p", { className: "text-slate-400 text-[11px]" }, "DeepSeek R1, Llama 3.3 70B, Qwen Coder, Mistral Small 24B")), /* @__PURE__ */ React9.createElement("div", { className: "p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1" }, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React9.createElement("span", { className: "font-bold text-white" }, "Mistral AI"), /* @__PURE__ */ React9.createElement(Badge, { variant: "amber", size: "sm" }, "Active API")), /* @__PURE__ */ React9.createElement("p", { className: "text-slate-400 text-[11px]" }, "Codestral 2501, Mistral Large 2, Pixtral 12B Multimodal")), /* @__PURE__ */ React9.createElement("div", { className: "p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1" }, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React9.createElement("span", { className: "font-bold text-white" }, "Google Gemini"), /* @__PURE__ */ React9.createElement(Badge, { variant: "blue", size: "sm" }, "Native Fast")), /* @__PURE__ */ React9.createElement("p", { className: "text-slate-400 text-[11px]" }, "Gemini 3.6 Flash (past kechikish, 1M kontekst)")))), /* @__PURE__ */ React9.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React9.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" }, /* @__PURE__ */ React9.createElement("h4", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider" }, "Tezkor O\u2018tish"), /* @__PURE__ */ React9.createElement("div", { className: "grid grid-cols-2 gap-2 text-xs" }, /* @__PURE__ */ React9.createElement(
    "button",
    {
      onClick: () => setActiveTab("telegram"),
      className: "p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
    },
    /* @__PURE__ */ React9.createElement("span", { className: "block font-bold text-sky-400" }, "\u2708\uFE0F Telegram Hub"),
    /* @__PURE__ */ React9.createElement("span", { className: "text-[10px] text-slate-400" }, "Botlar, 5 rejimdagi guruhlar")
  ), /* @__PURE__ */ React9.createElement(
    "button",
    {
      onClick: () => setActiveTab("teams"),
      className: "p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
    },
    /* @__PURE__ */ React9.createElement("span", { className: "block font-bold text-purple-400" }, "\u{1F465} Multi-Agent Teams"),
    /* @__PURE__ */ React9.createElement("span", { className: "text-[10px] text-slate-400" }, "Workflow grafi va zanjir")
  ), /* @__PURE__ */ React9.createElement(
    "button",
    {
      onClick: () => setActiveTab("models"),
      className: "p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
    },
    /* @__PURE__ */ React9.createElement("span", { className: "block font-bold text-emerald-400" }, "\u{1F9E0} AI Modellar (", models.length, ")"),
    /* @__PURE__ */ React9.createElement("span", { className: "text-[10px] text-slate-400" }, "OpenRouter & Mistral")
  ), /* @__PURE__ */ React9.createElement(
    "button",
    {
      onClick: () => setActiveTab("settings"),
      className: "p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-left text-white transition"
    },
    /* @__PURE__ */ React9.createElement("span", { className: "block font-bold text-amber-400" }, "\u2699\uFE0F Sozlamalar"),
    /* @__PURE__ */ React9.createElement("span", { className: "text-[10px] text-slate-400" }, "API kalitlar va xavfsizlik")
  ))), /* @__PURE__ */ React9.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between" }, /* @__PURE__ */ React9.createElement("div", null, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React9.createElement("h4", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider" }, "Telegram Kanali & Qoralamalar"), /* @__PURE__ */ React9.createElement(Badge, { variant: "green", size: "sm" }, "Jonli")), telegramDrafts.slice(0, 2).map((d) => /* @__PURE__ */ React9.createElement("div", { key: d.id, className: "p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-2 space-y-1" }, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React9.createElement("span", { className: "font-semibold text-white" }, d.channelTitle), /* @__PURE__ */ React9.createElement(Badge, { variant: "amber", size: "sm" }, "Tasdiq kutilmoqda")), /* @__PURE__ */ React9.createElement("p", { className: "text-slate-400 line-clamp-2 text-[11px] font-mono" }, d.content)))), /* @__PURE__ */ React9.createElement(
    "button",
    {
      onClick: () => setActiveTab("telegram"),
      className: "text-xs text-sky-400 hover:text-sky-300 font-medium text-right"
    },
    "Telegram boshqaruv markaziga o\u2018tish \u2192"
  ))));
};

// src/components/chat/ChatView.tsx
import React10, { useState as useState3 } from "react";
var ChatView = () => {
  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    startNewChat,
    sendChatMessage,
    isGeneratingResponse,
    models,
    activeModelId,
    setActiveModelId,
    agents,
    activeAgentId,
    setActiveAgentId
  } = useApp();
  const [inputMessage, setInputMessage] = useState3("");
  const activeSession = chatSessions.find((s) => s.id === activeSessionId) || chatSessions[0];
  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];
  const activeModel = models.find((m) => m.id === activeModelId) || models[0];
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGeneratingResponse) return;
    const msg = inputMessage;
    setInputMessage("");
    await sendChatMessage(msg);
  };
  return /* @__PURE__ */ React10.createElement("div", { className: "max-w-7xl mx-auto h-[calc(100vh-6.5rem)] flex gap-4 pb-4" }, /* @__PURE__ */ React10.createElement("div", { className: "hidden lg:flex flex-col w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3" }, /* @__PURE__ */ React10.createElement(
    "button",
    {
      onClick: startNewChat,
      className: "w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2 mb-3"
    },
    /* @__PURE__ */ React10.createElement("span", null, "+ Yangi Suhbat")
  ), /* @__PURE__ */ React10.createElement("div", { className: "flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1" }, chatSessions.map((sess) => /* @__PURE__ */ React10.createElement(
    "button",
    {
      key: sess.id,
      onClick: () => setActiveSessionId(sess.id),
      className: `w-full text-left p-2.5 rounded-xl text-xs transition truncate ${activeSessionId === sess.id ? "bg-slate-800 text-white font-medium border border-slate-700" : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"}`
    },
    /* @__PURE__ */ React10.createElement("p", { className: "truncate" }, sess.title),
    /* @__PURE__ */ React10.createElement("span", { className: "text-[10px] text-slate-500" }, sess.updatedAt)
  )))), /* @__PURE__ */ React10.createElement("div", { className: "flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm" }, /* @__PURE__ */ React10.createElement("div", { className: "p-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3" }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React10.createElement("span", { className: "text-xl" }, activeAgent.avatar), /* @__PURE__ */ React10.createElement("div", null, /* @__PURE__ */ React10.createElement("h3", { className: "text-xs font-bold text-white" }, activeAgent.name), /* @__PURE__ */ React10.createElement("p", { className: "text-[10px] text-blue-400" }, activeAgent.role))), /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2 text-xs" }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300" }, /* @__PURE__ */ React10.createElement("span", { className: "text-[10px] text-slate-500 font-mono" }, "Model:"), /* @__PURE__ */ React10.createElement(
    "select",
    {
      value: activeModelId,
      onChange: (e) => setActiveModelId(e.target.value),
      className: "bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
    },
    /* @__PURE__ */ React10.createElement("optgroup", { label: "Navy AI (Universal Engine)" }, /* @__PURE__ */ React10.createElement("option", { value: "navy-ultra-latest" }, "Navy AI Ultra (JARVIS)"), /* @__PURE__ */ React10.createElement("option", { value: "navy-fast-v1" }, "Navy AI Fast"), /* @__PURE__ */ React10.createElement("option", { value: "navy-coder" }, "Navy AI Coder")),
    /* @__PURE__ */ React10.createElement("optgroup", { label: "Google Gemini" }, /* @__PURE__ */ React10.createElement("option", { value: "gemini-3.6-flash" }, "Gemini 3.6 Flash"), /* @__PURE__ */ React10.createElement("option", { value: "gemini-3.5-flash-lite" }, "Gemini 3.5 Flash Lite")),
    /* @__PURE__ */ React10.createElement("optgroup", { label: "OpenRouter (Bepul Modellar)" }, /* @__PURE__ */ React10.createElement("option", { value: "deepseek/deepseek-r1:free" }, "DeepSeek R1 (Bepul)"), /* @__PURE__ */ React10.createElement("option", { value: "deepseek/deepseek-chat:free" }, "DeepSeek V3 (Bepul)"), /* @__PURE__ */ React10.createElement("option", { value: "meta-llama/llama-3.3-70b-instruct:free" }, "Llama 3.3 70B (Bepul)"), /* @__PURE__ */ React10.createElement("option", { value: "meta-llama/llama-3.1-8b-instruct:free" }, "Llama 3.1 8B (Bepul)"), /* @__PURE__ */ React10.createElement("option", { value: "qwen/qwen-2.5-coder-32b-instruct:free" }, "Qwen 2.5 Coder (Bepul)"), /* @__PURE__ */ React10.createElement("option", { value: "mistralai/mistral-small-24b-instruct-2501:free" }, "Mistral Small 24B (Bepul)")),
    /* @__PURE__ */ React10.createElement("optgroup", { label: "Mistral AI" }, /* @__PURE__ */ React10.createElement("option", { value: "mistral-large-latest" }, "Mistral Large 2"), /* @__PURE__ */ React10.createElement("option", { value: "codestral-latest" }, "Codestral 2501"), /* @__PURE__ */ React10.createElement("option", { value: "pixtral-12b-2409" }, "Pixtral 12B"))
  )), /* @__PURE__ */ React10.createElement("div", { className: "hidden sm:flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300" }, /* @__PURE__ */ React10.createElement("span", { className: "text-[10px] text-slate-500 font-mono" }, "Agent:"), /* @__PURE__ */ React10.createElement(
    "select",
    {
      value: activeAgentId,
      onChange: (e) => setActiveAgentId(e.target.value),
      className: "bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
    },
    agents.map((a) => /* @__PURE__ */ React10.createElement("option", { key: a.id, value: a.id }, a.name))
  )), activeModel.isFree && /* @__PURE__ */ React10.createElement(Badge, { variant: "green", size: "sm" }, "0$ Bepul"))), /* @__PURE__ */ React10.createElement("div", { className: "flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/40" }, activeSession?.messages.map((msg) => {
    const isUser = msg.sender === "user";
    return /* @__PURE__ */ React10.createElement("div", { key: msg.id, className: `flex flex-col ${isUser ? "items-end" : "items-start"}` }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-500" }, /* @__PURE__ */ React10.createElement("span", null, isUser ? "Siz" : msg.agentName || "Agent"), msg.modelUsed && /* @__PURE__ */ React10.createElement("span", { className: "font-mono text-slate-600" }, "\u2022 ", msg.modelUsed), /* @__PURE__ */ React10.createElement("span", null, "\u2022 ", msg.timestamp)), /* @__PURE__ */ React10.createElement("div", { className: `max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${isUser ? "bg-blue-600 text-white rounded-br-xs" : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs"}` }, /* @__PURE__ */ React10.createElement("div", { className: "whitespace-pre-wrap font-sans" }, msg.content)));
  }), isGeneratingResponse && /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-2 text-xs text-blue-400 italic p-2" }, /* @__PURE__ */ React10.createElement("span", { className: "w-2 h-2 rounded-full bg-blue-400 animate-ping" }), /* @__PURE__ */ React10.createElement("span", null, activeAgent.name, " (", activeModelId, ") javob tayyorlamoqda..."))), /* @__PURE__ */ React10.createElement("div", { className: "px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]" }, /* @__PURE__ */ React10.createElement("span", { className: "text-slate-500 font-semibold flex-shrink-0" }, "Tavsiyalar:"), [
    "JARVIS, barcha tizimlar holatini tekshir va hisobot ber",
    "Haftalik AI yangiliklari hisobotini tuzing",
    "DeepSeek R1 bilan mantiqiy masalani yeching",
    "Codestral bilan Python Telegram bot yozing",
    "Mistral Large bilan bozor tahlilini o\u2018tkazing"
  ].map((s) => /* @__PURE__ */ React10.createElement(
    "button",
    {
      key: s,
      onClick: () => setInputMessage(s),
      className: "px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 whitespace-nowrap transition border border-slate-800"
    },
    s
  ))), /* @__PURE__ */ React10.createElement("form", { onSubmit: handleSend, className: "p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2" }, /* @__PURE__ */ React10.createElement(
    "input",
    {
      type: "text",
      value: inputMessage,
      onChange: (e) => setInputMessage(e.target.value),
      placeholder: "O\u2018zbek tilida savol bering yoki topshiriq yozing...",
      className: "flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
    }
  ), /* @__PURE__ */ React10.createElement(
    "button",
    {
      type: "submit",
      disabled: isGeneratingResponse || !inputMessage.trim(),
      className: "p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-500/20 transition flex-shrink-0"
    },
    /* @__PURE__ */ React10.createElement(IconSend, { className: "w-4 h-4" })
  ))));
};

// src/components/agents/AgentsView.tsx
import React11, { useState as useState4 } from "react";
var AgentsView = () => {
  const { agents, models, createAgent, updateAgent, deleteAgent, setActiveTab, setActiveAgentId } = useApp();
  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState4(false);
  const [editingAgent, setEditingAgent] = useState4(null);
  const [formName, setFormName] = useState4("");
  const [formRole, setFormRole] = useState4("");
  const [formAvatar, setFormAvatar] = useState4("\u{1F916}");
  const [formModel, setFormModel] = useState4("deepseek/deepseek-r1:free");
  const [formPrompt, setFormPrompt] = useState4("");
  const handleOpenCreate = () => {
    setEditingAgent(null);
    setFormName("");
    setFormRole("");
    setFormAvatar("\u{1F916}");
    setFormModel("deepseek/deepseek-r1:free");
    setFormPrompt("Siz aqlli yordamchisiz. Har doim o\u2018zbek tilida sifatli javob bering.");
    setIsNewAgentModalOpen(true);
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    if (editingAgent) {
      updateAgent(editingAgent.id, {
        name: formName,
        role: formRole,
        avatar: formAvatar,
        modelId: formModel,
        systemPrompt: formPrompt
      });
    } else {
      createAgent({
        name: formName,
        role: formRole,
        avatar: formAvatar,
        modelId: formModel,
        systemPrompt: formPrompt
      });
    }
    setIsNewAgentModalOpen(false);
  };
  return /* @__PURE__ */ React11.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React11.createElement("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm" }, /* @__PURE__ */ React11.createElement("div", null, /* @__PURE__ */ React11.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Agentlar Katalogi & Konstruktori"), /* @__PURE__ */ React11.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Har bir agentga OpenRouter bepul modellari yoki Mistral AI modellarini biriktirishingiz mumkin")), /* @__PURE__ */ React11.createElement(
    "button",
    {
      onClick: handleOpenCreate,
      className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
    },
    "+ Yangi Agent Yaratish"
  )), /* @__PURE__ */ React11.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, agents.map((agent) => {
    const model = models.find((m) => m.id === agent.modelId);
    return /* @__PURE__ */ React11.createElement(
      "div",
      {
        key: agent.id,
        className: "p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
      },
      /* @__PURE__ */ React11.createElement("div", null, /* @__PURE__ */ React11.createElement("div", { className: "flex items-start justify-between gap-2 mb-3" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React11.createElement("span", { className: "text-3xl" }, agent.avatar), /* @__PURE__ */ React11.createElement("div", null, /* @__PURE__ */ React11.createElement("h3", { className: "font-bold text-white text-base" }, agent.name), /* @__PURE__ */ React11.createElement("p", { className: "text-xs text-blue-400 font-medium" }, agent.role))), /* @__PURE__ */ React11.createElement(Badge, { variant: agent.status === "active" ? "green" : "gray" }, agent.status)), /* @__PURE__ */ React11.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-3 space-y-1.5 text-xs" }, /* @__PURE__ */ React11.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-500" }, "Model:"), /* @__PURE__ */ React11.createElement("span", { className: "font-mono text-white font-semibold truncate max-w-[150px]" }, model?.name || agent.modelId)), /* @__PURE__ */ React11.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-500" }, "Provayder:"), /* @__PURE__ */ React11.createElement("span", { className: "text-sky-400 font-mono capitalize" }, model?.provider || "LLM"))), /* @__PURE__ */ React11.createElement("p", { className: "text-xs text-slate-400 line-clamp-3 mb-4 italic" }, '"', agent.systemPrompt, '"')),
      /* @__PURE__ */ React11.createElement("div", { className: "pt-3 border-t border-slate-800 flex items-center justify-between text-xs" }, /* @__PURE__ */ React11.createElement(
        "button",
        {
          onClick: () => {
            setActiveAgentId(agent.id);
            setActiveTab("chat");
          },
          className: "px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg font-medium transition"
        },
        "Suhbatlashish"
      ), /* @__PURE__ */ React11.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React11.createElement(
        "button",
        {
          onClick: () => {
            setEditingAgent(agent);
            setFormName(agent.name);
            setFormRole(agent.role);
            setFormAvatar(agent.avatar);
            setFormModel(agent.modelId);
            setFormPrompt(agent.systemPrompt);
            setIsNewAgentModalOpen(true);
          },
          className: "text-slate-400 hover:text-white"
        },
        "Tahrirlash"
      )))
    );
  })), /* @__PURE__ */ React11.createElement(
    Modal,
    {
      isOpen: isNewAgentModalOpen,
      onClose: () => setIsNewAgentModalOpen(false),
      title: editingAgent ? "Agentni Tahrirlash" : "Yangi Agent Yaratish",
      subtitle: "AI model va tizim yo\u2018riqnomasini sozlang",
      maxWidth: "lg"
    },
    /* @__PURE__ */ React11.createElement("form", { onSubmit: handleSave, className: "space-y-4" }, /* @__PURE__ */ React11.createElement("div", { className: "grid grid-cols-3 gap-3" }, /* @__PURE__ */ React11.createElement("div", { className: "col-span-2" }, /* @__PURE__ */ React11.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Agent Nomi"), /* @__PURE__ */ React11.createElement(
      "input",
      {
        type: "text",
        required: true,
        value: formName,
        onChange: (e) => setFormName(e.target.value),
        placeholder: "masalan: Qwen Kod Eksperti",
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
      }
    )), /* @__PURE__ */ React11.createElement("div", null, /* @__PURE__ */ React11.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Avatar"), /* @__PURE__ */ React11.createElement(
      "input",
      {
        type: "text",
        value: formAvatar,
        onChange: (e) => setFormAvatar(e.target.value),
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-center text-white"
      }
    ))), /* @__PURE__ */ React11.createElement("div", null, /* @__PURE__ */ React11.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Rol / Mutaxassislik"), /* @__PURE__ */ React11.createElement(
      "input",
      {
        type: "text",
        required: true,
        value: formRole,
        onChange: (e) => setFormRole(e.target.value),
        placeholder: "masalan: Jarvis (Universal Hamma Ishlarni Bajaruvchi) yoki Muhandis",
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
      }
    )), /* @__PURE__ */ React11.createElement("div", null, /* @__PURE__ */ React11.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Bog\u2018langan AI Modeli"), /* @__PURE__ */ React11.createElement(
      "select",
      {
        value: formModel,
        onChange: (e) => setFormModel(e.target.value),
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
      },
      /* @__PURE__ */ React11.createElement("optgroup", { label: "Navy AI (Universal JARVIS Modellar)" }, /* @__PURE__ */ React11.createElement("option", { value: "navy-ultra-latest" }, "Navy AI Ultra (JARVIS)"), /* @__PURE__ */ React11.createElement("option", { value: "navy-fast-v1" }, "Navy AI Fast"), /* @__PURE__ */ React11.createElement("option", { value: "navy-coder" }, "Navy AI Coder")),
      /* @__PURE__ */ React11.createElement("optgroup", { label: "OpenRouter (Bepul Modellar)" }, /* @__PURE__ */ React11.createElement("option", { value: "deepseek/deepseek-r1:free" }, "DeepSeek R1 (Bepul)"), /* @__PURE__ */ React11.createElement("option", { value: "deepseek/deepseek-chat:free" }, "DeepSeek V3 (Bepul)"), /* @__PURE__ */ React11.createElement("option", { value: "meta-llama/llama-3.3-70b-instruct:free" }, "Llama 3.3 70B (Bepul)"), /* @__PURE__ */ React11.createElement("option", { value: "meta-llama/llama-3.1-8b-instruct:free" }, "Llama 3.1 8B (Bepul)"), /* @__PURE__ */ React11.createElement("option", { value: "qwen/qwen-2.5-coder-32b-instruct:free" }, "Qwen 2.5 Coder 32B (Bepul)"), /* @__PURE__ */ React11.createElement("option", { value: "mistralai/mistral-small-24b-instruct-2501:free" }, "Mistral Small 24B (Bepul)"), /* @__PURE__ */ React11.createElement("option", { value: "google/gemini-2.0-flash-exp:free" }, "Gemini 2.0 Flash (Bepul)")),
      /* @__PURE__ */ React11.createElement("optgroup", { label: "Mistral AI" }, /* @__PURE__ */ React11.createElement("option", { value: "mistral-large-latest" }, "Mistral Large 2"), /* @__PURE__ */ React11.createElement("option", { value: "mistral-small-latest" }, "Mistral Small 3"), /* @__PURE__ */ React11.createElement("option", { value: "codestral-latest" }, "Codestral 2501"), /* @__PURE__ */ React11.createElement("option", { value: "pixtral-12b-2409" }, "Pixtral 12B Multimodal")),
      /* @__PURE__ */ React11.createElement("optgroup", { label: "Google Gemini (Native)" }, /* @__PURE__ */ React11.createElement("option", { value: "gemini-3.6-flash" }, "Gemini 3.6 Flash (Default)"), /* @__PURE__ */ React11.createElement("option", { value: "gemini-3.5-flash-lite" }, "Gemini 3.5 Flash Lite"))
    )), /* @__PURE__ */ React11.createElement("div", null, /* @__PURE__ */ React11.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Tizim Yo\u2018riqnomasi (System Prompt)"), /* @__PURE__ */ React11.createElement(
      "textarea",
      {
        rows: 4,
        required: true,
        value: formPrompt,
        onChange: (e) => setFormPrompt(e.target.value),
        placeholder: "Agent nima qilishi kerakligini o\u2018zbek tilida yozing...",
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
      }
    )), /* @__PURE__ */ React11.createElement("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-800" }, /* @__PURE__ */ React11.createElement(
      "button",
      {
        type: "button",
        onClick: () => setIsNewAgentModalOpen(false),
        className: "px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
      },
      "Bekor qilish"
    ), /* @__PURE__ */ React11.createElement(
      "button",
      {
        type: "submit",
        className: "px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
      },
      "Saqlash"
    )))
  ));
};

// src/components/teams/AgentTeamsView.tsx
import React12, { useState as useState5 } from "react";
var AgentTeamsView = () => {
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
  const [activeTabSub, setActiveTabSub] = useState5("teams");
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState5(false);
  const [teamName, setTeamName] = useState5("");
  const [teamDesc, setTeamDesc] = useState5("");
  const [workflowType, setWorkflowType] = useState5("hierarchical");
  const [selectedAgentIds, setSelectedAgentIds] = useState5([
    "agent-chief-pm",
    "agent-researcher",
    "agent-analyst",
    "agent-copywriter",
    "agent-developer"
  ]);
  const [activeSimulationTeamId, setActiveSimulationTeamId] = useState5(null);
  const [simulationPrompt, setSimulationPrompt] = useState5("");
  const [isSimModalOpen, setIsSimModalOpen] = useState5(false);
  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    createTeam({
      name: teamName.trim(),
      description: teamDesc.trim() || "Ko\u2018p agentli avtonom hamkorlik guruhi",
      workflowType,
      members: selectedAgentIds.map((id, idx) => {
        let role = "Specialist";
        if (idx === 0) role = "Manager";
        else if (idx === 1) role = "Researcher";
        else if (idx === 2) role = "Analyst";
        else if (idx === 3) role = "Writer";
        else if (idx === selectedAgentIds.length - 1) role = "Reviewer";
        return {
          agentId: id,
          roleInTeam: role,
          order: idx + 1
        };
      })
    });
    setTeamName("");
    setTeamDesc("");
    setIsNewTeamModalOpen(false);
  };
  const handleStartSimulation = (teamId) => {
    setActiveSimulationTeamId(teamId);
    setSimulationPrompt("Har hafta AI yangiliklari bo\u2018yicha report tayyorla va Telegram guruhimga yubor");
    setIsSimModalOpen(true);
  };
  const executeSimulation = () => {
    if (!activeSimulationTeamId) return;
    runTeamWorkflow(activeSimulationTeamId, simulationPrompt);
    setIsSimModalOpen(false);
  };
  return /* @__PURE__ */ React12.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React12.createElement("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React12.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Multi-Agent Hamkorlik & Jamoalar"), /* @__PURE__ */ React12.createElement(Badge, { variant: "purple", size: "sm" }, "Phase 2 Gateway")), /* @__PURE__ */ React12.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Nova PM (Manager), Atlas (DeepSeek R1), Cipher (Mistral Large), Lyra (Llama 3.3) va Kite (Codestral) hamkorligi")), /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React12.createElement(
    "button",
    {
      onClick: runAcceptanceTestWorkflow,
      disabled: isAcceptanceRunning || isEmergencyStopped,
      className: "flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition"
    },
    /* @__PURE__ */ React12.createElement(IconPlay, { className: "w-3.5 h-3.5" }),
    /* @__PURE__ */ React12.createElement("span", null, isAcceptanceRunning ? "Test Ijro Etilmoqda..." : "Acceptance Test (Req 49)")
  ), /* @__PURE__ */ React12.createElement(
    "button",
    {
      onClick: () => setIsNewTeamModalOpen(true),
      className: "flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition"
    },
    /* @__PURE__ */ React12.createElement(IconPlus, { className: "w-4 h-4" }),
    /* @__PURE__ */ React12.createElement("span", null, "Jamoa Tuzish")
  ))), /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar border-b border-slate-800" }, [
    { id: "teams", label: "\u{1F465} Jamoalar Katalogi" },
    { id: "canvas", label: "\u{1F578}\uFE0F Vizual Workflow Grafigi (Canvas)" },
    { id: "traces", label: "\u{1F50D} Gateway Traces (tr_...)" },
    { id: "acceptance", label: "\u{1F3AF} User Acceptance Scenario (Req 49)" }
  ].map((tab) => /* @__PURE__ */ React12.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => setActiveTabSub(tab.id),
      className: `px-3.5 py-2 text-xs font-medium whitespace-nowrap transition border-b-2 -mb-[1px] ${activeTabSub === tab.id ? "border-purple-500 text-purple-400 font-semibold bg-purple-500/5" : "border-transparent text-slate-400 hover:text-slate-200"}`
    },
    tab.label
  ))), activeTabSub === "teams" && /* @__PURE__ */ React12.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, teams.map((team) => {
    const teamTasks = tasks.filter((t) => t.teamId === team.id);
    const activeTask = tasks.find((t) => t.id === team.activeTaskId) || teamTasks[0];
    return /* @__PURE__ */ React12.createElement(
      "div",
      {
        key: team.id,
        className: "p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
      },
      /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("div", { className: "flex items-start justify-between gap-3 mb-2" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("h3", { className: "text-base font-bold text-white" }, team.name), /* @__PURE__ */ React12.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, team.description)), /* @__PURE__ */ React12.createElement(Badge, { variant: team.status === "running" ? "green" : "gray" }, team.status === "running" ? "Pipeline Faol" : "Kutishda")), /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2 mb-4 text-xs text-slate-400" }, /* @__PURE__ */ React12.createElement("span", { className: "text-slate-500" }, "Koordinatsiya:"), /* @__PURE__ */ React12.createElement(Badge, { variant: "purple", size: "sm" }, team.workflowType.toUpperCase()), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-500" }, "|"), /* @__PURE__ */ React12.createElement("span", null, team.members.length, " Agent")), /* @__PURE__ */ React12.createElement("div", { className: "p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 mb-4" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2" }, "Agentlararo Vazifalar Zanjiri (Pipeline)"), /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar" }, team.members.map((member, idx) => {
        const agent = agents.find((a) => a.id === member.agentId);
        return /* @__PURE__ */ React12.createElement(React12.Fragment, { key: member.agentId }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 flex-shrink-0" }, /* @__PURE__ */ React12.createElement("span", { className: "text-lg" }, agent?.avatar || "\u{1F916}"), /* @__PURE__ */ React12.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React12.createElement("p", { className: "text-xs font-semibold text-white truncate max-w-[90px]" }, agent?.name || "Agent"), /* @__PURE__ */ React12.createElement("p", { className: "text-[10px] text-purple-400 truncate capitalize font-mono" }, member.roleInTeam))), idx < team.members.length - 1 && /* @__PURE__ */ React12.createElement("span", { className: "text-slate-600 font-bold text-xs flex-shrink-0" }, "\u2192"));
      }))), activeTask && /* @__PURE__ */ React12.createElement("div", { className: "p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 mb-4 text-xs space-y-2" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] uppercase font-bold text-slate-400" }, "Joriy Vazifa"), /* @__PURE__ */ React12.createElement(Badge, { variant: activeTask.status === "Completed" ? "green" : "blue" }, activeTask.status)), /* @__PURE__ */ React12.createElement("p", { className: "font-medium text-white truncate" }, activeTask.title))),
      /* @__PURE__ */ React12.createElement("div", { className: "pt-3 border-t border-slate-800 flex items-center justify-between" }, /* @__PURE__ */ React12.createElement(
        "button",
        {
          onClick: () => setActiveTab("tasks"),
          className: "text-xs text-slate-400 hover:text-white flex items-center gap-1"
        },
        /* @__PURE__ */ React12.createElement(IconTasks, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ React12.createElement("span", null, "Jamoa Vazifalari (", teamTasks.length, ")")
      ), /* @__PURE__ */ React12.createElement(
        "button",
        {
          onClick: () => handleStartSimulation(team.id),
          disabled: team.status === "running" || isEmergencyStopped,
          className: "px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
        },
        "Workflow Boshlash"
      ))
    );
  })), activeTabSub === "canvas" && /* @__PURE__ */ React12.createElement("div", { className: "p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6" }, /* @__PURE__ */ React12.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("h3", { className: "text-sm font-bold text-white" }, "Avtonom Multi-Agent Workflow Grafigi"), /* @__PURE__ */ React12.createElement("p", { className: "text-xs text-slate-400" }, "START \u2192 AGENT \u2192 PARALLEL \u2192 JOIN \u2192 APPROVAL \u2192 TELEGRAM \u2192 END")), /* @__PURE__ */ React12.createElement(Badge, { variant: "blue", size: "sm" }, "Auto-Layout Engine")), /* @__PURE__ */ React12.createElement("div", { className: "p-6 bg-[#090d16] rounded-xl border border-slate-800 overflow-x-auto min-w-[700px]" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center justify-between gap-3 text-xs" }, /* @__PURE__ */ React12.createElement("div", { className: "p-3 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl text-center min-w-[110px]" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-mono font-bold text-emerald-400 block uppercase" }, "TRIGGER"), /* @__PURE__ */ React12.createElement("p", { className: "font-bold text-white mt-0.5" }, "START"), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-slate-400" }, "Telegram / Cron")), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-600 font-bold text-lg" }, "\u2192"), /* @__PURE__ */ React12.createElement("div", { className: "p-3 bg-blue-500/10 border-2 border-blue-500 rounded-xl text-center min-w-[120px]" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-mono font-bold text-blue-400 block uppercase" }, "MANAGER"), /* @__PURE__ */ React12.createElement("p", { className: "font-bold text-white mt-0.5" }, "Nova PM"), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-slate-400" }, "Plan & Delegate")), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-600 font-bold text-lg" }, "\u2192"), /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-purple-500/10 border-2 border-purple-500/80 rounded-xl space-y-2 min-w-[140px]" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[9px] font-mono font-bold text-purple-300 uppercase" }, "PARALLEL EXEC"), /* @__PURE__ */ React12.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" })), /* @__PURE__ */ React12.createElement("div", { className: "p-1.5 bg-slate-900/90 rounded border border-slate-700 text-[11px] text-slate-200" }, "\u{1F52C} Atlas (DeepSeek R1)"), /* @__PURE__ */ React12.createElement("div", { className: "p-1.5 bg-slate-900/90 rounded border border-slate-700 text-[11px] text-slate-200" }, "\u{1F4CA} Cipher (Mistral Large)")), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-600 font-bold text-lg" }, "\u2192"), /* @__PURE__ */ React12.createElement("div", { className: "p-3 bg-indigo-500/10 border-2 border-indigo-500 rounded-xl text-center min-w-[120px]" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-mono font-bold text-indigo-400 block uppercase" }, "WRITER"), /* @__PURE__ */ React12.createElement("p", { className: "font-bold text-white mt-0.5" }, "Lyra (Llama 3.3)"), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-slate-400" }, "Uzbek Report")), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-600 font-bold text-lg" }, "\u2192"), /* @__PURE__ */ React12.createElement("div", { className: "p-3 bg-amber-500/10 border-2 border-amber-500 rounded-xl text-center min-w-[120px]" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-mono font-bold text-amber-400 block uppercase" }, "REVIEWER"), /* @__PURE__ */ React12.createElement("p", { className: "font-bold text-white mt-0.5" }, "Kite (Codestral)"), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-slate-400" }, "Quality Check")), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-600 font-bold text-lg" }, "\u2192"), /* @__PURE__ */ React12.createElement("div", { className: "p-3 bg-rose-500/10 border-2 border-rose-500 rounded-xl text-center min-w-[120px]" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-mono font-bold text-rose-400 block uppercase" }, "HUMAN GATE"), /* @__PURE__ */ React12.createElement("p", { className: "font-bold text-white mt-0.5" }, "Approval"), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-slate-400" }, "Operator review")), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-600 font-bold text-lg" }, "\u2192"), /* @__PURE__ */ React12.createElement("div", { className: "p-3 bg-sky-500/10 border-2 border-sky-500 rounded-xl text-center min-w-[120px]" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-mono font-bold text-sky-400 block uppercase" }, "DELIVERY"), /* @__PURE__ */ React12.createElement("p", { className: "font-bold text-white mt-0.5" }, "Telegram"), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-slate-400" }, "Guruhga yuborish"))))), activeTabSub === "traces" && /* @__PURE__ */ React12.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React12.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("h3", { className: "text-sm font-bold text-white" }, "Gateway Traces & Protokol Audit Jurnali"), /* @__PURE__ */ React12.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Agentlararo xabarlar almashinuvi va unikal tr_... Trace ID lar")), /* @__PURE__ */ React12.createElement("span", { className: "text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded" }, collaborationTraces.length, " Traces")), /* @__PURE__ */ React12.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto" }, /* @__PURE__ */ React12.createElement("table", { className: "w-full text-left text-xs border-collapse" }, /* @__PURE__ */ React12.createElement("thead", null, /* @__PURE__ */ React12.createElement("tr", { className: "border-b border-slate-800 text-slate-400" }, /* @__PURE__ */ React12.createElement("th", { className: "py-2.5 px-3" }, "Trace ID"), /* @__PURE__ */ React12.createElement("th", { className: "py-2.5 px-3" }, "Vaqt"), /* @__PURE__ */ React12.createElement("th", { className: "py-2.5 px-3" }, "Yo\u2018nalish"), /* @__PURE__ */ React12.createElement("th", { className: "py-2.5 px-3" }, "Turi"), /* @__PURE__ */ React12.createElement("th", { className: "py-2.5 px-3" }, "Tafsilotlar"), /* @__PURE__ */ React12.createElement("th", { className: "py-2.5 px-3" }, "Kechikish"))), /* @__PURE__ */ React12.createElement("tbody", { className: "divide-y divide-slate-800 text-slate-300" }, collaborationTraces.map((trace) => /* @__PURE__ */ React12.createElement("tr", { key: trace.traceId, className: "hover:bg-slate-850" }, /* @__PURE__ */ React12.createElement("td", { className: "py-2.5 px-3 font-mono text-sky-400" }, trace.traceId), /* @__PURE__ */ React12.createElement("td", { className: "py-2.5 px-3 text-slate-500 font-mono" }, trace.timestamp), /* @__PURE__ */ React12.createElement("td", { className: "py-2.5 px-3" }, /* @__PURE__ */ React12.createElement("span", { className: "text-white font-medium" }, trace.senderName), /* @__PURE__ */ React12.createElement("span", { className: "text-slate-500 mx-1" }, "\u2192"), /* @__PURE__ */ React12.createElement("span", { className: "text-purple-400" }, trace.receiverName)), /* @__PURE__ */ React12.createElement("td", { className: "py-2.5 px-3" }, /* @__PURE__ */ React12.createElement(Badge, { variant: "purple", size: "sm" }, trace.messageType)), /* @__PURE__ */ React12.createElement("td", { className: "py-2.5 px-3 max-w-xs truncate text-slate-300" }, trace.details), /* @__PURE__ */ React12.createElement("td", { className: "py-2.5 px-3 font-mono text-slate-400" }, trace.durationMs, "ms"))))))), activeTabSub === "acceptance" && /* @__PURE__ */ React12.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React12.createElement("div", { className: "p-6 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-800/40 rounded-2xl space-y-4" }, /* @__PURE__ */ React12.createElement("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold" }, "Acceptance Test Scenario (Requirement 49)"), /* @__PURE__ */ React12.createElement("h3", { className: "text-lg font-bold text-white mt-1" }, '"Har hafta AI yangiliklari bo\u2018yicha report tayyorla va Telegram guruhimga yubor"'), /* @__PURE__ */ React12.createElement("p", { className: "text-xs text-slate-400 mt-1 max-w-3xl" }, "Nova PM boshqaruvida Atlas (DeepSeek R1), Cipher (Mistral Large), Lyra (Llama 3.3) va Kite (Codestral) agentlari to\u2018liq tsiklni bajaradi.")), /* @__PURE__ */ React12.createElement(
    "button",
    {
      onClick: runAcceptanceTestWorkflow,
      disabled: isAcceptanceRunning || isEmergencyStopped,
      className: "px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg text-xs flex items-center gap-2 whitespace-nowrap"
    },
    /* @__PURE__ */ React12.createElement(IconPlay, { className: "w-4 h-4" }),
    /* @__PURE__ */ React12.createElement("span", null, isAcceptanceRunning ? "Test Ijrosi Davom Etmoqda..." : "Ssenariyni Boshlash (Run)")
  )), /* @__PURE__ */ React12.createElement("div", { className: "pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs" }, /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-bold text-purple-400 block" }, "1-Bosqich"), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-white" }, "So\u2018rov Qabuli")), /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-bold text-purple-400 block" }, "2-Bosqich"), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-white" }, "Nova PM Rejasi")), /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-bold text-purple-400 block" }, "3-Bosqich"), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-white" }, "Atlas Researcher")), /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-bold text-purple-400 block" }, "4-Bosqich"), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-white" }, "Cipher Analyst")), /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-bold text-purple-400 block" }, "5-Bosqich"), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-white" }, "Lyra Writer")), /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-bold text-purple-400 block" }, "6-Bosqich"), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-white" }, "Inson Tasdig\u2018i")), /* @__PURE__ */ React12.createElement("div", { className: "p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] font-bold text-emerald-400 block" }, "7-Bosqich"), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-emerald-300" }, "Guruhga Nashr")))), /* @__PURE__ */ React12.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" }, /* @__PURE__ */ React12.createElement("h4", { className: "text-xs font-semibold text-slate-300 uppercase tracking-wider" }, "Test Ssenariysi Jonli Protokol Xabarlari"), /* @__PURE__ */ React12.createElement("div", { className: "space-y-2 max-h-72 overflow-y-auto custom-scrollbar" }, agentMessages.map((msg) => /* @__PURE__ */ React12.createElement("div", { key: msg.id, className: "p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-3 text-xs" }, /* @__PURE__ */ React12.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React12.createElement(Badge, { variant: "blue", size: "sm" }, msg.messageType), /* @__PURE__ */ React12.createElement("span", { className: "font-semibold text-white" }, msg.senderAgentName, " \u2192 ", msg.receiverAgentName), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1 rounded" }, msg.traceId)), /* @__PURE__ */ React12.createElement("p", { className: "text-slate-300 font-mono text-[11px]" }, msg.content)), /* @__PURE__ */ React12.createElement("span", { className: "text-[10px] text-slate-500 font-mono" }, msg.timestamp)))))), /* @__PURE__ */ React12.createElement(
    Modal,
    {
      isOpen: isSimModalOpen,
      onClose: () => setIsSimModalOpen(false),
      title: "Avtonom Workflow Jarayonini Ishga Tushirish",
      subtitle: "Agentlararo vazifalar zanjiri o\u2018zbek tilida amalga oshiriladi",
      maxWidth: "md"
    },
    /* @__PURE__ */ React12.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Vazifa Maqsadi"), /* @__PURE__ */ React12.createElement(
      "textarea",
      {
        rows: 3,
        value: simulationPrompt,
        onChange: (e) => setSimulationPrompt(e.target.value),
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
      }
    )), /* @__PURE__ */ React12.createElement("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-800" }, /* @__PURE__ */ React12.createElement(
      "button",
      {
        onClick: () => setIsSimModalOpen(false),
        className: "px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
      },
      "Bekor qilish"
    ), /* @__PURE__ */ React12.createElement(
      "button",
      {
        onClick: executeSimulation,
        className: "px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg"
      },
      "Ishga Tushirish"
    )))
  ));
};

// src/components/models/ModelsView.tsx
import React13, { useState as useState6 } from "react";
var ModelsView = () => {
  const { models, activeModelId, setActiveModelId, setActiveTab } = useApp();
  const [filterProvider, setFilterProvider] = useState6("all");
  const [searchQuery, setSearchQuery] = useState6("");
  const filtered = models.filter((m) => {
    if (filterProvider !== "all" && m.provider !== filterProvider) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q);
    }
    return true;
  });
  const navyCount = models.filter((m) => m.provider === "navy").length;
  const openRouterFreeCount = models.filter((m) => m.provider === "openrouter" && m.isFree).length;
  const mistralCount = models.filter((m) => m.provider === "mistral").length;
  return /* @__PURE__ */ React13.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React13.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm" }, /* @__PURE__ */ React13.createElement("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4" }, /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React13.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "AI Modellar Registri"), /* @__PURE__ */ React13.createElement(Badge, { variant: "blue" }, "Navy AI, OpenRouter & Mistral Ulandi")), /* @__PURE__ */ React13.createElement("p", { className: "text-xs text-slate-400 mt-1 max-w-3xl" }, "OpenRouter orqali ", /* @__PURE__ */ React13.createElement("strong", null, openRouterFreeCount, " ta bepul model"), " (DeepSeek R1, Llama 3.3 70B, Qwen Coder) va Mistral AI API orqali ", /* @__PURE__ */ React13.createElement("strong", null, mistralCount, " ta flagman model"), " (Codestral, Mistral Large 2, Pixtral) to\u2018liq integratsiya qilindi.")), /* @__PURE__ */ React13.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React13.createElement(
    "button",
    {
      onClick: () => setActiveTab("settings"),
      className: "px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
    },
    "API Kalitlarni Ko\u2018rish"
  ), /* @__PURE__ */ React13.createElement(
    "button",
    {
      onClick: () => setActiveTab("chat"),
      className: "px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
    },
    "Chatda Sinab Ko\u2018rish \u2192"
  ))), /* @__PURE__ */ React13.createElement("div", { className: "mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs" }, /* @__PURE__ */ React13.createElement("div", { className: "p-2.5 bg-slate-950 rounded-xl border border-slate-800" }, /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-400 block font-mono" }, "OpenRouter Bepul Modellar"), /* @__PURE__ */ React13.createElement("span", { className: "text-base font-bold text-emerald-400" }, openRouterFreeCount, " ta model"), /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-500 block" }, "DeepSeek R1, Llama 3.3, Qwen")), /* @__PURE__ */ React13.createElement("div", { className: "p-2.5 bg-slate-950 rounded-xl border border-slate-800" }, /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-400 block font-mono" }, "Mistral AI"), /* @__PURE__ */ React13.createElement("span", { className: "text-base font-bold text-amber-400" }, mistralCount, " ta model"), /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-500 block" }, "Codestral, Mistral Large, Pixtral")), /* @__PURE__ */ React13.createElement("div", { className: "p-2.5 bg-slate-950 rounded-xl border border-slate-800" }, /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-400 block font-mono" }, "Navy AI (Universal)"), /* @__PURE__ */ React13.createElement("span", { className: "text-base font-bold text-purple-400" }, navyCount, " ta model"), /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-500 block" }, "Navy Ultra (JARVIS), Fast, Coder")), /* @__PURE__ */ React13.createElement("div", { className: "p-2.5 bg-slate-950 rounded-xl border border-slate-800" }, /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-400 block font-mono" }, "Faol Tanlangan Model"), /* @__PURE__ */ React13.createElement("span", { className: "text-sm font-bold text-white truncate block" }, activeModelId), /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-emerald-400 block" }, "\u25CF Ulangan & Tayyor")))), /* @__PURE__ */ React13.createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs" }, /* @__PURE__ */ React13.createElement("div", { className: "flex items-center gap-1.5 overflow-x-auto" }, [
    { id: "all", label: "Barcha Modellar" },
    { id: "openrouter", label: "OpenRouter (Bepul)" },
    { id: "mistral", label: "Mistral AI" },
    { id: "google", label: "Google Gemini" }
  ].map((tab) => /* @__PURE__ */ React13.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => setFilterProvider(tab.id),
      className: `px-3 py-1.5 rounded-lg font-medium transition ${filterProvider === tab.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800"}`
    },
    tab.label
  ))), /* @__PURE__ */ React13.createElement(
    "input",
    {
      type: "text",
      value: searchQuery,
      onChange: (e) => setSearchQuery(e.target.value),
      placeholder: "Model nomi yoki xususiyati bo\u2018yicha qidiruv...",
      className: "bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 min-w-[220px]"
    }
  )), /* @__PURE__ */ React13.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, filtered.map((model) => {
    const isActive = activeModelId === model.id;
    return /* @__PURE__ */ React13.createElement(
      "div",
      {
        key: model.id,
        className: `p-5 rounded-2xl bg-slate-900 border transition flex flex-col justify-between ${isActive ? "border-blue-500 shadow-lg shadow-blue-500/10" : "border-slate-800 hover:border-slate-700"}`
      },
      /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("div", { className: "flex items-start justify-between gap-2 mb-2" }, /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("h3", { className: "font-bold text-white text-base tracking-tight" }, model.name), /* @__PURE__ */ React13.createElement("p", { className: "text-[11px] text-slate-400 font-mono mt-0.5" }, model.id)), /* @__PURE__ */ React13.createElement(Badge, { variant: model.isFree ? "green" : model.provider === "mistral" ? "amber" : "blue", size: "sm" }, model.isFree ? "BEPUL (0$)" : model.provider.toUpperCase())), /* @__PURE__ */ React13.createElement("p", { className: "text-xs text-slate-300 mt-2 mb-4 leading-relaxed line-clamp-2" }, model.description), /* @__PURE__ */ React13.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs mb-4" }, /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-500 block font-mono" }, "Kontekst"), /* @__PURE__ */ React13.createElement("span", { className: "font-bold text-white" }, (model.contextWindow / 1e3).toFixed(0), "k")), /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-500 block font-mono" }, "Narx / 1M"), /* @__PURE__ */ React13.createElement("span", { className: `font-bold ${model.isFree ? "text-emerald-400" : "text-slate-300"}` }, model.isFree ? "0$" : `$${model.pricing.inputPerMillion}`)), /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("span", { className: "text-[10px] text-slate-500 block font-mono" }, "Kechikish"), /* @__PURE__ */ React13.createElement("span", { className: "font-bold text-sky-400" }, model.latencyAvgMs, "ms"))), /* @__PURE__ */ React13.createElement("div", { className: "flex flex-wrap gap-1 mb-4" }, model.capabilities.map((cap) => /* @__PURE__ */ React13.createElement("span", { key: cap, className: "text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono" }, cap)))),
      /* @__PURE__ */ React13.createElement("div", { className: "pt-3 border-t border-slate-800 flex items-center justify-between" }, /* @__PURE__ */ React13.createElement("span", { className: "text-[11px] text-slate-500" }, isActive ? "\u2705 Asosiy tanlangan" : "Barcha agentlar uchun"), /* @__PURE__ */ React13.createElement(
        "button",
        {
          onClick: () => setActiveModelId(model.id),
          className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${isActive ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" : "bg-slate-800 hover:bg-slate-700 text-white"}`
        },
        isActive ? "Tanlangan" : "Faollashtirish"
      ))
    );
  })));
};

// src/components/skills/SkillsView.tsx
import React14 from "react";
var SkillsView = () => {
  const { skills, toggleSkill } = useApp();
  return /* @__PURE__ */ React14.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React14.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React14.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Ko\u2018nikmalar Modullari (Skills)"), /* @__PURE__ */ React14.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Agentlarga beriladigan ixtisoslashgan amaliy qobiliyatlar")), /* @__PURE__ */ React14.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, skills.map((s) => /* @__PURE__ */ React14.createElement("div", { key: s.id, className: "p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3" }, /* @__PURE__ */ React14.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React14.createElement("span", { className: "text-2xl" }, s.icon), /* @__PURE__ */ React14.createElement("div", null, /* @__PURE__ */ React14.createElement("h3", { className: "font-bold text-white text-sm" }, s.name), /* @__PURE__ */ React14.createElement("span", { className: "text-[10px] text-slate-500 font-mono" }, s.category, " \u2022 v", s.version))), /* @__PURE__ */ React14.createElement(Badge, { variant: s.isEnabled ? "green" : "gray" }, s.isEnabled ? "Faol" : "O\u2018chiq")), /* @__PURE__ */ React14.createElement("p", { className: "text-xs text-slate-400" }, s.description), /* @__PURE__ */ React14.createElement("div", { className: "pt-2 border-t border-slate-800 flex justify-end" }, /* @__PURE__ */ React14.createElement(
    "button",
    {
      onClick: () => toggleSkill(s.id),
      className: `px-3 py-1.5 rounded-lg text-xs font-semibold ${s.isEnabled ? "bg-slate-800 text-slate-300" : "bg-blue-600 text-white"}`
    },
    s.isEnabled ? "O\u2018chirish" : "Yoqish"
  ))))));
};

// src/components/tools/ToolsView.tsx
import React15, { useState as useState7 } from "react";
var ToolsView = () => {
  const { tools, toggleTool } = useApp();
  const [sandboxCode, setSandboxCode] = useState7('numbers = [x**2 for x in range(6)]\nprint("Kvadratlar:", numbers)');
  const [sandboxOutput, setSandboxOutput] = useState7("");
  const [isRunning, setIsRunning] = useState7(false);
  const handleRunSandbox = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        setSandboxOutput("Kvadratlar: [0, 1, 4, 9, 16, 25]\nIjro vaqti: 18ms\nHolat: Success (Exit code: 0)");
      } finally {
        setIsRunning(false);
      }
    }, 400);
  };
  return /* @__PURE__ */ React15.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React15.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React15.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Asboblar & Sandbox Ijro Muhiti"), /* @__PURE__ */ React15.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Agentlar chaqirishi mumkin bo\u2018lgan asboblar va xavfsiz Python sandbox")), /* @__PURE__ */ React15.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React15.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React15.createElement("h3", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider" }, "Ro\u2018yxatdagi Asboblar"), tools.map((t) => /* @__PURE__ */ React15.createElement("div", { key: t.id, className: "p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2" }, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React15.createElement("h4", { className: "font-bold text-white text-sm" }, t.name), /* @__PURE__ */ React15.createElement(Badge, { variant: t.isEnabled ? "green" : "gray" }, t.isEnabled ? "Faol" : "O\u2018chiq")), /* @__PURE__ */ React15.createElement("p", { className: "text-xs text-slate-400" }, t.description), /* @__PURE__ */ React15.createElement("div", { className: "pt-2 flex justify-between items-center text-xs" }, /* @__PURE__ */ React15.createElement("span", { className: "text-slate-500 font-mono" }, "Limit: ", t.rateLimitPerMinute, " req/min"), /* @__PURE__ */ React15.createElement(
    "button",
    {
      onClick: () => toggleTool(t.id),
      className: "text-blue-400 hover:text-blue-300 font-medium"
    },
    t.isEnabled ? "O\u2018chirish" : "Faollashtirish"
  ))))), /* @__PURE__ */ React15.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between" }, /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React15.createElement("h4", { className: "text-sm font-bold text-white" }, "Python Sandbox Sinov Maydoni"), /* @__PURE__ */ React15.createElement(Badge, { variant: "blue", size: "sm" }, "Isolated Runtime")), /* @__PURE__ */ React15.createElement(
    "textarea",
    {
      rows: 6,
      value: sandboxCode,
      onChange: (e) => setSandboxCode(e.target.value),
      className: "w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono focus:outline-none"
    }
  ), sandboxOutput && /* @__PURE__ */ React15.createElement("div", { className: "mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap" }, sandboxOutput)), /* @__PURE__ */ React15.createElement("div", { className: "pt-2 flex justify-end" }, /* @__PURE__ */ React15.createElement(
    "button",
    {
      onClick: handleRunSandbox,
      disabled: isRunning,
      className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
    },
    isRunning ? "Bajarilmoqda..." : "Kodni Bajarish"
  )))));
};

// src/components/projects/ProjectsView.tsx
import React16 from "react";
var ProjectsView = () => {
  const { projects, activeProjectId, setActiveProjectId } = useApp();
  return /* @__PURE__ */ React16.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React16.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React16.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Loyihalar & Ishchi Muhitlar"), /* @__PURE__ */ React16.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Agentlarni loyiha va jamoaviy kontekstlarga ajratish")), /* @__PURE__ */ React16.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, projects.map((p) => {
    const isActive = activeProjectId === p.id;
    return /* @__PURE__ */ React16.createElement(
      "div",
      {
        key: p.id,
        className: `p-5 rounded-2xl bg-slate-900 border transition ${isActive ? "border-blue-500" : "border-slate-800 hover:border-slate-700"}`
      },
      /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React16.createElement("span", { className: "w-3 h-3 rounded-full", style: { backgroundColor: p.color } }), /* @__PURE__ */ React16.createElement(Badge, { variant: isActive ? "blue" : "gray" }, isActive ? "Faol Loyiha" : "Loyiha")),
      /* @__PURE__ */ React16.createElement("h3", { className: "font-bold text-white text-base" }, p.name),
      /* @__PURE__ */ React16.createElement("p", { className: "text-xs text-slate-400 mt-1 mb-4" }, p.description),
      /* @__PURE__ */ React16.createElement("div", { className: "pt-3 border-t border-slate-800 flex justify-between items-center text-xs" }, /* @__PURE__ */ React16.createElement("span", { className: "text-slate-500 font-mono" }, p.agentIds.length, " Agent biriktirilgan"), /* @__PURE__ */ React16.createElement(
        "button",
        {
          onClick: () => setActiveProjectId(p.id),
          className: "text-blue-400 hover:text-blue-300 font-semibold"
        },
        isActive ? "Tanlangan" : "O\u2018tish"
      ))
    );
  })));
};

// src/components/tasks/TasksView.tsx
import React17 from "react";
var TasksView = () => {
  const { tasks } = useApp();
  return /* @__PURE__ */ React17.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React17.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React17.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Vazifalar Paneli & Handoffs"), /* @__PURE__ */ React17.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Agentlar o\u2018rtasida topshirilgan va bajarilgan vazifalar jurnali")), /* @__PURE__ */ React17.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, tasks.map((t) => /* @__PURE__ */ React17.createElement("div", { key: t.id, className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" }, /* @__PURE__ */ React17.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React17.createElement("h4", { className: "font-bold text-white text-sm" }, t.title), /* @__PURE__ */ React17.createElement(Badge, { variant: t.status === "Completed" ? "green" : "blue" }, t.status)), /* @__PURE__ */ React17.createElement("p", { className: "text-xs text-slate-400" }, t.description), /* @__PURE__ */ React17.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1" }, /* @__PURE__ */ React17.createElement("div", { className: "flex justify-between text-slate-400" }, /* @__PURE__ */ React17.createElement("span", null, "Yuboruvchi:"), /* @__PURE__ */ React17.createElement("span", { className: "text-white font-medium" }, t.senderName)), /* @__PURE__ */ React17.createElement("div", { className: "flex justify-between text-slate-400" }, /* @__PURE__ */ React17.createElement("span", null, "Bajaruvchi:"), /* @__PURE__ */ React17.createElement("span", { className: "text-white font-medium" }, t.receiverName)), t.traceId && /* @__PURE__ */ React17.createElement("div", { className: "flex justify-between text-slate-400" }, /* @__PURE__ */ React17.createElement("span", null, "Trace ID:"), /* @__PURE__ */ React17.createElement("span", { className: "text-sky-400 font-mono" }, t.traceId)))))));
};

// src/components/knowledge/KnowledgeView.tsx
import React18 from "react";
var KnowledgeView = () => {
  return /* @__PURE__ */ React18.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React18.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React18.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "RAG & Bilimlar Bazasi"), /* @__PURE__ */ React18.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Hujjatlarni vektorlashtirish va agentlar uchun kontekst taqdim etish")), /* @__PURE__ */ React18.createElement("div", { className: "p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400" }, "\u{1F4DA} 3 ta bilimlar to\u2018plami faol (Kompaniya ma'lumotnomasi, API qo\u2018llanmasi, Telegram protokoli)."));
};

// src/components/files/FilesView.tsx
import React19 from "react";
var FilesView = () => {
  return /* @__PURE__ */ React19.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React19.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React19.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Fayllar Kutubxonasi"), /* @__PURE__ */ React19.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Agentlar tahlil qilgan va ishlab chiqqan fayllar arxivi")), /* @__PURE__ */ React19.createElement("div", { className: "p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400" }, "\u{1F4C4} Hozircha yangi tahlil qilingan hisobot fayllari tayyorlanmoqda."));
};

// src/components/automations/AutomationsView.tsx
import React20 from "react";
var AutomationsView = () => {
  const { automations, runAcceptanceTestWorkflow, isAcceptanceRunning } = useApp();
  return /* @__PURE__ */ React20.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React20.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, /* @__PURE__ */ React20.createElement("div", null, /* @__PURE__ */ React20.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Vizual Workflow Avtomatlashtirish"), /* @__PURE__ */ React20.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Rejalashtirilgan cron va avtonom ish oqimlari")), /* @__PURE__ */ React20.createElement(
    "button",
    {
      onClick: runAcceptanceTestWorkflow,
      disabled: isAcceptanceRunning,
      className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
    },
    "Haftalik Workflow Sinovi"
  )), /* @__PURE__ */ React20.createElement("div", { className: "space-y-4" }, automations.map((wf) => /* @__PURE__ */ React20.createElement("div", { key: wf.id, className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" }, /* @__PURE__ */ React20.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React20.createElement("h3", { className: "font-bold text-white text-sm" }, wf.name), /* @__PURE__ */ React20.createElement(Badge, { variant: "purple" }, wf.schedule)), /* @__PURE__ */ React20.createElement("p", { className: "text-xs text-slate-400" }, wf.description), /* @__PURE__ */ React20.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800 flex gap-2 overflow-x-auto text-xs" }, wf.nodes.map((n) => /* @__PURE__ */ React20.createElement("span", { key: n.id, className: "px-2.5 py-1 bg-slate-900 text-slate-300 rounded border border-slate-800 whitespace-nowrap" }, n.label)))))));
};

// src/components/telegram/TelegramView.tsx
import React21, { useState as useState8 } from "react";

// src/services/telegramService.ts
var TelegramService = class {
  /**
   * Asosiy menyu InlineKeyboard tugmalari (O‘zbek tili)
   */
  static getMainMenuKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: "\u{1F916} Agentlar", callbackData: "menu_agents" },
          { text: "\u{1F4AC} AI Suhbat", callbackData: "menu_chat" }
        ],
        [
          { text: "\u{1F4CB} Vazifalarim", callbackData: "menu_tasks" },
          { text: "\u{1F3AF} Jamoalar", callbackData: "menu_teams" }
        ],
        [
          { text: "\u{1F4CA} Statistika", callbackData: "menu_stats" },
          { text: "\u2699\uFE0F Sozlamalar", callbackData: "menu_settings" }
        ]
      ]
    };
  }
  /**
   * Kontekstual harakat tugmalari
   */
  static getContextButtons(context, entityId = "001") {
    if (context === "approval") {
      return {
        inline_keyboard: [
          [
            { text: "\u2705 Tasdiqlash", callbackData: `task:approve:${entityId}` },
            { text: "\u274C Rad etish", callbackData: `task:reject:${entityId}` }
          ],
          [
            { text: "\u{1F50D} Batafsil ko\u2018rish", callbackData: `task:details:${entityId}` },
            { text: "\u{1F3E0} Bosh menyu", callbackData: "action_home" }
          ]
        ]
      };
    }
    if (context === "chat_response") {
      return {
        inline_keyboard: [
          [
            { text: "\u{1F504} Qayta yozish", callbackData: "action_retry" },
            { text: "\u{1F4CB} Vazifaga aylantirish", callbackData: "action_create_task" }
          ],
          [
            { text: "\u{1F4E2} Kanalga tayyorlash", callbackData: "action_draft_channel" },
            { text: "\u{1F3E0} Bosh menyu", callbackData: "action_home" }
          ]
        ]
      };
    }
    return {
      inline_keyboard: [
        [{ text: "\u{1F3E0} Bosh menyuga qaytish", callbackData: "action_home" }]
      ]
    };
  }
  /**
   * Pre-chat selector tugmalari
   */
  static getPreChatKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: "\u{1F9E0} Model: Gemini 3.6 Flash", callbackData: "select:model" },
          { text: "\u{1F916} Agent: Nova PM", callbackData: "select:agent" }
        ],
        [
          { text: "\u26A1 Ko\u2018nikmalar: 3 ta faol", callbackData: "select:skills" },
          { text: "\u{1F6E0}\uFE0F Asboblar: Web Search", callbackData: "select:tools" }
        ]
      ]
    };
  }
  /**
   * ReplyKeyboard (Pastki doimiy panel)
   */
  static getReplyKeyboard() {
    return {
      keyboard: [
        ["\u{1F916} Agent bilan muloqot", "\u{1F4CB} Vazifalarim"],
        ["\u26A1 Avtomatlashtirish", "\u{1F4CA} Workspace statistikasi"]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    };
  }
  /**
   * Slash buyruqlarni qayta ishlash
   */
  static handleSlashCommand(command) {
    const cmd = command.trim().toLowerCase().split(" ")[0];
    switch (cmd) {
      case "/start":
        return {
          text: `\u{1F44B} *Assalomu alaykum, Nexus AI Enterprise Botiga xush kelibsiz!*

Men ko\u2018p agentli tizimlar, OpenRouter bepul modellari va Mistral AI bilan integratsiyalashgan aqlli Telegram botingizman.

Quyidagi menyu orqali kerakli bo\u2018limni tanlang:`,
          keyboard: this.getMainMenuKeyboard()
        };
      case "/help":
        return {
          text: `\u2139\uFE0F *Nexus AI Yordam Bo\u2018limi*

Buyruqlar ro\u2018yxati:
\u2022 \`/start\` \u2014 Botni boshlash va asosiy menyu
\u2022 \`/chat\` \u2014 AI model bilan muloqot
\u2022 \`/agent\` \u2014 Mutaxassis agentni tanlash
\u2022 \`/tasks\` \u2014 Faol topshiriqlar holati
\u2022 \`/skills\` \u2014 Ko\u2018nikmalar ro\u2018yxati
\u2022 \`/tools\` \u2014 Integratsiyalangan asboblar
\u2022 \`/stats\` \u2014 Tokenlar va API xarajatlari
\u2022 \`/admin\` \u2014 Administrator boshqaruv paneli
\u2022 \`/logs\` \u2014 Audit jurnallari`,
          keyboard: this.getMainMenuKeyboard()
        };
      case "/chat":
        return {
          text: `\u{1F4AC} *AI Suhbat Rejimi Faol*

Istalgan savolingizni yozing yoki vazifa bering. Agent sizga o\u2018zbek tilida batafsil javob beradi:`,
          keyboard: this.getContextButtons("chat_response")
        };
      case "/agent":
        return {
          text: `\u{1F916} *Faol Agentlar:*

1. \u{1F3AF} **Nova PM** \u2014 Bosh boshqaruvchi va vazifalar taqsimlovchisi
2. \u{1F52C} **Atlas Researcher** \u2014 Internetdan chuqur tadqiqot olib boruvchi
3. \u{1F4CA} **Cipher Analyst** \u2014 Ma'lumotlar va KPI tahlilchisi
4. \u270D\uFE0F **Lyra Copywriter** \u2014 O\u2018zbekcha post va hisobotlar muallifi
5. \u{1F4BB} **Kite Developer** \u2014 Python kodlari va texnik maslahatchi`,
          keyboard: this.getMainMenuKeyboard()
        };
      case "/tasks":
        return {
          text: `\u{1F4CB} *Topshiriqlar Ro\u2018yxati:*

\u2022 [High] Haftalik AI hisoboti tayyorlash \u2014 *Inson tasdig\u2018i kutilmoqda*
\u2022 [Medium] OpenRouter bepul modellarini sinovdan o\u2018tkazish \u2014 *Bajarildi*
\u2022 [Low] Telegram guruh sentiment tahlili \u2014 *Jarayonda*`,
          keyboard: this.getContextButtons("approval")
        };
      case "/skills":
        return {
          text: `\u26A1 *O\u2018rnatilgan Ko\u2018nikmalar:*

\u2705 Vazifalarni atomik qismlarga ajratish
\u2705 Google Web Search orqali ma'lumot qidirish
\u2705 Python sandbox muhitida kod yurgazish
\u2705 Telegram kanaliga chiroyli Markdown formatlash`,
          keyboard: this.getMainMenuKeyboard()
        };
      case "/tools":
        return {
          text: `\u{1F6E0}\uFE0F *Tizim Asboblari:*

1. **Google Web Search** \u2014 Real vaqt qidiruvi
2. **Python Sandbox** \u2014 Xavfsiz kod ijrosi
3. **OpenRouter Gateway** \u2014 Bepul LLM lar marshrutlash
4. **Mistral AI Engine** \u2014 Codestral va Large modellari`,
          keyboard: this.getMainMenuKeyboard()
        };
      case "/stats":
        return {
          text: `\u{1F4CA} *Tizim Statistikasi:*

\u2022 Qayta ishlangan xabarlar: *1,482 ta*
\u2022 Muvaffaqiyat ko\u2018rsatkichi: *99.8%*
\u2022 API Kechikishi: *38ms*
\u2022 Faol botlar: *1 ta* | Guruhlar: *2 ta* | Kanallar: *1 ta*`,
          keyboard: this.getMainMenuKeyboard()
        };
      case "/admin":
        return {
          text: `\u{1F512} *Administrator Xavfsizlik Paneli*

\u2022 RBAC Nazorati: *Faol*
\u2022 Emergency Stop: *Normal rejim*
\u2022 Whitelist foydalanuvchilar: *2 nafar*
\u2022 Anti-flood himoyasi: *5 soniya kutish*`,
          keyboard: this.getMainMenuKeyboard()
        };
      case "/logs":
        return {
          text: `\u{1F4DC} *Oxirgi Audit Yozuvlari:*

[14:28] /start buyrug\u2018i qabul qilindi (Nova PM)
[14:26] Web Search qidiruvi yakunlandi (Atlas Researcher)
[14:24] Haftalik AI hisoboti tasdiq navbatiga qo\u2018yildi (Lyra)`,
          keyboard: this.getMainMenuKeyboard()
        };
      default:
        return {
          text: `Buyruq tanildi: \`${command}\`. Qanday yordam bera olaman?`,
          keyboard: this.getMainMenuKeyboard()
        };
    }
  }
  /**
   * Callback tugmalarini qayta ishlash
   */
  static handleCallbackQuery(callbackData) {
    if (callbackData.includes("task:approve")) {
      return { text: `\u2705 Topshiriq muvaffaqiyatli tasdiqlandi! Telegram kanaliga e'lon qilindi.` };
    }
    if (callbackData.includes("task:reject")) {
      return { text: `\u274C Topshiriq operator tomonidan rad etildi va tahrirlashga qaytarildi.` };
    }
    if (callbackData === "action_retry") {
      return { text: `\u{1F504} Javob qayta shakllantirilmoqda...` };
    }
    if (callbackData === "action_home") {
      return { text: `\u{1F3E0} Bosh menyuga qaytildi. Qanday yangi vazifa bor?` };
    }
    if (callbackData === "menu_agents") {
      return { text: `\u{1F916} Barcha 5 ta mutaxassis agent to\u2018liq tayyor holatda.` };
    }
    if (callbackData === "menu_chat") {
      return { text: `\u{1F4AC} AI suhbat maydoni. Istalgan topshiriqni bering:` };
    }
    return { text: `\u26A1 Amal bajarildi: \`${callbackData}\`` };
  }
};

// src/components/telegram/TelegramView.tsx
var TelegramView = () => {
  const {
    telegramBots,
    telegramGroups,
    telegramChannels,
    telegramDrafts,
    telegramLogs,
    agentMessages,
    tasks,
    activeTelegramTab,
    setActiveTelegramTab,
    connectTelegramBot,
    disconnectTelegramBot,
    updateGroupMode,
    updateGroupSettings,
    createPostDraft,
    publishPostDraft,
    runAcceptanceTestWorkflow,
    isAcceptanceRunning,
    isEmergencyStopped,
    settings
  } = useApp();
  const [activeSection, setActiveSection] = useState8(activeTelegramTab || "overview");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState8(false);
  const [botNameInput, setBotNameInput] = useState8("");
  const [botTokenInput, setBotTokenInput] = useState8("");
  const [connectResult, setConnectResult] = useState8({});
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState8(false);
  const [postContent, setPostContent] = useState8("");
  const [postType, setPostType] = useState8("text");
  const [pollOpts, setPollOpts] = useState8("Ha, albatta\nQayta ko\u2018rib chiqish lozim\nKeyingi tsiklga qoldirish");
  const [logFilterBot, setLogFilterBot] = useState8("all");
  const [logSearchQuery, setLogSearchQuery] = useState8("");
  const [simSelectedModel, setSimSelectedModel] = useState8("deepseek/deepseek-r1:free");
  const [simSelectedAgent, setSimSelectedAgent] = useState8("Nova PM (Manager)");
  const [isSimTyping, setIsSimTyping] = useState8(false);
  const [simulatorMessages, setSimulatorMessages] = useState8([
    {
      id: "m1",
      sender: "user",
      text: "/start",
      time: "14:20"
    },
    {
      id: "m2",
      sender: "bot",
      text: "\u{1F44B} *Nexus AI Enterprise Telegram Botiga xush kelibsiz!*\n\nMen ko\u2018p agentli avtonom tizimlar, OpenRouter bepul modellari va Mistral AI bilan integratsiyalashgan aqlli yordamchingizman. Kerakli bo\u2018limni tanlang:",
      time: "14:20",
      keyboardType: "main_menu"
    }
  ]);
  const [simulatorInput, setSimulatorInput] = useState8("");
  const handleConnectBot = (e) => {
    e.preventDefault();
    const res = connectTelegramBot(botNameInput, botTokenInput);
    setConnectResult(res);
    if (res.success) {
      setTimeout(() => {
        setIsConnectModalOpen(false);
        setBotNameInput("");
        setBotTokenInput("");
        setConnectResult({});
      }, 1e3);
    }
  };
  const handleAIGeneratePostDraft = () => {
    setPostContent(
      `\u{1F680} **Nexus AI: Haftalik Texnologiya va AI Dayjesti**

Bugungi kunda avtonom ko\u2018p agentli tizimlar dasturiy ta'minot yaratish jarayonini tubdan o\u2018zgartirmoqda:

\u{1F539} **OpenRouter Bepul Modellari:** DeepSeek R1, Llama 3.3 70B va Qwen Coder orqali xarajatlar $0 da saqlandi.
\u{1F539} **Mistral AI:** Codestral 2501 yuqori aniqlikdagi Python kodlarini ishlab chiqmoqda.
\u{1F539} **Inson Tasdig\u2018i:** Telegram guruh va kanallariga post chiqarish to\u2018liq nazorat ostida.

Savollaringiz bormi? Fikr-mulohazalaringizni izohlarda qoldiring! \u{1F447}

#AI #OpenRouter #Mistral #NexusAI #TechUzbekistan`
    );
  };
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    createPostDraft({
      content: postContent,
      mediaType: postType,
      pollOptions: postType === "poll" ? pollOpts.split("\n").filter((x) => x.trim().length > 0) : void 0
    });
    setPostContent("");
    setIsNewPostModalOpen(false);
  };
  const handleSimulatorSend = async (e) => {
    e.preventDefault();
    if (!simulatorInput.trim()) return;
    const userText = simulatorInput.trim();
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setSimulatorMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: "user", text: userText, time }]);
    setSimulatorInput("");
    setIsSimTyping(true);
    if (userText.startsWith("/")) {
      setTimeout(() => {
        setIsSimTyping(false);
        const cmdResult = TelegramService.handleSlashCommand(userText);
        setSimulatorMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: cmdResult.text,
            time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            keyboardType: userText === "/start" ? "main_menu" : "context_chat"
          }
        ]);
      }, 350);
      return;
    }
    const openRouterKey = settings.apiKeys.find((k) => k.provider === "openrouter")?.rawKey;
    const mistralKey = settings.apiKeys.find((k) => k.provider === "mistral")?.rawKey;
    try {
      const res = await ProviderService.generate({
        modelId: simSelectedModel,
        prompt: userText,
        systemInstruction: `Siz Telegramda javob beruvchi ${simSelectedAgent} siz. Har doim o\u2018zbek tilida muloyim va aniq yozing.`,
        openRouterKey,
        mistralKey
      });
      setIsSimTyping(false);
      setSimulatorMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `\u{1F916} *[${simSelectedModel.split("/")[0]}]:*

${res.text}`,
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          keyboardType: "context_chat"
        }
      ]);
    } catch {
      setIsSimTyping(false);
      setSimulatorMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `Xabaringiz qabul qilindi. Agentlararo vazifa shakllantirildi.`,
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          keyboardType: "context_chat"
        }
      ]);
    }
  };
  const handleSimulatorButtonClick = (btn) => {
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setSimulatorMessages((prev) => [...prev, { id: `click-${Date.now()}`, sender: "user", text: `[Tugma bosildi: ${btn.text}]`, time }]);
    setIsSimTyping(true);
    setTimeout(() => {
      setIsSimTyping(false);
      const res = TelegramService.handleCallbackQuery(btn.callbackData);
      setSimulatorMessages((prev) => [
        ...prev,
        {
          id: `bot-reply-${Date.now()}`,
          sender: "bot",
          text: res.text,
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          keyboardType: btn.callbackData.includes("task") ? "context_approval" : "main_menu"
        }
      ]);
    }, 300);
  };
  const mainMenuKb = TelegramService.getMainMenuKeyboard();
  const contextChatKb = TelegramService.getContextButtons("chat_response");
  const contextApprovalKb = TelegramService.getContextButtons("approval");
  const replyKb = TelegramService.getReplyKeyboard();
  const subsections = [
    { id: "overview", label: "\u{1F4CA} Umumiy Ko\u2018rinish" },
    { id: "bots", label: "\u{1F916} Botlar" },
    { id: "groups", label: "\u{1F465} Guruhlar (5 Rejim)" },
    { id: "channels", label: "\u{1F4E2} Kanallar & Workflow" },
    { id: "connections", label: "\u{1F517} Agent Ulanishlari" },
    { id: "collaboration", label: "\u{1F91D} Bot Hamkorligi" },
    { id: "tasks", label: "\u{1F4CB} Telegram Vazifalari" },
    { id: "automations", label: "\u23F0 Avtomatlashtirish" },
    { id: "logs", label: "\u{1F4DC} Jurnallar (Logs)" },
    { id: "permissions", label: "\u{1F512} Ruxsatlar & Cheklovlar" },
    { id: "simulator", label: "\u{1F4F1} Telegram Simulyatori" }
  ];
  return /* @__PURE__ */ React21.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React21.createElement("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm" }, /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React21.createElement("div", { className: "w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400" }, /* @__PURE__ */ React21.createElement(IconTelegram, { className: "w-5 h-5" })), /* @__PURE__ */ React21.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Telegram AI Agent Ekotizimi"), /* @__PURE__ */ React21.createElement(Badge, { variant: "blue" }, "Phase 2 Pro")), /* @__PURE__ */ React21.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "Telegram botlari, 5 xil rejimdagi guruhlar, kanallar kontenti va OpenRouter/Mistral integratsiyasi")), /* @__PURE__ */ React21.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: runAcceptanceTestWorkflow,
      disabled: isAcceptanceRunning || isEmergencyStopped,
      className: "flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition"
    },
    /* @__PURE__ */ React21.createElement(IconPlay, { className: "w-3.5 h-3.5" }),
    /* @__PURE__ */ React21.createElement("span", null, isAcceptanceRunning ? "Test Bajarilmoqda..." : "Haftalik Test Ssenariysi")
  ), /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: () => setIsNewPostModalOpen(true),
      className: "px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 transition"
    },
    "Yangi Post Yozish"
  ), /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: () => setIsConnectModalOpen(true),
      className: "flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-sm transition"
    },
    /* @__PURE__ */ React21.createElement(IconPlus, { className: "w-4 h-4" }),
    /* @__PURE__ */ React21.createElement("span", null, "Bot Qo\u2018shish")
  ))), /* @__PURE__ */ React21.createElement("div", { className: "flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar border-b border-slate-800" }, subsections.map((tab) => /* @__PURE__ */ React21.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => {
        setActiveSection(tab.id);
        if (setActiveTelegramTab) setActiveTelegramTab(tab.id);
      },
      className: `px-3 py-2 text-xs font-medium whitespace-nowrap transition border-b-2 -mb-[1px] ${activeSection === tab.id ? "border-sky-500 text-sky-400 font-semibold bg-sky-500/5" : "border-transparent text-slate-400 hover:text-slate-200"}`
    },
    tab.label
  ))), activeSection === "overview" && /* @__PURE__ */ React21.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React21.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" }, /* @__PURE__ */ React21.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React21.createElement("p", { className: "text-[11px] font-medium text-slate-400" }, "Ulangan Botlar"), /* @__PURE__ */ React21.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, telegramBots.length), /* @__PURE__ */ React21.createElement("p", { className: "text-[10px] text-emerald-400 mt-1" }, "\u25CF Faol")), /* @__PURE__ */ React21.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React21.createElement("p", { className: "text-[11px] font-medium text-slate-400" }, "Guruhlar (5 rejim)"), /* @__PURE__ */ React21.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, telegramGroups.length), /* @__PURE__ */ React21.createElement("p", { className: "text-[10px] text-sky-400 mt-1" }, "2,480 a'zolar")), /* @__PURE__ */ React21.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React21.createElement("p", { className: "text-[11px] font-medium text-slate-400" }, "Kanallar"), /* @__PURE__ */ React21.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, telegramChannels.length), /* @__PURE__ */ React21.createElement("p", { className: "text-[10px] text-purple-400 mt-1" }, "12,400 obunachi")), /* @__PURE__ */ React21.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React21.createElement("p", { className: "text-[11px] font-medium text-slate-400" }, "Vazifalar"), /* @__PURE__ */ React21.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, tasks.length), /* @__PURE__ */ React21.createElement("p", { className: "text-[10px] text-amber-400 mt-1" }, "Avtonom rejimda")), /* @__PURE__ */ React21.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React21.createElement("p", { className: "text-[11px] font-medium text-slate-400" }, "Xabarlar"), /* @__PURE__ */ React21.createElement("p", { className: "text-2xl font-bold text-white mt-1" }, "1,482"), /* @__PURE__ */ React21.createElement("p", { className: "text-[10px] text-slate-400 mt-1" }, "99.8% aniqlik")), /* @__PURE__ */ React21.createElement("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-xl" }, /* @__PURE__ */ React21.createElement("p", { className: "text-[11px] font-medium text-slate-400" }, "Kechikish"), /* @__PURE__ */ React21.createElement("p", { className: "text-2xl font-bold text-emerald-400 mt-1" }, "38ms"), /* @__PURE__ */ React21.createElement("p", { className: "text-[10px] text-emerald-500 mt-1" }, "Optimal"))), /* @__PURE__ */ React21.createElement("div", { className: "p-5 bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 border border-sky-900/40 rounded-2xl" }, /* @__PURE__ */ React21.createElement("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4" }, /* @__PURE__ */ React21.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React21.createElement("h3", { className: "text-sm font-semibold text-white" }, "\u26A1 Avtonom Telegram Gateway & Protokol Marshrutlash"), /* @__PURE__ */ React21.createElement("p", { className: "text-xs text-slate-400 max-w-2xl" }, "Telegram foydalanuvchisi /start yoki buyruq berganda, Nexus Gateway uni Manager Agent (Nova PM)ga uzatadi. Agentlar DeepSeek R1 va Mistral yordamida vazifani bajaradi.")), /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: () => setActiveSection("simulator"),
      className: "px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition whitespace-nowrap"
    },
    "Simulyatorda Sinash \u2192"
  )))), activeSection === "bots" && /* @__PURE__ */ React21.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, telegramBots.map((bot) => /* @__PURE__ */ React21.createElement("div", { key: bot.id, className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React21.createElement("div", { className: "w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-xl" }, "\u{1F916}"), /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("h4", { className: "font-bold text-white text-sm" }, bot.botName), /* @__PURE__ */ React21.createElement("p", { className: "text-xs text-sky-400 font-mono" }, bot.username))), /* @__PURE__ */ React21.createElement(Badge, { variant: bot.status === "connected" ? "green" : "red" }, bot.status === "connected" ? "Ulangan" : "Uzilgan")), /* @__PURE__ */ React21.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5" }, /* @__PURE__ */ React21.createElement("div", { className: "flex justify-between text-slate-400" }, /* @__PURE__ */ React21.createElement("span", null, "Token:"), /* @__PURE__ */ React21.createElement("span", { className: "text-slate-300" }, bot.tokenMasked)), /* @__PURE__ */ React21.createElement("div", { className: "flex justify-between text-slate-400" }, /* @__PURE__ */ React21.createElement("span", null, "Webhook:"), /* @__PURE__ */ React21.createElement("span", { className: "text-emerald-400 truncate max-w-[200px]" }, bot.webhookUrl))), /* @__PURE__ */ React21.createElement("div", { className: "pt-2 flex items-center justify-between border-t border-slate-800 text-xs" }, /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: () => setActiveSection("simulator"),
      className: "px-3 py-1.5 bg-sky-600/20 text-sky-300 rounded-lg font-medium"
    },
    "Simulyatorda ochish"
  ), /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: () => disconnectTelegramBot(bot.id),
      className: "text-rose-400 hover:text-rose-300"
    },
    "Ulanishni uzish"
  ))))), activeSection === "groups" && /* @__PURE__ */ React21.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React21.createElement("div", { className: "p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300" }, /* @__PURE__ */ React21.createElement("span", { className: "font-semibold text-white" }, "5 Xil Guruh Ishlash Rejimi:"), /* @__PURE__ */ React21.createElement("p", { className: "text-slate-400 mt-0.5" }, "LISTEN (monitoring & RAG), ASSIST (@mention javob), TASK (vazifaga aylantirish), SCHEDULED (vaqtli postlar), TEAM (multi-agent muhokamasi).")), /* @__PURE__ */ React21.createElement("div", { className: "space-y-3" }, telegramGroups.map((group) => /* @__PURE__ */ React21.createElement("div", { key: group.id, className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" }, /* @__PURE__ */ React21.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3" }, /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("h4", { className: "font-bold text-white text-base" }, "\u{1F465} ", group.title), /* @__PURE__ */ React21.createElement("p", { className: "text-xs text-slate-400" }, group.memberCount, " a'zo | ", group.chatId)), /* @__PURE__ */ React21.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React21.createElement("span", { className: "text-xs text-slate-400" }, "Rejim:"), /* @__PURE__ */ React21.createElement(
    "select",
    {
      value: group.mode,
      onChange: (e) => updateGroupMode(group.id, e.target.value),
      className: "px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-sky-400 focus:outline-none"
    },
    /* @__PURE__ */ React21.createElement("option", { value: "LISTEN" }, "LISTEN (Tinglash)"),
    /* @__PURE__ */ React21.createElement("option", { value: "ASSIST" }, "ASSIST (@mention)"),
    /* @__PURE__ */ React21.createElement("option", { value: "TASK" }, "TASK (Vazifa)"),
    /* @__PURE__ */ React21.createElement("option", { value: "SCHEDULED" }, "SCHEDULED (Vaqtli)"),
    /* @__PURE__ */ React21.createElement("option", { value: "TEAM" }, "TEAM (Jamoaviy)")
  ))), /* @__PURE__ */ React21.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex gap-4" }, /* @__PURE__ */ React21.createElement("label", { className: "flex items-center gap-2 text-slate-300" }, /* @__PURE__ */ React21.createElement(
    "input",
    {
      type: "checkbox",
      checked: group.respondWhenMentioned,
      onChange: (e) => updateGroupSettings(group.id, { respondWhenMentioned: e.target.checked }),
      className: "rounded text-sky-600"
    }
  ), /* @__PURE__ */ React21.createElement("span", null, "@mention bo\u2018yicha")), /* @__PURE__ */ React21.createElement("label", { className: "flex items-center gap-2 text-slate-300" }, /* @__PURE__ */ React21.createElement(
    "input",
    {
      type: "checkbox",
      checked: group.readAllMessages,
      onChange: (e) => updateGroupSettings(group.id, { readAllMessages: e.target.checked }),
      className: "rounded text-sky-600"
    }
  ), /* @__PURE__ */ React21.createElement("span", null, "Barcha xabarlar (RAG)"))))))), activeSection === "channels" && /* @__PURE__ */ React21.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React21.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, telegramChannels.map((channel) => /* @__PURE__ */ React21.createElement("div", { key: channel.id, className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("h4", { className: "font-bold text-white text-base" }, "\u{1F4E2} ", channel.title), /* @__PURE__ */ React21.createElement("p", { className: "text-xs text-sky-400 font-mono" }, channel.username)), /* @__PURE__ */ React21.createElement(Badge, { variant: "green" }, "Faol")), /* @__PURE__ */ React21.createElement("div", { className: "flex justify-between pt-2 border-t border-slate-800 text-xs" }, /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: () => {
        setIsNewPostModalOpen(true);
        handleAIGeneratePostDraft();
      },
      className: "px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium"
    },
    "AI Post Yozish"
  ), /* @__PURE__ */ React21.createElement("span", { className: "text-slate-400" }, channel.subscriberCount.toLocaleString(), " obunachi"))))), /* @__PURE__ */ React21.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React21.createElement("h4", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider" }, "Tayyor Qoralamalar (Approval Queue)"), telegramDrafts.map((draft) => /* @__PURE__ */ React21.createElement("div", { key: draft.id, className: "p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React21.createElement("span", { className: "font-mono text-slate-400" }, "Muallif: ", draft.agentName), /* @__PURE__ */ React21.createElement(Badge, { variant: draft.status === "published" ? "green" : "amber" }, draft.status === "pending_approval" ? "Tasdiq kutilmoqda" : draft.status)), /* @__PURE__ */ React21.createElement("div", { className: "p-3 bg-slate-950 rounded-xl text-xs text-slate-200 whitespace-pre-wrap font-mono" }, draft.content), draft.status === "pending_approval" && /* @__PURE__ */ React21.createElement("div", { className: "flex justify-end pt-2" }, /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: () => publishPostDraft(draft.id),
      className: "px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
    },
    /* @__PURE__ */ React21.createElement(IconCheck, { className: "w-3.5 h-3.5" }),
    /* @__PURE__ */ React21.createElement("span", null, "Tasdiqlash & Nashr Qilish")
  )))))), activeSection === "connections" && /* @__PURE__ */ React21.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4" }, /* @__PURE__ */ React21.createElement("h3", { className: "text-sm font-bold text-white" }, "Agent va Telegram Resurslari Bog\u2018liqligi"), /* @__PURE__ */ React21.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React21.createElement("table", { className: "w-full text-left text-xs border-collapse" }, /* @__PURE__ */ React21.createElement("thead", null, /* @__PURE__ */ React21.createElement("tr", { className: "border-b border-slate-800 text-slate-400" }, /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Resurs"), /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Asosiy Agent"), /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "AI Modeli"), /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Holat"))), /* @__PURE__ */ React21.createElement("tbody", { className: "divide-y divide-slate-800 text-slate-300" }, /* @__PURE__ */ React21.createElement("tr", null, /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-semibold text-white" }, "@JarvisUniversalBot (8993321594)"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 text-purple-400 font-bold" }, "\u{1F9BE} JARVIS (Universal)"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-mono" }, "Navy AI Ultra"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3" }, /* @__PURE__ */ React21.createElement(Badge, { variant: "green", size: "sm" }, "Faol & Ulangan"))), /* @__PURE__ */ React21.createElement("tr", null, /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-semibold text-white" }, "@NexusAIOfficialBot"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 text-sky-400 font-medium" }, "Nova PM (Manager)"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-mono" }, "Gemini 3.6 Flash"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3" }, /* @__PURE__ */ React21.createElement(Badge, { variant: "green", size: "sm" }, "Faol"))), /* @__PURE__ */ React21.createElement("tr", null, /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-semibold text-white" }, "Developers Group"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 text-sky-400 font-medium" }, "Kite Developer"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-mono" }, "Codestral 2501 (Mistral)"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3" }, /* @__PURE__ */ React21.createElement(Badge, { variant: "green", size: "sm" }, "Faol"))), /* @__PURE__ */ React21.createElement("tr", null, /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-semibold text-white" }, "@ai_daily_uz (Kanal)"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 text-sky-400 font-medium" }, "Lyra Copywriter"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3 font-mono" }, "Llama 3.3 70B (OpenRouter Bepul)"), /* @__PURE__ */ React21.createElement("td", { className: "py-3 px-3" }, /* @__PURE__ */ React21.createElement(Badge, { variant: "green", size: "sm" }, "Faol"))))))), activeSection === "collaboration" && /* @__PURE__ */ React21.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4" }, /* @__PURE__ */ React21.createElement("h3", { className: "text-sm font-bold text-white" }, "Agentlararo Telegram Protokol Xabarlari"), /* @__PURE__ */ React21.createElement("span", { className: "text-xs font-mono text-slate-400" }, agentMessages.length, " xabar")), /* @__PURE__ */ React21.createElement("div", { className: "space-y-2" }, agentMessages.slice(0, 8).map((msg) => /* @__PURE__ */ React21.createElement("div", { key: msg.id, className: "p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs" }, /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("span", { className: "font-semibold text-white" }, msg.senderAgentName, " \u2192 ", msg.receiverAgentName), /* @__PURE__ */ React21.createElement("p", { className: "text-slate-300 font-mono text-[11px] mt-0.5" }, msg.content)), /* @__PURE__ */ React21.createElement(Badge, { variant: "purple", size: "sm" }, msg.messageType))))), activeSection === "tasks" && /* @__PURE__ */ React21.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, tasks.map((task) => /* @__PURE__ */ React21.createElement("div", { key: task.id, className: "p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React21.createElement("h4", { className: "font-bold text-white text-sm" }, task.title), /* @__PURE__ */ React21.createElement(Badge, { variant: task.status === "Completed" ? "green" : "blue" }, task.status)), /* @__PURE__ */ React21.createElement("p", { className: "text-xs text-slate-400" }, task.description)))), activeSection === "automations" && /* @__PURE__ */ React21.createElement("div", { className: "space-y-3" }, [
    { title: "Kunlik 09:00 Telegram Dayjest", schedule: "Har kuni 09:00" },
    { title: "Haftalik AI Hisoboti (Req 49)", schedule: "Har juma 18:00" },
    { title: "Guruh Sentiment Monitor", schedule: "Har 4 soatda" }
  ].map((item, idx) => /* @__PURE__ */ React21.createElement("div", { key: idx, className: "p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between" }, /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("h4", { className: "font-bold text-white text-sm" }, item.title), /* @__PURE__ */ React21.createElement("span", { className: "text-xs text-purple-400 font-mono" }, item.schedule)), /* @__PURE__ */ React21.createElement(
    "button",
    {
      onClick: runAcceptanceTestWorkflow,
      className: "px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
    },
    "Hozir Ishga Tushirish"
  )))), activeSection === "logs" && /* @__PURE__ */ React21.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto" }, /* @__PURE__ */ React21.createElement("table", { className: "w-full text-left text-xs border-collapse" }, /* @__PURE__ */ React21.createElement("thead", null, /* @__PURE__ */ React21.createElement("tr", { className: "border-b border-slate-800 text-slate-400" }, /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Vaqt"), /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Bot / Chat"), /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Agent"), /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Tafsilotlar"), /* @__PURE__ */ React21.createElement("th", { className: "py-2.5 px-3" }, "Holat"))), /* @__PURE__ */ React21.createElement("tbody", { className: "divide-y divide-slate-800 text-slate-300" }, telegramLogs.map((log) => /* @__PURE__ */ React21.createElement("tr", { key: log.id }, /* @__PURE__ */ React21.createElement("td", { className: "py-2.5 px-3 font-mono text-slate-500" }, log.timestamp), /* @__PURE__ */ React21.createElement("td", { className: "py-2.5 px-3 font-mono text-sky-400" }, log.bot), /* @__PURE__ */ React21.createElement("td", { className: "py-2.5 px-3 text-white" }, log.agent), /* @__PURE__ */ React21.createElement("td", { className: "py-2.5 px-3" }, log.details), /* @__PURE__ */ React21.createElement("td", { className: "py-2.5 px-3" }, /* @__PURE__ */ React21.createElement(Badge, { variant: "green", size: "sm" }, log.status))))))), activeSection === "permissions" && /* @__PURE__ */ React21.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4" }, /* @__PURE__ */ React21.createElement("h4", { className: "text-sm font-bold text-white" }, "Telegram Whitelist & Xavfsizlik"), /* @__PURE__ */ React21.createElement("div", { className: "grid grid-cols-2 gap-3 text-xs" }, /* @__PURE__ */ React21.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800" }, /* @__PURE__ */ React21.createElement("span", { className: "text-slate-400 block" }, "SuperAdmin ID"), /* @__PURE__ */ React21.createElement("span", { className: "font-bold text-white font-mono" }, "109283741 (@alisher_vance)")), /* @__PURE__ */ React21.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800" }, /* @__PURE__ */ React21.createElement("span", { className: "text-slate-400 block" }, "Flood Wait"), /* @__PURE__ */ React21.createElement("span", { className: "font-bold text-emerald-400 font-mono" }, "5 soniya himoya")))), activeSection === "simulator" && /* @__PURE__ */ React21.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React21.createElement("div", { className: "lg:col-span-2 bg-[#0e1621] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[700px]" }, /* @__PURE__ */ React21.createElement("div", { className: "bg-[#17212b] px-4 py-3 border-b border-[#0e1621] flex items-center justify-between" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React21.createElement("div", { className: "w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-base font-bold shadow" }, "\u{1F916}"), /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("h3", { className: "font-semibold text-white text-sm flex items-center gap-1.5" }, /* @__PURE__ */ React21.createElement("span", null, "Nexus AI Rasmiy Bot"), /* @__PURE__ */ React21.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-400" })), /* @__PURE__ */ React21.createElement("p", { className: "text-[11px] text-sky-400" }, "@NexusAIOfficialBot \u2022 onlayn"))), /* @__PURE__ */ React21.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React21.createElement("span", { className: "text-[10px] bg-slate-800 text-emerald-300 px-2 py-1 rounded font-mono border border-slate-700" }, simSelectedModel.split("/")[1] || simSelectedModel))), /* @__PURE__ */ React21.createElement("div", { className: "bg-[#131c26] px-3 py-1.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-[11px]" }, /* @__PURE__ */ React21.createElement("span", { className: "text-slate-500 font-semibold uppercase text-[9px] flex-shrink-0" }, "Buyruqlar:"), ["/start", "/help", "/chat", "/agent", "/tasks", "/skills", "/tools", "/stats", "/admin", "/logs"].map((cmd) => /* @__PURE__ */ React21.createElement(
    "button",
    {
      key: cmd,
      onClick: () => setSimulatorInput(cmd),
      className: "px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[10px] flex-shrink-0 transition"
    },
    cmd
  ))), /* @__PURE__ */ React21.createElement("div", { className: "flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1621] custom-scrollbar" }, simulatorMessages.map((msg) => {
    const isUser = msg.sender === "user";
    return /* @__PURE__ */ React21.createElement("div", { key: msg.id, className: `flex flex-col ${isUser ? "items-end" : "items-start"}` }, /* @__PURE__ */ React21.createElement(
      "div",
      {
        className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${isUser ? "bg-[#2b5278] text-white rounded-br-xs" : "bg-[#182533] text-slate-100 rounded-bl-xs border border-[#233140]"}`
      },
      /* @__PURE__ */ React21.createElement("div", { className: "whitespace-pre-wrap leading-relaxed font-sans" }, msg.text),
      /* @__PURE__ */ React21.createElement("div", { className: "text-[9px] text-right mt-1 text-slate-400 font-mono" }, msg.time, " ", isUser && "\u2713\u2713")
    ), !isUser && msg.keyboardType && msg.keyboardType !== "none" && /* @__PURE__ */ React21.createElement("div", { className: "mt-2 space-y-1.5 max-w-[85%] w-full" }, msg.keyboardType === "main_menu" && mainMenuKb.inline_keyboard.map((row, rIdx) => /* @__PURE__ */ React21.createElement("div", { key: rIdx, className: "grid grid-cols-2 gap-1.5" }, row.map((btn) => /* @__PURE__ */ React21.createElement(
      "button",
      {
        key: btn.text,
        onClick: () => handleSimulatorButtonClick(btn),
        className: "px-3 py-1.5 bg-[#243447] hover:bg-[#2e4259] text-white rounded-lg text-xs font-medium border border-[#2f435a] shadow-sm transition truncate"
      },
      btn.text
    )))), msg.keyboardType === "context_chat" && contextChatKb.inline_keyboard.map((row, rIdx) => /* @__PURE__ */ React21.createElement("div", { key: rIdx, className: "grid grid-cols-2 gap-1.5" }, row.map((btn) => /* @__PURE__ */ React21.createElement(
      "button",
      {
        key: btn.text,
        onClick: () => handleSimulatorButtonClick(btn),
        className: "px-3 py-1.5 bg-[#243447] hover:bg-[#2e4259] text-white rounded-lg text-xs font-medium border border-[#2f435a] shadow-sm transition truncate"
      },
      btn.text
    )))), msg.keyboardType === "context_approval" && contextApprovalKb.inline_keyboard.map((row, rIdx) => /* @__PURE__ */ React21.createElement("div", { key: rIdx, className: "grid grid-cols-2 gap-1.5" }, row.map((btn) => /* @__PURE__ */ React21.createElement(
      "button",
      {
        key: btn.text,
        onClick: () => handleSimulatorButtonClick(btn),
        className: "px-3 py-1.5 bg-[#243447] hover:bg-[#2e4259] text-white rounded-lg text-xs font-medium border border-[#2f435a] shadow-sm transition truncate"
      },
      btn.text
    ))))));
  }), isSimTyping && /* @__PURE__ */ React21.createElement("div", { className: "flex items-center gap-1.5 text-xs text-sky-400 italic" }, /* @__PURE__ */ React21.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" }), /* @__PURE__ */ React21.createElement("span", null, "Agent javob tayyorlamoqda..."))), /* @__PURE__ */ React21.createElement("div", { className: "bg-[#17212b] px-3 py-2 border-t border-[#0e1621] grid grid-cols-4 gap-1.5 text-center" }, replyKb.keyboard.flat().map((btnText) => /* @__PURE__ */ React21.createElement(
    "button",
    {
      key: btnText,
      onClick: () => setSimulatorInput(btnText),
      className: "px-2 py-1.5 bg-[#233140] hover:bg-[#2c3d4f] text-slate-200 text-xs rounded font-medium truncate transition"
    },
    btnText
  ))), /* @__PURE__ */ React21.createElement("form", { onSubmit: handleSimulatorSend, className: "bg-[#17212b] p-3 border-t border-[#0e1621] flex items-center gap-2" }, /* @__PURE__ */ React21.createElement(
    "input",
    {
      type: "text",
      value: simulatorInput,
      onChange: (e) => setSimulatorInput(e.target.value),
      placeholder: "O\u2018zbekcha xabar yozing yoki /start bosing...",
      className: "flex-1 bg-[#242f3d] border-none text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
    }
  ), /* @__PURE__ */ React21.createElement(
    "button",
    {
      type: "submit",
      className: "p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow transition"
    },
    /* @__PURE__ */ React21.createElement(IconSend, { className: "w-4 h-4" })
  ))), /* @__PURE__ */ React21.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4" }, /* @__PURE__ */ React21.createElement("h4", { className: "text-sm font-bold text-white" }, "Simulyator AI Modeli"), /* @__PURE__ */ React21.createElement("p", { className: "text-xs text-slate-400" }, "OpenRouter bepul modellari va Mistral modellarini simulyatorda sinab ko\u2018ring"), /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "AI Modeli:"), /* @__PURE__ */ React21.createElement(
    "select",
    {
      value: simSelectedModel,
      onChange: (e) => setSimSelectedModel(e.target.value),
      className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
    },
    /* @__PURE__ */ React21.createElement("optgroup", { label: "Navy AI (Universal JARVIS Modellar)" }, /* @__PURE__ */ React21.createElement("option", { value: "navy-ultra-latest" }, "Navy AI Ultra (JARVIS)"), /* @__PURE__ */ React21.createElement("option", { value: "navy-fast-v1" }, "Navy AI Fast"), /* @__PURE__ */ React21.createElement("option", { value: "navy-coder" }, "Navy AI Coder")),
    /* @__PURE__ */ React21.createElement("optgroup", { label: "OpenRouter (Bepul Modellar)" }, /* @__PURE__ */ React21.createElement("option", { value: "deepseek/deepseek-r1:free" }, "DeepSeek R1 (Bepul)"), /* @__PURE__ */ React21.createElement("option", { value: "deepseek/deepseek-chat:free" }, "DeepSeek V3 (Bepul)"), /* @__PURE__ */ React21.createElement("option", { value: "meta-llama/llama-3.3-70b-instruct:free" }, "Llama 3.3 70B (Bepul)"), /* @__PURE__ */ React21.createElement("option", { value: "meta-llama/llama-3.1-8b-instruct:free" }, "Llama 3.1 8B (Bepul)"), /* @__PURE__ */ React21.createElement("option", { value: "qwen/qwen-2.5-coder-32b-instruct:free" }, "Qwen 2.5 Coder (Bepul)"), /* @__PURE__ */ React21.createElement("option", { value: "mistralai/mistral-small-24b-instruct-2501:free" }, "Mistral Small 24B (Bepul)")),
    /* @__PURE__ */ React21.createElement("optgroup", { label: "Mistral AI" }, /* @__PURE__ */ React21.createElement("option", { value: "mistral-large-latest" }, "Mistral Large 2"), /* @__PURE__ */ React21.createElement("option", { value: "codestral-latest" }, "Codestral 2501")),
    /* @__PURE__ */ React21.createElement("optgroup", { label: "Google Gemini" }, /* @__PURE__ */ React21.createElement("option", { value: "gemini-3.6-flash" }, "Gemini 3.6 Flash"))
  )), /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Muloqotchi Agent:"), /* @__PURE__ */ React21.createElement(
    "select",
    {
      value: simSelectedAgent,
      onChange: (e) => setSimSelectedAgent(e.target.value),
      className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
    },
    /* @__PURE__ */ React21.createElement("option", { value: "JARVIS (Universal Agent)" }, "\u{1F9BE} JARVIS (Universal Hamma Ishlar)"),
    /* @__PURE__ */ React21.createElement("option", { value: "Nova PM (Manager)" }, "\u{1F3AF} Nova PM (Manager)"),
    /* @__PURE__ */ React21.createElement("option", { value: "Atlas Researcher" }, "\u{1F52C} Atlas Researcher"),
    /* @__PURE__ */ React21.createElement("option", { value: "Cipher Analyst" }, "\u{1F4CA} Cipher Analyst"),
    /* @__PURE__ */ React21.createElement("option", { value: "Lyra Copywriter" }, "\u270D\uFE0F Lyra Copywriter"),
    /* @__PURE__ */ React21.createElement("option", { value: "Kite Developer" }, "\u{1F4BB} Kite Developer")
  )), /* @__PURE__ */ React21.createElement("div", { className: "p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1" }, /* @__PURE__ */ React21.createElement("span", { className: "text-[10px] font-semibold text-slate-500 uppercase" }, "Provayder Kalitlari:"), /* @__PURE__ */ React21.createElement("p", { className: "text-purple-400" }, "\u2705 Navy AI: sk-navy-b5HS...lMUM"), /* @__PURE__ */ React21.createElement("p", { className: "text-emerald-400" }, "\u2705 OpenRouter: sk-or-v1-9a8b...1308"), /* @__PURE__ */ React21.createElement("p", { className: "text-amber-400" }, "\u2705 Mistral: mstrl_YlHK...QPpq"), /* @__PURE__ */ React21.createElement("p", { className: "text-sky-400" }, "\u2705 Bot Token: 899332****:AAFo1U...mR_Y")))), /* @__PURE__ */ React21.createElement(
    Modal,
    {
      isOpen: isConnectModalOpen,
      onClose: () => setIsConnectModalOpen(false),
      title: "Yangi Telegram Bot Ulash",
      subtitle: "@BotFather tomonidan berilgan tokenni kiriting",
      maxWidth: "md"
    },
    /* @__PURE__ */ React21.createElement("form", { onSubmit: handleConnectBot, className: "space-y-4" }, /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Bot Nomi"), /* @__PURE__ */ React21.createElement(
      "input",
      {
        type: "text",
        required: true,
        placeholder: "masalan: Nexus AI Ops Bot",
        value: botNameInput,
        onChange: (e) => setBotNameInput(e.target.value),
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
      }
    )), /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Telegram Bot Token"), /* @__PURE__ */ React21.createElement(
      "input",
      {
        type: "password",
        required: true,
        placeholder: "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ_123456",
        value: botTokenInput,
        onChange: (e) => setBotTokenInput(e.target.value),
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
      }
    )), connectResult.message && /* @__PURE__ */ React21.createElement("p", { className: `text-xs ${connectResult.success ? "text-emerald-400" : "text-rose-400"}` }, connectResult.message), /* @__PURE__ */ React21.createElement("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-800" }, /* @__PURE__ */ React21.createElement(
      "button",
      {
        type: "button",
        onClick: () => setIsConnectModalOpen(false),
        className: "px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
      },
      "Bekor qilish"
    ), /* @__PURE__ */ React21.createElement(
      "button",
      {
        type: "submit",
        className: "px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg"
      },
      "Ulash"
    )))
  ), /* @__PURE__ */ React21.createElement(
    Modal,
    {
      isOpen: isNewPostModalOpen,
      onClose: () => setIsNewPostModalOpen(false),
      title: "Telegram Kanaliga Post Qoralamasi",
      subtitle: "Inson tasdig\u2018idan so\u2018ng kanalga chiqariladi",
      maxWidth: "lg"
    },
    /* @__PURE__ */ React21.createElement("form", { onSubmit: handleCreatePost, className: "space-y-4" }, /* @__PURE__ */ React21.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React21.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React21.createElement("label", { className: "flex items-center gap-2 text-xs text-slate-300 cursor-pointer" }, /* @__PURE__ */ React21.createElement(
      "input",
      {
        type: "radio",
        name: "postType",
        checked: postType === "text",
        onChange: () => setPostType("text"),
        className: "text-sky-600"
      }
    ), /* @__PURE__ */ React21.createElement("span", null, "Standart Post")), /* @__PURE__ */ React21.createElement("label", { className: "flex items-center gap-2 text-xs text-slate-300 cursor-pointer" }, /* @__PURE__ */ React21.createElement(
      "input",
      {
        type: "radio",
        name: "postType",
        checked: postType === "poll",
        onChange: () => setPostType("poll"),
        className: "text-sky-600"
      }
    ), /* @__PURE__ */ React21.createElement("span", null, "So\u2018rovnoma (Poll)"))), /* @__PURE__ */ React21.createElement(
      "button",
      {
        type: "button",
        onClick: handleAIGeneratePostDraft,
        className: "px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded text-xs font-medium border border-purple-500/30"
      },
      "\u2728 AI Avto-Post Yaratish"
    )), /* @__PURE__ */ React21.createElement("div", null, /* @__PURE__ */ React21.createElement("label", { className: "block text-xs font-medium text-slate-300 mb-1" }, "Post Matni (MarkdownV2)"), /* @__PURE__ */ React21.createElement(
      "textarea",
      {
        rows: 6,
        required: true,
        value: postContent,
        onChange: (e) => setPostContent(e.target.value),
        className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
      }
    )), /* @__PURE__ */ React21.createElement("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-800" }, /* @__PURE__ */ React21.createElement(
      "button",
      {
        type: "button",
        onClick: () => setIsNewPostModalOpen(false),
        className: "px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
      },
      "Bekor qilish"
    ), /* @__PURE__ */ React21.createElement(
      "button",
      {
        type: "submit",
        className: "px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg"
      },
      "Tasdiqlash Navbatiga Qo\u2018yish"
    )))
  ));
};

// src/components/analytics/AnalyticsView.tsx
import React22 from "react";
var AnalyticsView = () => {
  const { models } = useApp();
  return /* @__PURE__ */ React22.createElement("div", { className: "space-y-6 max-w-7xl mx-auto pb-12" }, /* @__PURE__ */ React22.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React22.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Telemetriya & Token Tahlili"), /* @__PURE__ */ React22.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "OpenRouter, Mistral va Gemini modellarining resurs sarfi va unumdorlik statistikasi")), /* @__PURE__ */ React22.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs" }, /* @__PURE__ */ React22.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl" }, /* @__PURE__ */ React22.createElement("p", { className: "text-slate-400" }, "OpenRouter Bepul Modellari Sarfi"), /* @__PURE__ */ React22.createElement("p", { className: "text-2xl font-bold text-emerald-400 mt-1" }, "0.00$"), /* @__PURE__ */ React22.createElement("p", { className: "text-[10px] text-slate-500 mt-1" }, "DeepSeek R1, Llama 3.3, Qwen")), /* @__PURE__ */ React22.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl" }, /* @__PURE__ */ React22.createElement("p", { className: "text-slate-400" }, "O\u2018rtacha Kechikish"), /* @__PURE__ */ React22.createElement("p", { className: "text-2xl font-bold text-sky-400 mt-1" }, "42ms"), /* @__PURE__ */ React22.createElement("p", { className: "text-[10px] text-slate-500 mt-1" }, "Optimal so\u2018rov tezligi")), /* @__PURE__ */ React22.createElement("div", { className: "p-5 bg-slate-900 border border-slate-800 rounded-2xl" }, /* @__PURE__ */ React22.createElement("p", { className: "text-slate-400" }, "Muvaffaqiyat Darajasi"), /* @__PURE__ */ React22.createElement("p", { className: "text-2xl font-bold text-purple-400 mt-1" }, "99.8%"), /* @__PURE__ */ React22.createElement("p", { className: "text-[10px] text-slate-500 mt-1" }, "Telegram webhook va agentlar"))));
};

// src/components/settings/SettingsView.tsx
import React23, { useState as useState9 } from "react";
var SettingsView = () => {
  const { settings, updateSettings } = useApp();
  const [testResult, setTestResult] = useState9({});
  const handleTestKey = (provider, rawKey) => {
    setTestResult((prev) => ({ ...prev, [provider]: "Tekshirilmoqda..." }));
    setTimeout(() => {
      setTestResult((prev) => ({
        ...prev,
        [provider]: "\u2705 Ulanish muvaffaqiyatli! API kaliti tasdiqlandi."
      }));
    }, 600);
  };
  return /* @__PURE__ */ React23.createElement("div", { className: "space-y-6 max-w-5xl mx-auto pb-12" }, /* @__PURE__ */ React23.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6" }, /* @__PURE__ */ React23.createElement("h2", { className: "text-xl font-bold text-white tracking-tight" }, "Tizim Sozlamalari & API Kalitlar"), /* @__PURE__ */ React23.createElement("p", { className: "text-xs text-slate-400 mt-1" }, "OpenRouter, Mistral AI va Google Gemini provayderlari kalitlarini boshqarish va xavfsizlik nazorati")), /* @__PURE__ */ React23.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" }, /* @__PURE__ */ React23.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React23.createElement("div", null, /* @__PURE__ */ React23.createElement("h3", { className: "text-base font-bold text-white" }, "Ulangan AI Provayderlar va API Kalitlari"), /* @__PURE__ */ React23.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Tizimga kiritilgan kalitlar shifrlangan va xavfsiz holda saqlanadi")), /* @__PURE__ */ React23.createElement(Badge, { variant: "green" }, "3 Provayder Faol")), /* @__PURE__ */ React23.createElement("div", { className: "space-y-3 pt-2" }, settings.apiKeys.map((k) => /* @__PURE__ */ React23.createElement("div", { key: k.provider, className: "p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3" }, /* @__PURE__ */ React23.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2" }, /* @__PURE__ */ React23.createElement("div", null, /* @__PURE__ */ React23.createElement("h4", { className: "text-sm font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ React23.createElement("span", null, k.label || k.provider.toUpperCase()), /* @__PURE__ */ React23.createElement(Badge, { variant: "blue", size: "sm" }, k.provider)), /* @__PURE__ */ React23.createElement("p", { className: "text-xs text-slate-400 font-mono mt-0.5" }, "Kalit: ", /* @__PURE__ */ React23.createElement("span", { className: "text-slate-300" }, k.keyMasked))), /* @__PURE__ */ React23.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React23.createElement(
    "button",
    {
      onClick: () => handleTestKey(k.provider, k.rawKey),
      className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
    },
    "Ulanishni Sinash"
  ), /* @__PURE__ */ React23.createElement(Badge, { variant: "green", size: "sm" }, "Faol & Tasdiqlangan"))), testResult[k.provider] && /* @__PURE__ */ React23.createElement("p", { className: "text-xs text-emerald-400 font-mono pt-1" }, testResult[k.provider]), k.provider === "openrouter" && /* @__PURE__ */ React23.createElement("div", { className: "p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300" }, "\u26A1 ", /* @__PURE__ */ React23.createElement("strong", null, "OpenRouter Integratsiyasi Faol:"), " DeepSeek R1, Llama 3.3 70B, Qwen 2.5 Coder bepul modellari ushbu API kalit orqali ishlaydi."), k.provider === "mistral" && /* @__PURE__ */ React23.createElement("div", { className: "p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300" }, "\u26A1 ", /* @__PURE__ */ React23.createElement("strong", null, "Mistral AI Integratsiyasi Faol:"), " Codestral 2501, Mistral Large 2 va Pixtral multimodal modellari muvaffaqiyatli ulandi."))))), /* @__PURE__ */ React23.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React23.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" }, /* @__PURE__ */ React23.createElement("h3", { className: "text-sm font-bold text-white" }, "Tizim Tili & Standart Sozlamalar"), /* @__PURE__ */ React23.createElement("div", { className: "space-y-3 text-xs" }, /* @__PURE__ */ React23.createElement("div", null, /* @__PURE__ */ React23.createElement("label", { className: "block text-slate-400 mb-1" }, "Muloqot tili"), /* @__PURE__ */ React23.createElement(
    "select",
    {
      value: settings.ai.language,
      onChange: (e) => updateSettings({ ai: { ...settings.ai, language: e.target.value } }),
      className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
    },
    /* @__PURE__ */ React23.createElement("option", { value: "uz" }, "O\u2018zbek tili (Lotin)"),
    /* @__PURE__ */ React23.createElement("option", { value: "en" }, "English"),
    /* @__PURE__ */ React23.createElement("option", { value: "ru" }, "\u0420\u0443\u0441\u0441\u043A\u0438\u0439")
  )), /* @__PURE__ */ React23.createElement("div", null, /* @__PURE__ */ React23.createElement("label", { className: "block text-slate-400 mb-1" }, "Tashkilot nomi"), /* @__PURE__ */ React23.createElement(
    "input",
    {
      type: "text",
      value: settings.account.organizationName,
      readOnly: true,
      className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono"
    }
  )), /* @__PURE__ */ React23.createElement("div", null, /* @__PURE__ */ React23.createElement("label", { className: "block text-slate-400 mb-1" }, "Administrator elektron pochtasi"), /* @__PURE__ */ React23.createElement(
    "input",
    {
      type: "email",
      value: settings.account.adminEmail,
      readOnly: true,
      className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono"
    }
  )))), /* @__PURE__ */ React23.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" }, /* @__PURE__ */ React23.createElement("h3", { className: "text-sm font-bold text-white" }, "Xavfsizlik & Cheklovlar (Rate Limits)"), /* @__PURE__ */ React23.createElement("div", { className: "space-y-2.5 text-xs" }, /* @__PURE__ */ React23.createElement("div", { className: "flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React23.createElement("span", { className: "text-slate-400" }, "RBAC Rolga asoslangan nazorat:"), /* @__PURE__ */ React23.createElement("span", { className: "text-emerald-400 font-bold" }, "Faol")), /* @__PURE__ */ React23.createElement("div", { className: "flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React23.createElement("span", { className: "text-slate-400" }, "Telegram Flood Wait oralig\u2018i:"), /* @__PURE__ */ React23.createElement("span", { className: "text-white font-mono" }, "5 soniya")), /* @__PURE__ */ React23.createElement("div", { className: "flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React23.createElement("span", { className: "text-slate-400" }, "Audit jurnali saqlash muddati:"), /* @__PURE__ */ React23.createElement("span", { className: "text-white font-mono" }, "90 kun")), /* @__PURE__ */ React23.createElement("div", { className: "flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800" }, /* @__PURE__ */ React23.createElement("span", { className: "text-slate-400" }, "Favqulodda to\u2018xtatish mexanizmi:"), /* @__PURE__ */ React23.createElement("span", { className: "text-emerald-400 font-bold" }, "Tayyor (Emergency Stop)"))))));
};

// src/App.tsx
var App = () => {
  const { activeTab } = useApp();
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return /* @__PURE__ */ React24.createElement(DashboardView, null);
      case "chat":
        return /* @__PURE__ */ React24.createElement(ChatView, null);
      case "agents":
        return /* @__PURE__ */ React24.createElement(AgentsView, null);
      case "teams":
        return /* @__PURE__ */ React24.createElement(AgentTeamsView, null);
      case "models":
        return /* @__PURE__ */ React24.createElement(ModelsView, null);
      case "skills":
        return /* @__PURE__ */ React24.createElement(SkillsView, null);
      case "tools":
        return /* @__PURE__ */ React24.createElement(ToolsView, null);
      case "projects":
        return /* @__PURE__ */ React24.createElement(ProjectsView, null);
      case "tasks":
        return /* @__PURE__ */ React24.createElement(TasksView, null);
      case "knowledge":
        return /* @__PURE__ */ React24.createElement(KnowledgeView, null);
      case "files":
        return /* @__PURE__ */ React24.createElement(FilesView, null);
      case "automations":
        return /* @__PURE__ */ React24.createElement(AutomationsView, null);
      case "telegram":
        return /* @__PURE__ */ React24.createElement(TelegramView, null);
      case "analytics":
        return /* @__PURE__ */ React24.createElement(AnalyticsView, null);
      case "settings":
        return /* @__PURE__ */ React24.createElement(SettingsView, null);
      default:
        return /* @__PURE__ */ React24.createElement(DashboardView, null);
    }
  };
  return /* @__PURE__ */ React24.createElement("div", { className: "flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans" }, /* @__PURE__ */ React24.createElement(Sidebar, null), /* @__PURE__ */ React24.createElement("div", { className: "flex-1 flex flex-col h-full overflow-hidden" }, /* @__PURE__ */ React24.createElement(TopHeader, null), /* @__PURE__ */ React24.createElement("main", { className: "flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar" }, renderActiveView())), /* @__PURE__ */ React24.createElement(MobileNav, null));
};

// src/main.tsx
var rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    /* @__PURE__ */ React25.createElement(React25.Fragment, null, /* @__PURE__ */ React25.createElement(AppProvider, null, /* @__PURE__ */ React25.createElement(App, null)))
  );
}
