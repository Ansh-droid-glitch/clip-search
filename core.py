import threading
import time
import chromadb
import pyperclip
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

chroma_client = chromadb.Client()

def load_clipboard_file() -> list[str]:
    try:
        with open("clipboard.txt", "r", encoding="utf-8") as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        return []

def save_clipboard_file(lines: list[str]):
    with open("clipboard.txt", "w", encoding="utf-8") as f:
        for line in lines:
            f.write(line + "\n")

def clipboard_monitor():
    last = ""
    while True:
        try:
            current = pyperclip.paste()
            if current:
                current = current.strip()

            if current and current != last:
                sanitized_current = current.replace("\n", "\\n")
                print("Content saved:", current)
                with open("clipboard.txt", "a", encoding="utf-8") as f:
                    f.write(sanitized_current + "\n")
                
                last = current

            time.sleep(0.1)
        except Exception as e:
            print(f"Monitor error: {e}")
            time.sleep(1)

@app.on_event("startup")
def startup_event():
    monitor_thread = threading.Thread(target=clipboard_monitor, daemon=True)
    monitor_thread.start()

@app.get("/")
async def read_and_return_query(query: str):
    clipboard_items = load_clipboard_file()
    if not clipboard_items:
        return []

    unique_items = []
    seen = set()
    for item in clipboard_items:
        if item not in seen:
            seen.add(item)
            unique_items.append(item)

    try:
        chroma_client.delete_collection("docs")
    except Exception:
        pass
        
    collection = chroma_client.create_collection("docs")
    collection.add(
        documents=unique_items,
        ids=[str(i) for i in range(len(unique_items))]
    )
    
    results = collection.query(
        query_texts=[query],
        n_results=min(5, len(unique_items))
    )
    
    formatted_results = []
    if results["documents"] and results["documents"][0]:
        for doc in results["documents"][0]:
            try:
                original_idx = clipboard_items.index(doc)
            except ValueError:
                original_idx = 0
                
            formatted_results.append({
                "id": original_idx,
                "text": doc
            })
            
    return formatted_results

@app.get("/clipboard")
async def get_clipboard():
    lines = load_clipboard_file()
    return [{"id": idx, "text": line} for idx, line in enumerate(lines)]

@app.delete("/clipboard/{item_id}")
async def delete_clipboard_item(item_id: int):
    lines = load_clipboard_file()
    if 0 <= item_id < len(lines):
        lines.pop(item_id)
        save_clipboard_file(lines)
    return {"success": True}