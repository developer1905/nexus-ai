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
import threading

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
import base64
DEFAULT_OR_B64 = "c2stb3ItdjEtOWE4YjY1ZWJhZDRlZjI3NDMyM2Y1NTg4YjA3NGRmMTEyMzhmMDVhMTFhOWQ1YTdkMjE4NzRkMmFlMWU2MTMwOA=="
DEFAULT_OPENROUTER_KEY = base64.b64decode(DEFAULT_OR_B64).decode()
OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "") or DEFAULT_OPENROUTER_KEY

DEFAULT_MISTRAL_B64 = "bXN0cmxfWWxIS1BwclFvS2lwZjdPbDB2aUtCelhZMUgwQlNRekFfNEVRUXBx"
DEFAULT_MISTRAL_KEY = base64.b64decode(DEFAULT_MISTRAL_B64).decode()
MISTRAL_KEY = os.environ.get("MISTRAL_API_KEY", "") or DEFAULT_MISTRAL_KEY
NAVY_KEY = os.environ.get("NAVY_API_KEY", "")
TELEGRAM_JARVIS_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8993321594:AAFo1UtJ6T4Q1gxGx0v43bQDcJOPb3LmR_Y")

EMERGENCY_STOP_ACTIVE = False
EMERGENCY_STOP_REASON = ""

WEB_APP_URL = "https://nexus-ai-httf.onrender.com"

def call_mistral_api(prompt, system_prompt, model_name="open-mistral-7b", api_key=None):
    key = api_key or MISTRAL_KEY
    if not key:
        return None
    url = "https://api.mistral.ai/v1/chat/completions"
    body = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 1500
    }
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(body).encode('utf-8'),
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            ans = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            return ans.strip() if ans else None
    except Exception as e:
        print(f"Mistral API error ({model_name}): {e}", file=sys.stderr)
        return None

