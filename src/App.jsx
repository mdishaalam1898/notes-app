import React from "react";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setaSaved] = useState(false);

  const maxChars = 200;

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));

    if (notes.length) {
      setaSaved(true);

      const timer = setTimeout(() => setaSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [notes]);

  const addNote = () => {
    if (text.trim()) {
      setNotes([...notes, { id: Date.now(), text }]);
      setText("");
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className={`app ${darkMode ? "darkMode" : ""}`}>
      <div className="header">
        <h1>📝 Notes App</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <textarea
        maxLength={maxChars}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your note..."
      />
      <div className="controls">
        <p>{maxChars - text.length} characters left</p>
        <button onClick={addNote}>Add Note</button>
      </div>

      {saved && <p className="saved-msg">💾 Saved!</p>}

      <div className="notes-container">
        {filteredNotes.length ? (
          filteredNotes.map((note) => (
            <div key={note.id} className="note">
              {editId === note.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => {
                    setNotes(
                      notes.map((n) =>
                        n.id === note.id ? { ...n, text: editText } : n
                      )
                    );
                    setEditId(null);
                  }}
                />
              ) : (
                <p
                  onDoubleClick={() => {
                    setEditId(note.id);
                    setEditText(note.text);
                  }}
                >
                  {note.text}
                </p>
              )}
              <button onClick={() => deleteNote(note.id)}>🗑</button>
            </div>
          ))
        ) : (
          <p className="no-notes">No notes found 🗒️</p>
        )}
      </div>
    </div>
  );
};

export default App;
