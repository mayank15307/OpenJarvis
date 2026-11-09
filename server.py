#!/usr/bin/env python3
"""Server-side Gemini proxy. The API key is read only from the environment."""
import json
import os
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

MODEL = "gemini-3.8-flash"
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent"
MAX_BODY = 16384
SYSTEM_INSTRUCTION = (
    "You are JARVIS, a helpful personal assistant. Be clear, practical, and honest "
    "about uncertainty. Keep responses age-appropriate. Do not provide instructions "
    "for dangerous activities, weapons, drugs, self-harm, or evading safety rules. "
    "You are currently chat-only: you cannot access files, accounts, devices, or "
    "perform actions. Never claim to have performed an external action."
)

class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/api/chat":
            self.send_json(404, {"error": "Not found"})
            return
        key = os.environ.get("GEMINI_API_KEY")
        if not key:
            self.send_json(503, {"error": "The Gemini key is not available to the server. Restart the Codespace and check its secret."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length < 1 or length > MAX_BODY:
                self.send_json(413, {"error": "Message is too large. Please shorten it."})
                return
            payload = json.loads(self.rfile.read(length))
            messages = payload.get("messages", [])
            if not isinstance(messages, list) or not messages or len(messages) > 12:
                self.send_json(400, {"error": "Send between 1 and 12 recent messages."})
                return
            contents = []
            for item in messages:
                if not isinstance(item, dict) or item.get("role") not in ("user", "model"):
                    continue
                value = item.get("text", "")
                if not isinstance(value, str) or not value.strip() or len(value) > 2000:
                    continue
                contents.append({"role": item["role"], "parts": [{"text": value}]})
            if not contents or contents[-1]["role"] != "user":
                self.send_json(400, {"error": "Please enter a message first."})
                return
            request_data = {
                "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
                "contents": contents,
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 700}
            }
            req = urllib.request.Request(
                API_URL,
                data=json.dumps(request_data).encode("utf-8"),
                headers={"Content-Type": "application/json", "x-goog-api-key": key},
                method="POST",
            )
            try:
                with urllib.request.urlopen(req, timeout=45) as response:
                    result = json.loads(response.read().decode("utf-8"))
            except urllib.error.HTTPError as exc:
                if exc.code == 429:
                    self.send_json(429, {"error": "Gemini's free-tier limit may have been reached. Wait a while and try again."})
                elif exc.code in (401, 403):
                    self.send_json(502, {"error": "Gemini rejected the key. Check that it is valid and Gemini API access is enabled."})
                else:
                    self.send_json(502, {"error": "Gemini service error (" + str(exc.code) + "). Please try again later."})
                return
            candidates = result.get("candidates", [])
            parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
            answer = "\n".join(p.get("text", "") for p in parts if isinstance(p, dict))
            if not answer:
                self.send_json(502, {"error": "Gemini returned no text. Please try another question."})
                return
            self.send_json(200, {"reply": answer})
        except (ValueError, json.JSONDecodeError):
            self.send_json(400, {"error": "I couldn't read that request. Please try again."})
        except Exception:
            self.send_json(500, {"error": "JARVIS encountered an unexpected server error."})

    def send_json(self, status, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8000), lambda *a, **kw: Handler(*a, directory="jarvis", **kw))
    print("JARVIS server ready on port 8000 using " + MODEL)
    server.serve_forever()
