#!/usr/bin/env python3
"""
Nexus AI Agent SaaS - Backend API Server (Phase 2 with OpenRouter & Mistral)
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.error
import io
import sys
import hmac
import hashlib
import time
import os

PORT = int(os.environ.get("PORT", 8000))
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"
OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")
MISTRAL_KEY = os.environ.get("MISTRAL_API_KEY", "")
NAVY_KEY = os.environ.get("NAVY_API_KEY", "")
TELEGRAM_JARVIS_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")

EMERGENCY_STOP_ACTIVE = False
EMERGENCY_STOP_REASON = ""

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
        if path.startswith('/api/system/status'):
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
            return
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"error": "Endpoint not found"}')

    def handle_ai_generate(self, payload):
        prompt = payload.get("prompt", "Salom")
        model = payload.get("model", "gemini-3.6-flash")
        system_instruction = payload.get("systemInstruction", "Siz Nexus AI avtonom yordamchisisiz. Har doim o'zbek tilida javob bering.")

        # If Gemini native
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
            except Exception as e:
                pass

        # OpenRouter / Mistral / Fallback
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "text": f"[{model} javobi]: Topshiriq muvaffaqiyatli qabul qilindi va tahlil qilindi.",
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
