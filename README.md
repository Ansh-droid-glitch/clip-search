# ClipSearch

ClipSearch is a cross-platform desktop clipboard manager that lets you search, manage, and delete your clipboard history instantly.

It runs fully locally using an Electron + React frontend with a Python FastAPI backend powered by Uvicorn.

---

## ✨ Features

- 📋 Automatic clipboard history tracking  
- 🔍 Fast search across all copied text  
- 🧠 Backend-ready semantic search support  
- 🗑️ Delete clipboard entries  
- ⚡ Instant reuse of past copied content  
- 🖥️ Cross-platform (Windows, Linux, macOS)  
- 🔒 Fully local (no cloud, no tracking)

---

## 🧱 Tech Stack

**Frontend**
- Electron
- React
- Vite
- TypeScript

**Backend**
- Python
- FastAPI
- Uvicorn

**Build System**
- electron-builder
- Makefile automation

---

## 📁 Project Structure

```text
ClipSearch/
├── app/                    # Electron + React frontend
│   ├── dist-electron/      # Compiled Electron main process
│   ├── dist-react/         # Built React frontend
│   ├── src/                # Source code
│   └── package.json
│
├── core.py                 # FastAPI backend entry point
├── requirements.txt        # Python dependencies
├── Makefile                # Build & run automation
└── venv/                   # Python virtual environment