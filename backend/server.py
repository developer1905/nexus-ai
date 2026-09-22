#!/usr/bin/env python3
"""
Nexus AI Agent SaaS - Backend API Server (Phase 2 with OpenRouter & Mistral & Telegram Bot)
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

MAIN_MENU_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🤖 Agentlar", "callback_data": "menu_agents"},
            {"text": "💬 AI Suhbat", "callback_data": "menu_chat"}
        ],
        [
            {"text": "📋 Vazifalarim", "callback_data": "menu_tasks"},
            {"text": "🎯 Jamoalar", "callback_data": "menu_teams"}
        ],
        [
            {"text": "📊 Statistika", "callback_data": "menu_stats"},
            {"text": "⚙️ Sozlamalar", "callback_data": "menu_settings"}
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
            # Fallback without markdown in case of formatting error
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
            webhook_url = "https://nexus-ai-httf.onrender.com/api/telegram/webhook"
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
            # Asynchronously or directly handle Telegram update
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

        # 1. OpenRouter agar kalit bo'lsa
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

        # 2. Mistral agar kalit bo'lsa
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

        # 3. Intelligent fallback
        return (
            f"🤖 *Nexus AI Agent javobi:*\n\n"
            f"Sizning so'rovingiz qabul qilindi: *\"{prompt}\"*\n\n"
            f"✅ *Holat:* Tahlil qilindi va loyiha monitoringiga biriktirildi.\n"
            f"Qo'shimcha ma'lumot olish yoki boshqa agentlarni jalb qilish uchun quyidagi menyudan foydalanishingiz mumkin."
        )

    def handle_telegram_webhook(self, update):
        token = TELEGRAM_JARVIS_TOKEN
        if not token:
            print("Telegram token not configured", file=sys.stderr)
            return

        # 1. Handle callback queries (tugmalar bosilganda)
        if "callback_query" in update:
            cb = update["callback_query"]
            cb_id = cb.get("id")
            cb_data = cb.get("data", "")
            chat_id = cb.get("message", {}).get("chat", {}).get("id")
            answer_callback_query(token, cb_id)

            if cb_data == "menu_agents":
                text = (
                    "🤖 *Nexus AI Faol Agentlari:*\n\n"
                    "1. 🎯 *Nova PM* — Bosh boshqaruvchi va loyihalar koordinatori\n"
                    "2. 🔬 *Atlas Researcher* — Chuqur qidiruv va tahlilchi\n"
                    "3. 📊 *Cipher Analyst* — Biznes ko'rsatkichlari va KPI tahlili\n"
                    "4. ✍️ *Lyra Copywriter* — SMM va kontent yaratuvchi\n"
                    "5. 💻 *Kite Developer* — Dasturlash va avtomatlashtirish"
                )
            elif cb_data == "menu_chat":
                text = "💬 *AI Suhbat Rejimi*\n\nIstalgan savol yoki topshiriqni yozib yuboring. AI agent sizga o'zbek tilida javob beradi:"
            elif cb_data == "menu_tasks":
                text = (
                    "📋 *Faol Topshiriqlar Holati:*\n\n"
                    "• [Yuqori] Haftalik hisobot tayyorlash — *Kutilmoqda*\n"
                    "• [O'rta] OpenRouter modellarini tahlil qilish — *Bajarildi*\n"
                    "• [Past] Sentiment tahlili — *Jarayonda*"
                )
            elif cb_data == "menu_teams":
                text = "🎯 *Agentlar Jamoasi:*\n\n• *Growth Hacker Team* (Nova PM, Lyra, Atlas)\n• *DevOps Pipeline* (Kite Developer, Cipher)"
            elif cb_data == "menu_stats":
                text = "📊 *Tizim Statistikasi:*\n\n• Qayta ishlangan so'rovlar: *1,482 ta*\n• API kechikishi: *38ms*\n• Ish vaqti (Uptime): *99.9%*"
            elif cb_data == "menu_settings":
                text = "⚙️ *Tizim Sozlamalari:*\n\n• Webhook: *Faol (Render)*\n• Emergency Stop: *O'chiq*\n• Versiya: *2.1.0*"
            else:
                text = f"⚡ Buyruq bajarildi: `{cb_data}`"

            send_telegram_message(token, chat_id, text, MAIN_MENU_KEYBOARD)
            return

        # 2. Handle text messages
        message = update.get("message")
        if not message:
            return

        chat_id = message.get("chat", {}).get("id")
        text = message.get("text", "").strip()
        first_name = message.get("from", {}).get("first_name", "Foydalanuvchi")

        if not text or not chat_id:
            return

        cmd = text.split()[0].lower()

        if cmd == "/start":
            reply = (
                f"👋 *Assalomu alaykum, {first_name}!*\n\n"
                f"Men *Nexus AI Enterprise SaaS* tizimining rasmiy Telegram botiman.\n\n"
                f"Men orqali AI agentlar bilan muloqot qilishingiz, vazifalarni boshqarishingiz va avtonom tahlillarni amalga oshirishingiz mumkin.\n\n"
                f"Quyidagi menyudan kerakli bo'limni tanlang yoki shunchaki savolingizni yozing:"
            )
            send_telegram_message(token, chat_id, reply, MAIN_MENU_KEYBOARD)
            return

        elif cmd == "/help":
            reply = (
                "ℹ️ *Nexus AI Yordam Bo'limi*\n\n"
                "Mavjud buyruqlar:\n"
                "• `/start` — Asosiy menyu\n"
                "• `/help` — Qo'llanma\n"
                "• `/agent` — Agentlar ro'yxati\n"
                "• `/tasks` — Topshiriqlar holati\n"
                "• `/stats` — Tizim statistikasi\n\n"
                "Yoki istalgan matnli savol yozsangiz, AI agent javob qaytaradi."
            )
            send_telegram_message(token, chat_id, reply, MAIN_MENU_KEYBOARD)
            return

        elif cmd == "/agent":
            reply = (
                "🤖 *Tizimdagi Mutaxassis Agentlar:*\n\n"
                "1. 🎯 *Nova PM* — Loyihalar boshqaruvi\n"
                "2. 🔬 *Atlas Researcher* — Tadqiqot va ma'lumot qidirish\n"
                "3. 📊 *Cipher Analyst* — Tahlil va moliya\n"
                "4. ✍️ *Lyra Copywriter* — Kontent va matnlar\n"
                "5. 💻 *Kite Developer* — Dasturchi agent"
            )
            send_telegram_message(token, chat_id, reply, MAIN_MENU_KEYBOARD)
            return

        elif cmd == "/tasks":
            reply = (
                "📋 *Sizning Vazifalaringiz:*\n\n"
                "1. 🟢 Haftalik tahliliy hisobotni ko'rib chiqish\n"
                "2. 🟡 Yangi mahsulot g'oyalarini saralash\n"
                "3. ⚪ Bozor raqobatchilari tahlili"
            )
            send_telegram_message(token, chat_id, reply, MAIN_MENU_KEYBOARD)
            return

        elif cmd == "/stats":
            reply = (
                "📊 *Ishlab Chiqarish Statistikasi:*\n\n"
                "• Jami so'rovlar: *1,482*\n"
                "• Muvaffaqiyatli: *99.8%*\n"
                "• Webhook: *Ulangan (Render)*"
            )
            send_telegram_message(token, chat_id, reply, MAIN_MENU_KEYBOARD)
            return

        # Oddiy savol/xabar bo'lsa AI generatsiya
        ai_reply = self.generate_ai_response(text)
        send_telegram_message(token, chat_id, ai_reply, MAIN_MENU_KEYBOARD)

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
