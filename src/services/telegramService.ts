export interface InlineKeyboardButton {
  text: string;
  callbackData: string;
  url?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface ReplyKeyboardMarkup {
  keyboard: string[][];
  resize_keyboard: boolean;
  one_time_keyboard: boolean;
}

export class TelegramService {
  /**
   * Asosiy menyu InlineKeyboard tugmalari (O‘zbek tili)
   */
  static getMainMenuKeyboard(): InlineKeyboardMarkup {
    return {
      inline_keyboard: [
        [
          { text: '🤖 Agentlar', callbackData: 'menu_agents' },
          { text: '💬 AI Suhbat', callbackData: 'menu_chat' }
        ],
        [
          { text: '📋 Vazifalarim', callbackData: 'menu_tasks' },
          { text: '🎯 Jamoalar', callbackData: 'menu_teams' }
        ],
        [
          { text: '📊 Statistika', callbackData: 'menu_stats' },
          { text: '⚙️ Sozlamalar', callbackData: 'menu_settings' }
        ]
      ]
    };
  }

  /**
   * Kontekstual harakat tugmalari
   */
  static getContextButtons(context: string, entityId: string = '001'): InlineKeyboardMarkup {
    if (context === 'approval') {
      return {
        inline_keyboard: [
          [
            { text: '✅ Tasdiqlash', callbackData: `task:approve:${entityId}` },
            { text: '❌ Rad etish', callbackData: `task:reject:${entityId}` }
          ],
          [
            { text: '🔍 Batafsil ko‘rish', callbackData: `task:details:${entityId}` },
            { text: '🏠 Bosh menyu', callbackData: 'action_home' }
          ]
        ]
      };
    }

    if (context === 'chat_response') {
      return {
        inline_keyboard: [
          [
            { text: '🔄 Qayta yozish', callbackData: 'action_retry' },
            { text: '📋 Vazifaga aylantirish', callbackData: 'action_create_task' }
          ],
          [
            { text: '📢 Kanalga tayyorlash', callbackData: 'action_draft_channel' },
            { text: '🏠 Bosh menyu', callbackData: 'action_home' }
          ]
        ]
      };
    }

    return {
      inline_keyboard: [
        [{ text: '🏠 Bosh menyuga qaytish', callbackData: 'action_home' }]
      ]
    };
  }

  /**
   * Pre-chat selector tugmalari
   */
  static getPreChatKeyboard(): InlineKeyboardMarkup {
    return {
      inline_keyboard: [
        [
          { text: '🧠 Model: Gemini 3.6 Flash', callbackData: 'select:model' },
          { text: '🤖 Agent: Nova PM', callbackData: 'select:agent' }
        ],
        [
          { text: '⚡ Ko‘nikmalar: 3 ta faol', callbackData: 'select:skills' },
          { text: '🛠️ Asboblar: Web Search', callbackData: 'select:tools' }
        ]
      ]
    };
  }

  /**
   * ReplyKeyboard (Pastki doimiy panel)
   */
  static getReplyKeyboard(): ReplyKeyboardMarkup {
    return {
      keyboard: [
        ['🤖 Agent bilan muloqot', '📋 Vazifalarim'],
        ['⚡ Avtomatlashtirish', '📊 Workspace statistikasi']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    };
  }

  /**
   * Slash buyruqlarni qayta ishlash
   */
  static handleSlashCommand(command: string): { text: string; keyboard?: InlineKeyboardMarkup } {
    const cmd = command.trim().toLowerCase().split(' ')[0];

    switch (cmd) {
      case '/start':
        return {
          text: `👋 *Assalomu alaykum, Nexus AI Enterprise Botiga xush kelibsiz!*\n\n` +
                `Men ko‘p agentli tizimlar, OpenRouter bepul modellari va Mistral AI bilan integratsiyalashgan aqlli Telegram botingizman.\n\n` +
                `Quyidagi menyu orqali kerakli bo‘limni tanlang:`,
          keyboard: this.getMainMenuKeyboard()
        };

      case '/help':
        return {
          text: `ℹ️ *Nexus AI Yordam Bo‘limi*\n\n` +
                `Buyruqlar ro‘yxati:\n` +
                `• \`/start\` — Botni boshlash va asosiy menyu\n` +
                `• \`/chat\` — AI model bilan muloqot\n` +
                `• \`/agent\` — Mutaxassis agentni tanlash\n` +
                `• \`/tasks\` — Faol topshiriqlar holati\n` +
                `• \`/skills\` — Ko‘nikmalar ro‘yxati\n` +
                `• \`/tools\` — Integratsiyalangan asboblar\n` +
                `• \`/stats\` — Tokenlar va API xarajatlari\n` +
                `• \`/admin\` — Administrator boshqaruv paneli\n` +
                `• \`/logs\` — Audit jurnallari`,
          keyboard: this.getMainMenuKeyboard()
        };

      case '/chat':
        return {
          text: `💬 *AI Suhbat Rejimi Faol*\n\nIstalgan savolingizni yozing yoki vazifa bering. Agent sizga o‘zbek tilida batafsil javob beradi:`,
          keyboard: this.getContextButtons('chat_response')
        };

      case '/agent':
        return {
          text: `🤖 *Faol Agentlar:*\n\n` +
                `1. 🎯 **Nova PM** — Bosh boshqaruvchi va vazifalar taqsimlovchisi\n` +
                `2. 🔬 **Atlas Researcher** — Internetdan chuqur tadqiqot olib boruvchi\n` +
                `3. 📊 **Cipher Analyst** — Ma'lumotlar va KPI tahlilchisi\n` +
                `4. ✍️ **Lyra Copywriter** — O‘zbekcha post va hisobotlar muallifi\n` +
                `5. 💻 **Kite Developer** — Python kodlari va texnik maslahatchi`,
          keyboard: this.getMainMenuKeyboard()
        };

      case '/tasks':
        return {
          text: `📋 *Topshiriqlar Ro‘yxati:*\n\n` +
                `• [High] Haftalik AI hisoboti tayyorlash — *Inson tasdig‘i kutilmoqda*\n` +
                `• [Medium] OpenRouter bepul modellarini sinovdan o‘tkazish — *Bajarildi*\n` +
                `• [Low] Telegram guruh sentiment tahlili — *Jarayonda*`,
          keyboard: this.getContextButtons('approval')
        };

      case '/skills':
        return {
          text: `⚡ *O‘rnatilgan Ko‘nikmalar:*\n\n` +
                `✅ Vazifalarni atomik qismlarga ajratish\n` +
                `✅ Google Web Search orqali ma'lumot qidirish\n` +
                `✅ Python sandbox muhitida kod yurgazish\n` +
                `✅ Telegram kanaliga chiroyli Markdown formatlash`,
          keyboard: this.getMainMenuKeyboard()
        };

      case '/tools':
        return {
          text: `🛠️ *Tizim Asboblari:*\n\n` +
                `1. **Google Web Search** — Real vaqt qidiruvi\n` +
                `2. **Python Sandbox** — Xavfsiz kod ijrosi\n` +
                `3. **OpenRouter Gateway** — Bepul LLM lar marshrutlash\n` +
                `4. **Mistral AI Engine** — Codestral va Large modellari`,
          keyboard: this.getMainMenuKeyboard()
        };

      case '/stats':
        return {
          text: `📊 *Tizim Statistikasi:*\n\n` +
                `• Qayta ishlangan xabarlar: *1,482 ta*\n` +
                `• Muvaffaqiyat ko‘rsatkichi: *99.8%*\n` +
                `• API Kechikishi: *38ms*\n` +
                `• Faol botlar: *1 ta* | Guruhlar: *2 ta* | Kanallar: *1 ta*`,
          keyboard: this.getMainMenuKeyboard()
        };

      case '/admin':
        return {
          text: `🔒 *Administrator Xavfsizlik Paneli*\n\n` +
                `• RBAC Nazorati: *Faol*\n` +
                `• Emergency Stop: *Normal rejim*\n` +
                `• Whitelist foydalanuvchilar: *2 nafar*\n` +
                `• Anti-flood himoyasi: *5 soniya kutish*`,
          keyboard: this.getMainMenuKeyboard()
        };

      case '/logs':
        return {
          text: `📜 *Oxirgi Audit Yozuvlari:*\n\n` +
                `[14:28] /start buyrug‘i qabul qilindi (Nova PM)\n` +
                `[14:26] Web Search qidiruvi yakunlandi (Atlas Researcher)\n` +
                `[14:24] Haftalik AI hisoboti tasdiq navbatiga qo‘yildi (Lyra)`,
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
  static handleCallbackQuery(callbackData: string): { text: string } {
    if (callbackData.includes('task:approve')) {
      return { text: `✅ Topshiriq muvaffaqiyatli tasdiqlandi! Telegram kanaliga e'lon qilindi.` };
    }
    if (callbackData.includes('task:reject')) {
      return { text: `❌ Topshiriq operator tomonidan rad etildi va tahrirlashga qaytarildi.` };
    }
    if (callbackData === 'action_retry') {
      return { text: `🔄 Javob qayta shakllantirilmoqda...` };
    }
    if (callbackData === 'action_home') {
      return { text: `🏠 Bosh menyuga qaytildi. Qanday yangi vazifa bor?` };
    }
    if (callbackData === 'menu_agents') {
      return { text: `🤖 Barcha 5 ta mutaxassis agent to‘liq tayyor holatda.` };
    }
    if (callbackData === 'menu_chat') {
      return { text: `💬 AI suhbat maydoni. Istalgan topshiriqni bering:` };
    }
    return { text: `⚡ Amal bajarildi: \`${callbackData}\`` };
  }
}