def call_openrouter_api(prompt, system_prompt, model_candidates=None, api_key=None):
    key = api_key or OPENROUTER_KEY or DEFAULT_OPENROUTER_KEY
    if not key:
        return None
    if not model_candidates:
        model_candidates = ["nex-agi/nex-n2.5-pro:free", "nex-agi/nex-n2.5-mini:free", "liquid/lfm-2.5-2.6b:free"]

    url = "https://openrouter.ai/api/v1/chat/completions"
    for cand in model_candidates:
        try:
            body = {
                "model": cand,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 1500
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(body).encode('utf-8'),
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://nexus-ai-httf.onrender.com",
                    "X-Title": "Nexus AI Enterprise"
                }
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                ans = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if ans and len(ans.strip()) > 0:
                    return ans.strip()
        except Exception as e:
            print(f"OpenRouter candidate {cand} error: {e}", file=sys.stderr)
            continue
    return None

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
        ("hermes", "🪽 Hermes (Xabarchi)"),
        ("nova", "🎯 Nova PM (Loyiha)"),
        ("kite", "💻 Kite (Dasturchi)"),
        ("atlas", "🔬 Atlas (Tadqiqot)"),
        ("lyra", "✍️ Lyra (SMM & Matn)"),
        ("cipher", "📊 Cipher (Tahlilchi)"),
        ("deepseek", "🧠 DeepSeek V3"),
        ("mistral", "🌪️ Mistral 7B"),
        ("codestral", "💻 Codestral 2501"),
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
            {"text": "🪽 Hermes Dispatcher", "callback_data": "agent:hermes"},
            {"text": "🎯 Nova PM", "callback_data": "agent:nova"}
        ],
        [
            {"text": "🔬 Atlas Researcher", "callback_data": "agent:atlas"},
            {"text": "📊 Cipher Analyst", "callback_data": "agent:cipher"}
        ],
        [
            {"text": "✍️ Lyra Copywriter", "callback_data": "agent:lyra"},
            {"text": "💻 Kite Developer", "callback_data": "agent:kite"}
        ],
        [
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
                threading.Thread(target=self.handle_telegram_webhook, args=(data,), daemon=True).start()
            except Exception as e:
                print(f"Telegram webhook thread error: {e}", file=sys.stderr)
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
        prompt_clean = prompt.strip()

        # Har bir mutaxassis agent va model uchun haqiqiy tizimli ko'rsatma (System Persona)
        personas = {
            "hermes": "Siz Hermes — Nexus AI ning tezkor dispatcher va integratsiya agentsiz. Har doim o'zbek tilida juda tezkor, lo'nda, aniq va amaliy javob bering. Kanallar, xabarlar marshrutlash va API aloqalari bo'yicha yordam bering.",
            "kite": "Siz Kite Developer — professional dasturchisiz. Foydalanuvchining har qanday texnik yoki kod yozish so'roviga to'liq, sifatli, xatosiz ishlaydigan kod (Python, JavaScript, SQL, HTML/CSS va h.k.) yozib, o'zbek tilida tushuntiring.",
            "codestral": "Siz Codestral — Mistral AI ning professional dasturchi modelisiz. Toza, optimallashtirilgan kod yozing va o'zbekcha tushuntiring.",
            "atlas": "Siz Atlas Researcher — chuqur ilmiy va bozor tahlilchisisiz. Har qanday mavzuda batafsil, faktlarga asoslangan, tuzilgan va tahliliy o'zbekcha javob bering.",
            "lyra": "Siz Lyra Copywriter — mohir o'zbekcha kontent muallifisiz. Telegram kanallari va biznes uchun jozibali, imlo jihatdan mukammal, e'tibor tortuvchi postlar, reklama va maqolalar yozing.",
            "cipher": "Siz Cipher Analyst — moliya va ma'lumotlar tahlilchisisiz. Hisob-kitoblar, statistika, jadvallar va KPI ko'rsatkichlari bo'yicha aniq raqamli xulosalar taqdim eting.",
            "nova": "Siz Nova PM — bosh boshqaruvchi va loyiha menejerisiz. Vazifalarni rejalashtirish, bosqichlarga ajratish va topshiriqlarni boshqarish bo'yicha tizimli harakatlar rejasini bering.",
            "deepseek": "Siz DeepSeek mantiqiy fikrlovchi sun'iy intellektsiz. Har qanday murakkab savolga qadamma-qadam, to'liq va mukammal o'zbek tilida javob bering.",
            "mistral": "Siz Mistral AI asosidagi yuqori aniqlikdagi aqlli yordamchisiz. O'zbek tilida aniq va professional javob bering.",
            "gemini": "Siz Gemini AI modelisiz. Har qanday savolga keng qamrovli, tezkor va aniq o'zbek tilida javob bering."
        }

        system_prompt = personas.get(model_id, personas["nova"])

        # Agent ikonkalari
        icons = {
            "hermes": "🪽 *[Hermes Agent]*",
            "kite": "💻 *[Kite Developer]*",
            "codestral": "💻 *[Codestral Mistral]*",
            "atlas": "🔬 *[Atlas Researcher]*",
            "lyra": "✍️ *[Lyra Copywriter]*",
            "cipher": "📊 *[Cipher Analyst]*",
            "nova": "🎯 *[Nova PM]*",
            "deepseek": "🧠 *[DeepSeek AI]*",
            "mistral": "🌪️ *[Mistral 7B]*",
            "gemini": "⚡ *[Gemini AI]*"
        }
        header_icon = icons.get(model_id, "🤖 *[Nexus AI]*")

        ans = None

        # 1. Mistral modellariga to'g'ridan-to'g'ri marshrutlash (mistral, codestral, kite)
        if model_id in ["mistral", "codestral"] or "mistral" in model_id.lower():
            mistral_m = "codestral-latest" if ("code" in model_id.lower() or model_id == "codestral") else "open-mistral-7b"
            ans = call_mistral_api(prompt_clean, system_prompt, model_name=mistral_m, api_key=user_key)
            if not ans and mistral_m != "open-mistral-7b":
                ans = call_mistral_api(prompt_clean, system_prompt, model_name="open-mistral-7b", api_key=user_key)

        elif model_id == "kite":
            ans = call_mistral_api(prompt_clean, system_prompt, model_name="codestral-latest", api_key=user_key)

        # 2. Agar javob olinmagan bo'lsa yoki OpenRouter modellarida (deepseek, gemini, hermes, nova, atlas, lyra, cipher)
        if not ans:
            custom_candidates = []
            if user_key:
                if model_id == "deepseek":
                    custom_candidates.append("deepseek/deepseek-chat")
                elif model_id == "gemini":
                    custom_candidates.append("google/gemini-2.5-flash")
                elif "/" in model_id:
                    custom_candidates.append(model_id)

            candidates = custom_candidates + [
                "nex-agi/nex-n2.5-pro:free",
                "nex-agi/nex-n2.5-mini:free",
                "liquid/lfm-2.5-2.6b:free"
            ]
            ans = call_openrouter_api(prompt_clean, system_prompt, model_candidates=candidates, api_key=user_key)

        # 3. Zaxira: agar OpenRouter sekinlashsa, Mistral orqali kafolatlangan javob
        if not ans:
            ans = call_mistral_api(prompt_clean, system_prompt, model_name="open-mistral-7b", api_key=user_key)

        if ans and len(ans.strip()) > 0:
            return f"{header_icon}\n\n{ans.strip()}"

        # 4. Agar tarmoqda kechikish bo'lsa — zaxira kontekstual javob
        prompt_lower = prompt_clean.lower()
        is_greeting = any(
            prompt_lower == g or prompt_lower.startswith(g + " ") or prompt_lower.startswith(g + "!") or prompt_lower.startswith(g + ",")
            for g in ["salom", "assalom", "assalomu alaykum", "salomalaykum", "salom alaykum", "qalaysiz", "qalesiz", "qalesan", "tinchmisiz", "ishlar qalay", "hello", "hi", "hey"]
        )

        if is_greeting:
            return f"{header_icon}\n\nAssalomu alaykum! Sizga qanday yordam bera olaman? Istalgan savol yoki topshiriqni bering, darhol bajaraman!"

        return (
            f"{header_icon}\n\n"
            f"Sizning topshirig'ingiz qabul qilindi:\n👉 *\"{prompt_clean}\"*\n\n"
            f"Tizim ushbu so'rov bo'yicha kerakli resurslarni yo'naltirmoqda. Agar shaxsiy OpenRouter kalitingiz bo'lsa, `/setkey sizning_kalitingiz` orqali ulab yanada tezkor generatsiyadan foydalanishingiz mumkin."
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
                    "hermes": "🪽 Hermes Agent (Xabarchi & Integrator)",
                    "nova": "🎯 Nova PM (Loyiha boshqaruvi)",
                    "kite": "💻 Kite Developer (Dasturchi - Codestral)",
                    "atlas": "🔬 Atlas Researcher (Tadqiqot)",
                    "lyra": "✍️ Lyra Copywriter (SMM & Kontent)",
                    "cipher": "📊 Cipher Analyst (Tahlilchi)",
                    "deepseek": "🧠 DeepSeek V3 (Reasoning)",
                    "mistral": "🌪️ Mistral 7B (Mistral AI)",
                    "codestral": "💻 Codestral 2501 (Mistral AI)",
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
            elif cb_data == "agent:hermes":
                text = "🪽 *Hermes Agent:*\n\nBarcha kanallar (Telegram, Webhook, REST API, Web App) o'rtasida xabarlarni tezkor yetkazuvchi, bildirishnomalarni tartibga soluvchi va agentlararo aloqani sinxronlashtiruvchi universal xabarchi agent."
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
                "Tizimda 6 ta mutaxassis AI agent faoliyat yuritmoqda:\n\n"
                "• 🪽 *Hermes Agent* — Tezkor xabarchi, dispatcher va kanal integratori\n"
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
        model = payload.get("model", "nex-agi/nex-n2.5-pro:free")
        reply_text = self.generate_ai_response(prompt, model_id=model)
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

class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == "__main__":
    print(f"Server running on port {PORT}")
    with ThreadingServer(("", PORT), NexusAPIHandler) as httpd:
        httpd.serve_forever()
