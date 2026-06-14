import { useEffect, useState } from "react";
import { FiCopy, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import "./App.css";

interface ClipboardItem {
  id: number;
  text: string;
}

function ClipboardCard({ item, onCopy, onDelete }: { item: ClipboardItem; onCopy: (text: string) => void; onDelete: (id: number) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 100;
  
  const cleanText = item.text.replace(/\\n/g, "\n");
  const isLongText = cleanText.length > characterLimit;

  const displayText = isLongText && !isExpanded 
    ? `${cleanText.substring(0, characterLimit)}...` 
    : cleanText;

  return (
    <div className="card">
      <div className="card-row">
        <span style={{ whiteSpace: "pre-wrap" }}>{displayText}</span>
        {isLongText && (
          <button 
            className="expand-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ display: "block", background: "none", border: "none", color: "#007bff", cursor: "pointer", padding: "4px 0", fontSize: "0.85rem" }}
          >
            {isExpanded ? (
              <span style={{ display: "flex", alignItems: "center", gap: "2px" }}><FiChevronUp /> Show less</span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "2px" }}><FiChevronDown /> Expand more</span>
            )}
          </button>
        )}
      </div>

      <div className="actions">
        <button className="icon-btn" onClick={() => onCopy(cleanText)}>
          <FiCopy size={14} />
        </button>

        <button className="icon-btn" onClick={() => onDelete(item.id)}>
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const copyToClipboard = async (text: string) => {
    localStorage.setItem("skip_next_monitor_write", "true");
    await navigator.clipboard.writeText(text);
  };

  async function getFromQuery(query: string) {
    try {
      const res = await fetch(
        `http://localhost:8000/?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setClipboardItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getClipboard() {
    try {
      const res = await fetch("http://localhost:8000/clipboard");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setClipboardItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteCard = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/clipboard/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (searchQuery.trim()) {
          getFromQuery(searchQuery);
        } else {
          getClipboard();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        getFromQuery(searchQuery);
      } else {
        getClipboard();
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="app">
      <div className="header">
        <h3>SearchClip</h3>
        <button className="clear-btn" onClick={getClipboard}>
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search clipboard..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="list">
        {clipboardItems.map((item) => (
          <ClipboardCard 
            key={item.id} 
            item={item} 
            onCopy={copyToClipboard} 
            onDelete={deleteCard} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;