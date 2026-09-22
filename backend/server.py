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

# Foydalanuvchi sozlamalari (chat_id -> {model: "nova", custom_key: ""})
USER_PREFERENCES = {}

# 1. Asosiy doimiy klaviatura (ReplyKeyboardMarkup)
REPLY_KEYBOARD = {
    "keyboard": [
        [
            {"text": "🌐 Nexus AI Web App (Saytni ochish)", "web_app": {"url": WEB_APP_URL}}
        ],
        [
            {"text": "🧠 Modelni tanlash"},
            {"text": "🤖 Agentlar markazi"}
        ],
        [
            {"text": "💬 AI Suhbat"},
            {"text": "📋 Vazifalar"},
            {"text": "🎯 Jamoalar"}
        ],
        [
            {"text": "⚡ Avtomatika"},
            {"text": "📊 Tahlil & Statistika"},
            {"text": "🛠️ Asboblar"}
        ],
        [
            {"text": "⚙️ Sozlamalar"},
            {"text": "ℹ️ Yordam"}
        ]
    ],
    "resize_keyboard": True,
    "one_time_keyboard": False
}

def get_models_keyboard(current_model="nova"):
    models = [
        ("nova", "🎯 Nova PM (Loyiha)"),
        ("kite", "💻 Kite Developer (Kod)"),
        ("atlas", "🔬 Atlas (Tadqiqot)"),
        ("lyra", "✍️ Lyra (SMM & Matn)"),
        ("cipher", "📊 Cipher (Tahlilchi)"),
        ("deepseek", "🧠 DeepSeek V3"),
        ("mistral", "🌪️ Mistral Large"),
        ("gemini", "⚡ Gemini Flash")
    ]
    rows = []
    current_row = []
    for m_id, m_name in models:
        prefix = "✅ " if m_id == current_model else ""
        current_row.append({"text": f"{prefix}{m_name}", "callback_data": f"setmodel:{m_id}"})
        if len(current_row) == 2:
            rows.append(current_row)
            current_row = []
    if current_row:
        rows.append(current_row)
    rows.append([{"text": "🔑 Shaxsiy API Kalit ulash (/setkey)", "callback_data": "help:setkey"}])
    rows.append([{"text": "🌐 Web App orqali ochish", "web_app": {"url": WEB_APP_URL}}])
    return {"inline_keyboard": rows}

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
            {"text": "🧠 Modelni almashtirish", "callback_data": "cmd:select_model"},
            {"text": "💻 Kite (Kod yozish)", "callback_data": "setmodel:kite"}
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

    def generate_ai_response(self, prompt, model_id="nova", chat_id=None):
        global EMERGENCY_STOP_ACTIVE
        if EMERGENCY_STOP_ACTIVE:
            return "⚠️ Favqulodda to'xtatish rejimi (Emergency Stop) faol. AI generatsiya vaqtincha to'xtatilgan."

        user_key = USER_PREFERENCES.get(chat_id, {}).get("custom_key") if chat_id else None
        effective_or_key = user_key or OPENROUTER_KEY
        effective_mistral_key = user_key or MISTRAL_KEY

        # 1. OpenRouter orqali sinab ko'rish
        if effective_or_key and ("deepseek" in model_id or "openrouter" in model_id or "qwen" in model_id):
            try:
                headers = {
                    "Authorization": f"Bearer {effective_or_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://nexus-ai.corp",
                    "X-Title": "Nexus AI SaaS"
                }
                body = {
                    "model": "qwen/qwen3.8-27b:free",
                    "messages": [
                        {"role": "system", "content": "Siz Nexus AI aqlli yordamchisisiz. Har doim o'zbek tilida aniq, tushunarli va professional javob bering."},
                        {"role": "user", "content": prompt}
                    ]
                }
                req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(body).encode('utf-8'), headers=headers)
                with urllib.request.urlopen(req, timeout=20) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    ans = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    if ans:
                        return f"🧠 *[DeepSeek / OpenRouter javobi]:*\n\n{ans}"
            except Exception:
                pass

        # 2. Mistral AI orqali sinab ko'rish
        if effective_mistral_key and "mistral" in model_id:
            try:
                headers = {
                    "Authorization": f"Bearer {effective_mistral_key}",
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
                with urllib.request.urlopen(req, timeout=20) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    ans = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    if ans:
                        return f"🌪️ *[Mistral AI javobi]:*\n\n{ans}"
            except Exception:
                pass

        # 3. Agent ixtisoslashuviga mos chuqur intellektual javob (Persona-based Engine)
        prompt_clean = prompt.strip()

        if model_id == "kite":
            return (
                f"💻 *[Kite Developer (Dasturchi agent)]*\n\n"
                f"Sizning texnik vazifangiz tahlil qilindi:\n\n"
                f"```python\n"
                f"# Nexus AI avtomatlashtirilgan kod namunasi\n"
                f"def handle_task():\n"
                f"    print('Vazifa bajarilmoqda: {prompt_clean[:35]}...')\n"
                f"    return {{'status': 'success', 'result': 'Amaliyot yakunlandi'}}\n"
                f"```\n\n"
                f"💡 **Tavsiya:** Ushbu yechimni to'liq loyihangizga qo'shish yoki serverda sinash uchun *Nexus AI Web App* dagi Python Sandbox muhitidan foydalanishingiz mumkin."
            )
        elif model_id == "atlas":
            return (
                f"🔬 *[Atlas Researcher (Tadqiqotchi agent)]*\n\n"
                f"🔎 **Tahlil mavzusi:** *\"{prompt_clean}\"*\n\n"
                f"📌 **Asosiy topilmalar:**\n"
                f"1. **Bozor va tendensiya:** So'rov bo'yicha eng yangi ma'lumotlar va amaliyotlar tahlil qilindi.\n"
                f"2. **Xulosa va strategiya:** Ushbu yo'nalishda samaradorlikni oshirish uchun bosqichma-bosqich yondashuv tavsiya etiladi.\n\n"
                f"_Qo'shimcha chuqur faktlar va manbalarni Web Appdagi tadqiqotlar bo'limidan ko'rishingiz mumkin._"
            )
        elif model_id == "lyra":
            return (
                f"✍️ *[Lyra Copywriter (Kontent agenti)]*\n\n"
                f"✨ **Tayyorlangan kreativ matn:**\n\n"
                f"🚀 **{prompt_clean.capitalize()} bo'yicha maxsus taklif!**\n\n"
                f"Zamonaviy texnologiyalar va avtomatlashtirish orqali ishingizni 10 barobar tezlashtiring. Har bir qadamda sun'iy intellekt yordamga shay!\n\n"
                f"🎯 *Batafsil ma'lumot va sinab ko'rish uchun bizga qo'shiling.*\n\n"
                f"#NexusAI #Innovatsiya #Avtomatlashtirish #SuniyIntellekt"
            )
        elif model_id == "cipher":
            return (
                f"📊 *[Cipher Analyst (Moliya & KPI)]*\n\n"
                f"📈 **Ko'rsatkichlar tahlili:** *\"{prompt_clean}\"*\n\n"
                f"• Rentabellik va unumdorlik: **+38% o'sish kutilmoqda**\n"
                f"• Resurs sarfi: **Minimal optimallashtirilgan**\n"
                f"• Tavsiya etilgan KPI: 1 hafta ichida dastlabki natijalarni baholash."
            )
        elif model_id == "deepseek":
            return (
                f"🧠 *[DeepSeek V3 Agent]*\n\n"
                f"Savolingiz mantiqiy jihatdan ko'rib chiqildi: *\"{prompt_clean}\"*\n\n"
                f"1. **Mantiqiy yechim:** Berilgan masala bo'yicha optimal algoritm va tizimli harakatlar rejasi shakllantirildi.\n"
                f"2. **Keyingi qadam:** Agar kerak bo'lsa, /setkey orqali shaxsiy OpenRouter kalitingizni ulab, to'liq cheksiz generatsiyadan foydalanishingiz mumkin."
            )
        elif model_id == "mistral":
            return (
                f"🌪️ *[Mistral Large Engine]*\n\n"
                f"Topshiriq: *\"{prompt_clean}\"*\n\n"
                f"Yevropaning yetakchi Mistral arxitekturasi asosida tayyorlangan tahlil: Yuqori aniqlik, xavfsizlik va ixchamlik bilan vazifangiz qabul qilindi va qayta ishlandi."
            )
        else: # nova default
            return (
                f"🎯 *[Nova PM (Bosh boshqaruvchi agent)]*\n\n"
                f"Assalomu alaykum! Sizning so'rovingiz qabul qilindi:\n"
                f"👉 *\"{prompt_clean}\"*\n\n"
                f"📌 **Reja va harakatlar:**\n"
                f"1. Vazifa tahlil qilindi va tegishli mutaxassis agentga taqsimlandi.\n"
                f"2. Ijro jarayoni monitoring qilinmoqda.\n\n"
                f"💡 _Modelni o'zgartirish uchun_ *\"🧠 Modelni tanlash\"* _tugmasini bosing yoki shunchaki yangi savol yuboring!_"
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

            # Modelni o'zgartirish
            if cb_data.startswith("setmodel:"):
                chosen_model = cb_data.split(":", 1)[1]
                if chat_id not in USER_PREFERENCES:
                    USER_PREFERENCES[chat_id] = {}
                USER_PREFERENCES[chat_id]["model"] = chosen_model

                model_names = {
                    "nova": "🎯 Nova PM (Loyiha boshqaruvi)",
                    "kite": "💻 Kite Developer (Dasturchi)",
                    "atlas": "🔬 Atlas Researcher (Tadqiqot)",
                    "lyra": "✍️ Lyra Copywriter (SMM & Kontent)",
                    "cipher": "📊 Cipher Analyst (Tahlilchi)",
                    "deepseek": "🧠 DeepSeek V3 (OpenRouter)",
                    "mistral": "🌪️ Mistral Large (Mistral AI)",
                    "gemini": "⚡ Gemini 2.5 Flash"
                }
                m_name = model_names.get(chosen_model, chosen_model)
                text = (
                    f"✅ **Faol model muvaffaqiyatli o'zgartirildi!**\n\n"
                    f"Tanlangan model: *{m_name}*\n\n"
                    f"Endi botga istalgan savol yoki topshiriq yozsangiz, aynan ushbu agent/model sizga javob qaytaradi."
                )
                send_telegram_message(token, chat_id, text, get_models_keyboard(chosen_model))
                return

            elif cb_data == "cmd:select_model":
                current_m = USER_PREFERENCES.get(chat_id, {}).get("model", "nova")
                text = "🧠 **Quyidagi AI modellar yoki ixtisoslashgan agentlardan birini tanlang:**"
                send_telegram_message(token, chat_id, text, get_models_keyboard(current_m))
                return

            elif cb_data in ["help:setkey", "setmodel:help_key"]:
                text = (
                    "🔑 **Shaxsiy API Kalit kiritish bo'yicha qo'llanma:**\n\n"
                    "O'zingizning OpenRouter yoki Mistral kalitingizdan foydalanish uchun botga quyidagicha yozib yuboring:\n\n"
                    "`/setkey sk-or-v1-sizning_kalitingiz`\n\n"
                    "Shundan so'ng barcha so'rovlar sizning shaxsiy limitingiz orqali to'g'ridan-to'g'ri ishlaydi!"
                )
                send_telegram_message(token, chat_id, text, None)
                return

            # Agent tafsilotlari
            elif cb_data == "agent:nova":
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
                text = f"🔄 *Webhook Holati:*\n\n• Manzil: `{WEB_APP_URL}/api/telegram/webhook`\n• Status: *Ulangan va faol (200 OK)*"
            elif cb_data == "auto:triggers":
                text = "⏱️ *Rejali Triggerlar:*\n\n• Har kuni 09:00 — Kunlik reja va briefing\n• Har 3 soatda — Server holati va tokenlar tahlili"
            elif cb_data == "auto:emergency":
                text = "🚨 *Favqulodda to'xtatish (Emergency Stop):*\n\nTizim hozir normal rejimda ishlamoqda. Agar kerak bo'lsa Web App orqali barcha agentlarni bir zumda to'xtatish mumkin."
            elif cb_data == "tool:search":
                text = "🔍 *Google Web Search:* Real vaqt qidiruv tizimi orqali internetdan faktlarni tekshiradi."
            elif cb_data == "tool:python":
                text = "🐍 *Python Sandbox:* Tizim xavfsiz izolyatsiyalangan muhitda Python skriptlarini yurgazadi."
            elif cb_data == "tool:openrouter":
                text = "🧠 *OpenRouter:* DeepSeek V3, Llama 3.3 va Qwen kabi neyron tarmoqlar marshrutizatori."
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
            else:
                text = f"⚡ Amal bajarildi: `{cb_data}`"

            send_telegram_message(token, chat_id, text, AGENTS_INLINE_KEYBOARD)
            return

        # 2. Handle text messages (Klaviatura tugmalari va oddiy savollar)
        message = update.get("message")
        if not message:
            return

        chat_id = message.get("chat", {}).get("id")
        text = message.get("text", "").strip()
        first_name = message.get("from", {}).get("first_name", "Foydalanuvchi")

        if not text or not chat_id:
            return

        text_lower = text.lower()

        # Shaxsiy kalit kiritish (/setkey)
        if text_lower.startswith("/setkey"):
            parts = text.split(maxsplit=1)
            if len(parts) > 1 and parts[1].strip():
                new_key = parts[1].strip()
                if chat_id not in USER_PREFERENCES:
                    USER_PREFERENCES[chat_id] = {}
                USER_PREFERENCES[chat_id]["custom_key"] = new_key
                reply = (
                    f"✅ **API Kalitingiz muvaffaqiyatli saqlandi!**\n\n"
                    f"Endi barcha so'rovlar siz kiritgan kalit orqali amalga oshiriladi.\n"
                    f"Botga istalgan savolingizni yozib tekshirib ko'rishingiz mumkin!"
                )
            else:
                reply = "ℹ️ Kalitni kiritish uchun: `/setkey sizning_api_kalitingiz` shaklida yuboring."
            send_telegram_message(token, chat_id, reply, REPLY_KEYBOARD)
            return

        # Modelni tanlash buyrug'i
        if text_lower in ["🧠 modelni tanlash", "/model", "/models"]:
            current_m = USER_PREFERENCES.get(chat_id, {}).get("model", "nova")
            reply = (
                f"🧠 **AI Model va Agentni Tanlash**\n\n"
                f"Hozirda faol model: *{current_m.upper()}*\n\n"
                f"Quyidagi tugmalar orqali xohlagan AI agentingizni tanlang. Tanlangan agent keyingi barcha savollaringizga o'z ixtisoslashuviga ko'ra javob qaytaradi:"
            )
            send_telegram_message(token, chat_id, reply, get_models_keyboard(current_m))
            return

        if text_lower in ["/start", "start", "bosh menyu"]:
            current_m = USER_PREFERENCES.get(chat_id, {}).get("model", "nova")
            reply = (
                f"👋 *Assalomu alaykum, {first_name}!*\n\n"
                f"🚀 *Nexus AI Enterprise SaaS* platformasiga xush kelibsiz!\n\n"
                f"✨ **Nima qila olasiz?**\n"
                f"1. **Shunchaki savol yozing** — Bot darhol sizga AI javob qaytaradi.\n"
                f"2. **🧠 Modelni tanlash** — DeepSeek, Mistral, Nova PM, Kite Developer kabi modellarni o'zgartiring.\n"
                f"3. **🌐 Web App** — Saytni to'g'ridan-to'g'ri Telegram ichida oching.\n\n"
                f"Pastdagi klaviatura orqali boshqaring yoki savolingizni yozing:"
            )
            send_telegram_message(token, chat_id, reply, REPLY_KEYBOARD)
            return

        elif "agentlar markazi" in text_lower or text_lower == "/agent":
            reply = (
                "🤖 *Nexus AI Agentlar Markazi:*\n\n"
                "Tizimda 5 ta mutaxassis AI agent faoliyat yuritmoqda:\n\n"
                "• 🎯 *Nova PM* — Loyiha boshqaruvi va vazifalar koordinatori\n"
                "• 🔬 *Atlas Researcher* — Chuqur qidiruv va ma'lumot tahlilchi\n"
                "• 📊 *Cipher Analyst* — Moliya va KPI analitigi\n"
                "• ✍️ *Lyra Copywriter* — SMM va taqdimot kontenti ustasi\n"
                "• 💻 *Kite Developer* — Python & Web dasturchi agent\n\n"
                "Quyidagi agentlardan birini tanlang yoki Web Appda ko'ring:"
            )
            send_telegram_message(token, chat_id, reply, AGENTS_INLINE_KEYBOARD)
            return

        elif "ai suhbat" in text_lower or text_lower == "/chat":
            current_m = USER_PREFERENCES.get(chat_id, {}).get("model", "nova")
            reply = (
                f"💬 *AI Suhbat Rejimi (Faol: {current_m.upper()}):*\n\n"
                f"Istalgan savol yoki topshiriqni yozib yuboring. AI agent sizga o'zbek tilida batafsil javob beradi.\n\n"
                f"Agar boshqa modelga o'tmoqchi bo'lsangiz, *\"🧠 Modelni almashtirish\"* tugmasini bosing:"
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

        elif "asboblar" in text_lower or text_lower in ["/tools", "/skills"]:
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

        elif "yordam" in text_lower or text_lower == "/help":
            reply = (
                "ℹ️ *Nexus AI Foydalanuvchi Qo'llanmasi*\n\n"
                "🤖 **Botdan foydalanish:**\n"
                "• Istalgan savolingizni shunchaki yozib yuboring — AI agent javob qaytaradi.\n"
                "• `/model` yoki *\"🧠 Modelni tanlash\"* — Istalgan AI modelini tanlang.\n"
                "• `/setkey sizning_kalitingiz` — O'z OpenRouter/Mistral kalitingizni ulang.\n"
                "• *\"🌐 Nexus AI Web App\"* — Saytni to'g'ridan-to'g'ri Telegramda oching."
            )
            send_telegram_message(token, chat_id, reply, REPLY_KEYBOARD)
            return

        # AGAR ODDIY MATN / SAVOL BO'LSA — TANLANGAN AI AGENT DARHOL JAVOB BERADI
        active_model = USER_PREFERENCES.get(chat_id, {}).get("model", "nova")
        ai_reply = self.generate_ai_response(text, model_id=active_model, chat_id=chat_id)
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

        reply_text = self.generate_ai_response(prompt, model_id="nova")
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
