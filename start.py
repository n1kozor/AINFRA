import subprocess
import os
import time
import platform
import threading
from pathlib import Path
from dotenv import load_dotenv

# --- Base project directory ---
BASE_DIR = Path(__file__).resolve().parent

# --- Determine Python binary from local venv ---
if platform.system() == "Windows":
    PYTHON_BIN = str(BASE_DIR / ".venv" / "Scripts" / "python.exe")
else:
    PYTHON_BIN = str(BASE_DIR / ".venv" / "bin" / "python")

# --- Determine npm command ---
npm_cmd = "npm.cmd" if platform.system() == "Windows" else "npm"

# --- Load .env for ainfra_llm_microservice ---
load_dotenv(dotenv_path=BASE_DIR / "ainfra_llm_microservice" / ".env")
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    print("❌ OPENAI_API_KEY not found in ainfra_llm_microservice/.env")
    exit(1)

# --- Define all services ---
commands = [
    {
        "name": "app (8000)",
        "cmd": ["uvicorn", "app.main:app", "--reload"],
        "cwd": BASE_DIR
    },
    {
        "name": "ainfra_availability_microservice (8001)",
        "cmd": [PYTHON_BIN, "run.py"],
        "cwd": BASE_DIR / "ainfra_availability_microservice"
    },
    {
        "name": "ainfra_llm_microservice (8002)",
        "cmd": [PYTHON_BIN, "main.py"],
        "cwd": BASE_DIR / "ainfra_llm_microservice",
        "env": {**os.environ, "OPENAI_API_KEY": openai_api_key}
    },
    {
        "name": "frontend (Vite)",
        "cmd": [npm_cmd, "run", "dev"],
        "cwd": BASE_DIR / "ainfra_frontend"
    }
]

# --- Start and log all processes ---
processes = []

for c in commands:
    print(f"\n🚀 Starting: {c['name']}")
    print(f"📂 Directory: {c['cwd']}")
    print(f"🧾 Command: {' '.join(c['cmd'])}")

    try:
        proc = subprocess.Popen(
            c["cmd"],
            cwd=c["cwd"],
            env=c.get("env", os.environ),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        processes.append((c["name"], proc))
    except FileNotFoundError as e:
        print(f"❌ Failed to start {c['name']} – {e}")

# --- Threaded log reader ---
def stream_output(name, proc):
    for line in proc.stdout:
        if line:
            print(f"[{name}] {line.strip()}")

try:
    for name, proc in processes:
        threading.Thread(target=stream_output, args=(name, proc), daemon=True).start()

    # Wait until all processes finish
    while any(proc.poll() is None for _, proc in processes):
        time.sleep(0.5)

except KeyboardInterrupt:
    print("🛑 Shutting down all services...")
    for name, proc in processes:
        proc.terminate()
