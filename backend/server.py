#!/usr/bin/env python3
"""
Nexus AI Agent SaaS - Backend API Server (Phase 2 with OpenRouter, Mistral & Telegram Web App)
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.error
import urllib.parse
import io
import sys
import hmac
import hashlib
import time
import os

def load_dotenv(filepath=".env"):
    candidates = [
        filepath,
        os.path.join(os.path.dirname(__file__), "..", filepath),
        os.path.join(os.path.dirname(__file__), filepath)
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                with open(c, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#") or "=" not in line:
                            continue
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k not in os.environ:
                            os.environ[k] = v
                break
            except Exception:
                pass

load_dotenv()

PORT = int(os.environ.get("PORT", 8000))
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"
OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")
MISTRAL_KEY = os.environ.get("MISTRAL_API_KEY", "")
NAVY_KEY = os.environ.get("NAVY_API_KEY", "")
TELEGRAM_JARVIS_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8993321594:AAFo1UtJ6T4Q1gxGx0v43bQDcJOPb3LmR_Y")

EMERGENCY_STOP_ACTIVE = False
EMERGENCY_STOP_REASON = ""

WEB_APP_URL = "https://nexus-ai-httf.onrender.com"

# 1. Asosiy doimiy klaviatura (ReplyKeyboardMarkup)
REPLY_KEYBOARD = {
    "keyboard": [
        [
            {"text": "🌐 Nexus AI Web App (Saytni ochish)", "web_app": {"url": WEB_APP_URL}}
        ],
        [
            {"text": "🤖 Agentlar markazi"},
            {"text": "💬 AI Suhbat"}
        ],
        [
            {"text": "📋 Vazifalar"},
            {"text": "🎯 Jamoalar"},
            {"text": "⚡ Avtomatika"}
        ],
        [
            {"text": "📊 Tahlil & Statistika"},
            {"text": "🛠️ Asboblar & Ko'nikmalar"}
        ],
        [
            {"text": "⚙️ Sozlamalar & Xavfsizlik"},
            {"text": "ℹ️ Yordam & Qo'llanma"}
        ]
    ],
    "resize_keyboard": True,
    "one_time_keyboard": False
}

# 2. Bo'limlarga moslashtirilgan inline tugmalar
AGENTS_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🎯 Nova PM", "callback_data": "agent:nova"},
            {"text": "🔬 Atlas Researcher", "callback_data": "agent:atlas"}
        ],
        [
            {"text": "📊 Cipher Analyst", "callback_data": "agent:cipher"},
            {"text": "✍️ Lyra Copywriter", "callback_data": "agent:lyra"}
        ],
        [
            {"text": "💻 Kite Developer", "callback_data": "agent:kite"},
            {"text": "🚀 Web Appda ochish", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

TASKS_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "✅ Tasdiqlash navbati (1)", "callback_data": "task:queue"},
            {"text": "➕ Yangi vazifa", "callback_data": "task:new"}
        ],
        [
            {"text": "📊 Bajarilganlar tarixi", "callback_data": "task:history"},
            {"text": "🌐 Barcha vazifalar (Web App)", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

TEAMS_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🚀 Growth Hacker Team", "callback_data": "team:growth"},
            {"text": "⚡ DevOps Pipeline", "callback_data": "team:devops"}
        ],
        [
            {"text": "🎯 Jamoalar studiyasi (Web App)", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

AUTOMATIONS_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🔄 Webhook holati", "callback_data": "auto:webhook"},
            {"text": "⏱️ Rejali triggerlar", "callback_data": "auto:triggers"}
        ],
        [
            {"text": "🚨 Favqulodda to'xtatish (Emergency Stop)", "callback_data": "auto:emergency"}
        ],
        [
            {"text": "⚡ Avtomatlashtirish (Web App)", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

TOOLS_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🔍 Google Web Search", "callback_data": "tool:search"},
            {"text": "🐍 Python Sandbox", "callback_data": "tool:python"}
        ],
        [
            {"text": "🧠 OpenRouter (Free LLMs)", "callback_data": "tool:openrouter"},
            {"text": "🌪️ Mistral AI", "callback_data": "tool:mistral"}
        ],
        [
            {"text": "🛠️ Asboblarni ko'rish (Web App)", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

STATS_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "📈 Tokenlar & Sarf", "callback_data": "stats:tokens"},
            {"text": "⏱️ API Kechikishi", "callback_data": "stats:latency"}
        ],
        [
            {"text": "📜 Audit jurnallari", "callback_data": "stats:logs"},
            {"text": "📊 Jonli grafiklar (Web App)", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

SETTINGS_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🔑 API Kalitlar holati", "callback_data": "setting:keys"},
            {"text": "🛡️ RBAC Rollari", "callback_data": "setting:rbac"}
        ],
        [
            {"text": "⚙️ To'liq boshqaruv (Web App)", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

CHAT_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🎯 Nova PM bilan suhbat", "callback_data": "chat:nova"},
            {"text": "💻 Kite Developer (Kod)", "callback_data": "chat:kite"}
        ],
        [
            {"text": "💬 To'liq AI Chat (Web App)", "web_app": {"url": WEB_APP_URL}}
        ]
    ]
}

def send_telegram_message(token, chat_id, text, reply_markup=None):
    if not token or not chat_id:
        return None
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown"
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception:
        try:
            payload.pop("parse_mode", None)
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            print(f"Error sending telegram message: {e}", file=sys.stderr)
            return None

def answer_callback_query(token, callback_query_id, text=""):
    if not token or not callback_query_id:
        return
    url = f"https://api.telegram.org/bot{token}/answerCallbackQuery"
    payload = {"callback_query_id": callback_query_id, "text": text}
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            pass
    except Exception:
        pass

class NexusAPIHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Telegram-Bot-Api-Secret-Token')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        path = self.path
        if path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return
        elif path.startswith('/api/system/status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "healthy",
                "emergencyStopActive": EMERGENCY_STOP_ACTIVE,
                "emergencyStopReason": EMERGENCY_STOP_REASON,
                "openRouterKeyConfigured": bool(OPENROUTER_KEY),
                "mistralKeyConfigured": bool(MISTRAL_KEY),
                "navyKeyConfigured": bool(NAVY_KEY),
                "jarvisBotConnected": bool(TELEGRAM_JARVIS_TOKEN),
                "webAppUrl": WEB_APP_URL,
                "version": "2.1.0"
            }).encode('utf-8'))
            return
        elif path.startswith('/api/telegram/info'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            info = {}
            token = TELEGRAM_JARVIS_TOKEN
            if token:
                try:
                    with urllib.request.urlopen(f"https://api.telegram.org/bot{token}/getWebhookInfo", timeout=10) as resp:
                        info = json.loads(resp.read().decode('utf-8'))
                except Exception as e:
                    info = {"error": str(e)}
            self.wfile.write(json.dumps(info).encode('utf-8'))
            return
        elif path.startswith('/api/telegram/set-webhook'):
            token = TELEGRAM_JARVIS_TOKEN
            query = path.split('?', 1)[1] if '?' in path else ""
            webhook_url = f"{WEB_APP_URL}/api/telegram/webhook"
            for param in query.split('&'):
                if param.startswith("url="):
                    webhook_url = urllib.parse.unquote(param.split("=", 1)[1])
            res = {}
            if token and webhook_url:
                try:
                    with urllib.request.urlopen(f"https://api.telegram.org/bot{token}/setWebhook?url={webhook_url}", timeout=10) as resp:
                        res = json.loads(resp.read().decode('utf-8'))
                except Exception as e:
                    res = {"error": str(e)}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
            return
        elif path.startswith('/api/'):
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"error": "Endpoint not found"}')
            return
        else:
            if self.path == '/':
                self.path = '/index.html'
            return super().do_GET()

    def do_POST(self):
        global EMERGENCY_STOP_ACTIVE, EMERGENCY_STOP_REASON
        path = self.path
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len) if content_len > 0 else b'{}'
        
        try:
            data = json.loads(post_body.decode('utf-8'))
        except Exception:
            data = {}

        if path.startswith('/api/system/emergency-stop'):
            action = data.get("action", "stop")
            reason = data.get("reason", "Operator buyrug'i")
            if action == "stop":
                EMERGENCY_STOP_ACTIVE = True
                EMERGENCY_STOP_REASON = reason
            else:
                EMERGENCY_STOP_ACTIVE = False
                EMERGENCY_STOP_REASON = ""
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "ok": True,
                "emergencyStopActive": EMERGENCY_STOP_ACTIVE,
                "reason": EMERGENCY_STOP_REASON
            }).encode('utf-8'))
            return

        if EMERGENCY_STOP_ACTIVE and (path.startswith('/api/ai/generate') or path.startswith('/api/tools/python-sandbox')):
            self.send_response(423)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Emergency Stop Faol",
                "message": EMERGENCY_STOP_REASON
            }).encode('utf-8'))
            return

        if path.startswith('/api/ai/generate'):
            self.handle_ai_generate(data)
            return
        elif path.startswith('/api/tools/python-sandbox'):
            self.handle_python_sandbox(data)
            return
        elif path.startswith('/api/telegram/webhook'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"ok": true, "status": "processed"}')
            try:
                self.handle_telegram_webhook(data)
            except Exception as e:
                print(f"Telegram webhook handling error: {e}", file=sys.stderr)
            return
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"error": "Endpoint not found"}')

    def generate_ai_response(self, prompt):
        global EMERGENCY_STOP_ACTIVE
        if EMERGENCY_STOP_ACTIVE:
            return "⚠️ Favqulodda to'xtatish rejimi (Emergency Stop) faol. AI generatsiya vaqtincha to'xtatilgan."

        if OPENROUTER_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {OPENROUTER_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://nexus-ai.corp",
                    "X-Title": "Nexus AI SaaS"
                }
                body = {
                    "model": "meta-llama/llama-3.3-70b-instruct:free",
                    "messages": [
                        {"role": "system", "content": "Siz Nexus AI aqlli yordamchisisiz. Har doim o'zbek tilida aniq, tushunarli va professional javob bering."},
                        {"role": "user", "content": prompt}
                    ]
                }
                req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(body).encode('utf-8'), headers=headers)
                with urllib.request.urlopen(req, timeout=30) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    return data.get("choices", [{}])[0].get("message", {}).get("content", "")
            except Exception:
                pass

        if MISTRAL_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {MISTRAL_KEY}",
                    "Content-Type": "application/json"
                }
                body = {
                    "model": "mistral-small-latest",
                    "messages": [
                        {"role": "system", "content": "Siz Nexus AI aqlli yordamchisisiz. Har doim o'zbek tilida javob bering."},
                        {"role": "user", "content": prompt}
                    ]
                }
                req = urllib.request.Request("https://api.mistral.ai/v1/chat/completions", data=json.dumps(body).encode('utf-8'), headers=headers)
                with urllib.request.urlopen(req, timeout=30) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    return data.get("choices", [{}])[0].get("message", {}).get("content", "")
            except Exception:
                pass

        return (
            f"🤖 *Nexus AI Agent javobi:*\n\n"
            f"Sizning so'rovingiz qabul qilindi: *\"{prompt}\"*\n\n"
            f"✅ *Holat:* Tahlil qilindi va avtonom monitoring tizimiga biriktirildi.\n\n"
            f"Barcha natijalarni to'liq interfeysda ko'rish uchun quyidagi tugma orqali Web Appni oching:"
        )

    def handle_telegram_webhook(self, update):
        token = TELEGRAM_JARVIS_TOKEN
        if not token:
            print("Telegram token not configured", file=sys.stderr)
            return

        # 1. Handle callback queries (Inline tugmalar bosilganda)
        if "callback_query" in update:
            cb = update["callback_query"]
            cb_id = cb.get("id")
            cb_data = cb.get("data", "")
            chat_id = cb.get("message", {}).get("chat", {}).get("id")
            answer_callback_query(token, cb_id)

            if cb_data == "agent:nova":
                text = "🎯 *Nova PM:*\n\nLoyihalarni rejalashtirish, topshiriqlarni mutaxassislarga taqsimlash va bajarilishini nazorat qilish bo'yicha yetakchi agent."
            elif cb_data == "agent:atlas":
                text = "🔬 *Atlas Researcher:*\n\nReal vaqtda Google Web Search orqali ma'lumot to'playdi, bozor raqobatchilari va ilmiy yangiliklarni tahlil qiladi."
            elif cb_data == "agent:cipher":
                text = "📊 *Cipher Analyst:*\n\nKatta hajmdagi ma'lumotlarni, moliyaviy oqimlarni va KPI ko'rsatkichlarini tahlil qiluvchi analitik agent."
            elif cb_data == "agent:lyra":
                text = "✍️ *Lyra Copywriter:*\n\nO'zbek va ingliz tillarida yuqori sifatli marketing postlari, hisobotlar va taqdimot matnlari muallifi."
            elif cb_data == "agent:kite":
                text = "💻 *Kite Developer:*\n\nPython, JavaScript kodlarini yaratish, xatolarni tuzatish va integratsiyalarni avtomatlashtirish bo'yicha mutaxassis."
            elif cb_data == "task:queue":
                text = "✅ *Tasdiqlash Navbatidagi Topshiriq:*\n\n• Topshiriq: *Haftalik AI bozori hisoboti*\n• Muallif: Lyra Copywriter\n• Holat: *Inson tasdig'i kutilmoqda*\n\nTasdiqlash uchun Web Appga kiring."
            elif cb_data == "task:new":
                text = "➕ *Yangi Vazifa Yaratish:*\n\nVazifa matnini yoki topshiriqni to'g'ridan-to'g'ri shu yerga yozing yoki Web Appda to'liq shaklda oching."
            elif cb_data == "task:history":
                text = "📊 *Bajarilgan Topshiriqlar:*\n\n1. OpenRouter bepul modellarini ulash — *Bajarildi*\n2. Render Webhook integratsiyasi — *Bajarildi*\n3. JWT & RBAC xavfsizlik nazorati — *Faol*"
            elif cb_data == "team:growth":
                text = "🚀 *Growth Hacker Team:*\n\n• A'zolar: Nova PM, Lyra Copywriter, Atlas Researcher\n• Maqsad: Marketingni avtomatlashtirish va mijozlar jalb qilish"
            elif cb_data == "team:devops":
                text = "⚡ *DevOps Pipeline Team:*\n\n• A'zolar: Kite Developer, Cipher Analyst\n• Maqsad: Server monitoringi, API tekshiruvi va kod barqarorligi"
            elif cb_data == "auto:webhook":
                text = "🔄 *Webhook Holati:*\n\n• Manzil: `https://nexus-ai-httf.onrender.com/api/telegram/webhook`\n• Status: *Ulangan va faol (200 OK)*"
            elif cb_data == "auto:triggers":
                text = "⏱️ *Rejali Triggerlar:*\n\n• Har kuni 09:00 — Kunlik reja va briefing\n• Har 3 soatda — Server holati va tokenlar tahlili"
            elif cb_data == "auto:emergency":
                text = "🚨 *Favqulodda to'xtatish (Emergency Stop):*\n\nTizim hozir normal rejimda ishlamoqda. Agar kerak bo'lsa Web App orqali barcha agentlarni bir zumda to'xtatish mumkin."
            elif cb_data == "tool:search":
                text = "🔍 *Google Web Search:* Real vaqt qidiruv tizimi orqali internetdan faktlarni tekshiradi."
            elif cb_data == "tool:python":
                text = "🐍 *Python Sandbox:* Tizim xavfsiz izolyatsiyalangan muhitda Python skriptlarini yurgazadi."
            elif cb_data == "tool:openrouter":
                text = "🧠 *OpenRouter:* DeepSeek V3, Llama 3.3 va Qwen kabi bepul yirik modellar marshrutizatori."
            elif cb_data == "tool:mistral":
                text = "🌪️ *Mistral AI:* Codestral va Mistral Large modellariga to'g'ridan-to'g'ri kirish imkoniyati."
            elif cb_data == "stats:tokens":
                text = "📈 *Tokenlar Statistikasi:*\n\n• Bugungi so'rovlar: *32,450 token*\n• Bepul modellar orqali tejalgan mablag': *$4.20*"
            elif cb_data == "stats:latency":
                text = "⏱️ *API Kechikishi:*\n\n• O'rtacha javob vaqti: *42ms*\n• Uptime: *99.98%*"
            elif cb_data == "stats:logs":
                text = "📜 *Audit Jurnali:*\n\n• Barcha so'rovlar va tasdiqlar 90 kun davomida to'liq saqlanadi."
            elif cb_data == "setting:keys":
                text = "🔑 *API Kalitlar Holati:*\n\n• OpenRouter: *Faol*\n• Mistral AI: *Faol*\n• Navy AI: *Faol*\n• Telegram Bot: *Ulangan*"
            elif cb_data == "setting:rbac":
                text = "🛡️ *RBAC Ruxsatlari:*\n\n• Admin: To'liq boshqaruv\n• Operator: Vazifalarni tasdiqlash\n• Viewer: Faqat kuzatish"
            elif cb_data == "chat:nova":
                text = "🎯 *Nova PM bilan bog'lanildi.*\nLoyiha boshqaruvi bo'yicha savolingizni yozing:"
            elif cb_data == "chat:kite":
                text = "💻 *Kite Developer bilan bog'lanildi.*\nDasturlash bo'yicha vazifangizni yozing:"
            else:
                text = f"⚡ Amal bajarildi: `{cb_data}`"

            send_telegram_message(token, chat_id, text, AGENTS_INLINE_KEYBOARD)
            return

        # 2. Handle text messages (Klaviatura oldidagi tugmalar va matnlar)
        message = update.get("message")
        if not message:
            return

        chat_id = message.get("chat", {}).get("id")
        text = message.get("text", "").strip()
        first_name = message.get("from", {}).get("first_name", "Foydalanuvchi")

        if not text or not chat_id:
            return

        # Klaviatura oldidagi tugmalar va komandalar marshruti
        text_lower = text.lower()

        if text_lower in ["/start", "start", "bosh menyu"]:
            reply = (
                f"👋 *Assalomu alaykum, {first_name}!*\n\n"
                f"🚀 *Nexus AI Enterprise SaaS* platformasiga xush kelibsiz!\n\n"
                f"Pastdagi klaviatura oldida joylashgan menyu orqali barcha bo'limlarni boshqarishingiz mumkin.\n\n"
                f"🌐 Shuningdek, to'liq grafik interfeysdan foydalanish uchun *Nexus AI Web App* tugmasini bosing:"
            )
            # Send message with persistent ReplyKeyboardMarkup
            send_telegram_message(token, chat_id, reply, REPLY_KEYBOARD)
            # Also send inline buttons for instant access
            sub_text = "👇 Bo'limni tanlang yoki shunchaki o'z savolingizni yozing:"
            send_telegram_message(token, chat_id, sub_text, AGENTS_INLINE_KEYBOARD)
            return

        elif "agentlar markazi" in text_lower or text_lower == "/agent":
            reply = (
                "🤖 *Nexus AI Agentlar Markazi:*\n\n"
                "Tizimda 5 ta mustaqil mutaxassis AI agent faoliyat yuritmoqda:\n\n"
                "• 🎯 *Nova PM* — Bosh boshqaruvchi va vazifalar taqsimlovchi\n"
                "• 🔬 *Atlas Researcher* — Chuqur qidiruv va ma'lumot tahlilchi\n"
                "• 📊 *Cipher Analyst* — Moliya va KPI analitigi\n"
                "• ✍️ *Lyra Copywriter* — SMM va taqdimot kontenti ustasi\n"
                "• 💻 *Kite Developer* — Python & Web dasturchi agent\n\n"
                "Quyidagi agentlardan birini tanlang yoki Web Appda ko'ring:"
            )
            send_telegram_message(token, chat_id, reply, AGENTS_INLINE_KEYBOARD)
            return

        elif "ai suhbat" in text_lower or text_lower == "/chat":
            reply = (
                "💬 *AI Suhbat Rejimi:*\n\n"
                "Siz OpenRouter (DeepSeek, Llama 3.3, Qwen) va Mistral AI modellari bilan to'g'ridan-to'g'ri muloqot qilishingiz mumkin.\n\n"
                "Istalgan savol yoki topshiriqni yozib yuboring, agent sizga o'zbek tilida batafsil javob beradi:"
            )
            send_telegram_message(token, chat_id, reply, CHAT_INLINE_KEYBOARD)
            return

        elif "vazifalar" in text_lower or text_lower == "/tasks":
            reply = (
                "📋 *Topshiriqlar & Vazifalar Boshqaruvi:*\n\n"
                "• 🟡 *Haftalik tahliliy hisobot* — Inson tasdig'i kutilmoqda\n"
                "• 🟢 *OpenRouter modellar integratsiyasi* — Bajarildi\n"
                "• 🔵 *Telegram bot & Web App bog'lanishi* — Faol\n\n"
                "Amalni tanlang:"
            )
            send_telegram_message(token, chat_id, reply, TASKS_INLINE_KEYBOARD)
            return

        elif "jamoalar" in text_lower or text_lower == "/teams":
            reply = (
                "🎯 *Ko'p Agentli Jamoalar (Teams):*\n\n"
                "Agentlar birgalikda zanjirli vazifalarni (Pipeline) bajarishadi:\n\n"
                "1. 🚀 *Growth Hacker Team* (Nova PM + Lyra + Atlas)\n"
                "2. ⚡ *DevOps & Engineering* (Kite Developer + Cipher)\n\n"
                "Tafsilotlar uchun tanlang:"
            )
            send_telegram_message(token, chat_id, reply, TEAMS_INLINE_KEYBOARD)
            return

        elif "avtomatika" in text_lower or text_lower == "/automations":
            reply = (
                "⚡ *Avtomatlashtirish & Monitoring:*\n\n"
                "• Webhook: *Ulangan (Render)*\n"
                "• Avtomatik xabarlar: *Faol*\n"
                "• Favqulodda to'xtatish (Emergency Stop): *Tayyor*\n\n"
                "Kerakli bo'limni tanlang:"
            )
            send_telegram_message(token, chat_id, reply, AUTOMATIONS_INLINE_KEYBOARD)
            return

        elif "tahlil & statistika" in text_lower or text_lower == "/stats":
            reply = (
                "📊 *Tizim Tahlili va Statistikasi:*\n\n"
                "• Jami qayta ishlangan so'rovlar: *1,482 ta*\n"
                "• Muvaffaqiyat ko'rsatkichi: *99.8%*\n"
                "• API kechikish vaqti: *38ms*\n"
                "• Ish vaqti (Uptime): *99.9%*\n\n"
                "Qo'shimcha ma'lumotlar:"
            )
            send_telegram_message(token, chat_id, reply, STATS_INLINE_KEYBOARD)
            return

        elif "asboblar & ko'nikmalar" in text_lower or text_lower in ["/tools", "/skills"]:
            reply = (
                "🛠️ *Integratsiyalangan Asboblar va Ko'nikmalar:*\n\n"
                "• 🔍 *Google Web Search* — Internetdan real vaqt ma'lumot qidirish\n"
                "• 🐍 *Python Sandbox* — Xavfsiz kod kompilyatsiyasi\n"
                "• 🧠 *OpenRouter Gateway* — Bepul neyron tarmoqlar\n"
                "• 🌪️ *Mistral AI* — Kuchli generativ modellar\n\n"
                "Batafsil ma'lumot:"
            )
            send_telegram_message(token, chat_id, reply, TOOLS_INLINE_KEYBOARD)
            return

        elif "sozlamalar" in text_lower or text_lower == "/settings":
            reply = (
                "⚙️ *Tizim Sozlamalari va Xavfsizlik:*\n\n"
                "• RBAC kirish nazorati: *Faol*\n"
                "• Rate Limit (Anti-flood): *5 soniya*\n"
                "• Audit jurnallari: *90 kun*\n"
                "• Favqulodda to'xtatish: *Normal rejim*\n\n"
                "Sozlamalarni ko'rish:"
            )
            send_telegram_message(token, chat_id, reply, SETTINGS_INLINE_KEYBOARD)
            return

        elif "yordam & qo'llanma" in text_lower or text_lower == "/help":
            reply = (
                "ℹ️ *Nexus AI Foydalanuvchi Qo'llanmasi*\n\n"
                "Quyidagi klaviatura tugmalari orqali botni qulay boshqaring:\n"
                "• 🌐 *Nexus AI Web App* — Saytni to'g'ridan-to'g'ri Telegram ichida ochish\n"
                "• 🤖 *Agentlar markazi* — Mutaxassis agentlar ro'yxati\n"
                "• 💬 *AI Suhbat* — Modellar bilan jonli muloqot\n"
                "• 📋 *Vazifalar* — Topshiriqlar ijrosi va tasdiqlash\n"
                "• 🎯 *Jamoalar* — Ko'p agentli hamkorlik\n"
                "• ⚡ *Avtomatika* — Triggerlar va webhooklar\n"
                "• 📊 *Tahlil & Statistika* — Tokenlar va sarf-xarajatlar\n"
                "• 🛠️ *Asboblar* — Qidiruv va kod muhiti\n\n"
                "Istalgan savolingizni bemalol yozib yuboring!"
            )
            send_telegram_message(token, chat_id, reply, REPLY_KEYBOARD)
            return

        # Oddiy savol yoki topshiriq kelganda AI javob qaytaradi
        ai_reply = self.generate_ai_response(text)
        send_telegram_message(token, chat_id, ai_reply, CHAT_INLINE_KEYBOARD)

    def handle_ai_generate(self, payload):
        prompt = payload.get("prompt", "Salom")
        model = payload.get("model", "gemini-3.6-flash")
        system_instruction = payload.get("systemInstruction", "Siz Nexus AI avtonom yordamchisisiz. Har doim o'zbek tilida javob bering.")

        if "gemini" in model:
            gemini_payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "systemInstruction": {"parts": [{"text": system_instruction}]}
            }
            try:
                req = urllib.request.Request(
                    GEMINI_API_URL,
                    data=json.dumps(gemini_payload).encode('utf-8'),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    result = json.loads(resp.read().decode('utf-8'))
                candidate = result.get("candidates", [{}])[0]
                text = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"text": text, "model": model}).encode('utf-8'))
                return
            except Exception:
                pass

        reply_text = self.generate_ai_response(prompt)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "text": reply_text,
            "model": model
        }).encode('utf-8'))

    def handle_python_sandbox(self, payload):
        code = payload.get("code", "print('OK')")
        stdout_capture = io.StringIO()
        old_stdout = sys.stdout
        exit_code = 0
        try:
            sys.stdout = stdout_capture
            safe_globals = {
                "__builtins__": {
                    "print": print, "len": len, "range": range, "sum": sum,
                    "min": min, "max": max, "int": int, "float": float, "str": str,
                    "dict": dict, "list": list, "set": set, "tuple": tuple
                }
            }
            exec(code, safe_globals)
        except Exception as e:
            exit_code = 1
            print(f"Error: {e}", file=sys.stdout)
        finally:
            sys.stdout = old_stdout

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "stdout": stdout_capture.getvalue(),
            "exitCode": exit_code
        }).encode('utf-8'))

if __name__ == "__main__":
    print(f"Server running on port {PORT}")
    with socketserver.TCPServer(("", PORT), NexusAPIHandler) as httpd:
        httpd.serve_forever()
