import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Login from './Login'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [code, setCode] = useState(`// Write your code here...`)
  const [review, setReview] = useState(``)
  const [history, setHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`history_${user.uid}`)
      if (saved) setHistory(JSON.parse(saved))
    }
  }, [user])

  async function reviewCode() {
    if (loading) return
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      const result = response.data.review || response.data
      setReview(result)

      const newEntry = {
        id: Date.now(),
        code: code.slice(0, 100),
        review: result,
        date: new Date().toLocaleDateString()
      }
      const updated = [newEntry, ...history].slice(0, 50)
      setHistory(updated)
      localStorage.setItem(`history_${user.uid}`, JSON.stringify(updated))
    } catch (error) {
      setReview('Error: Could not get review.')
    } finally {
      setLoading(false)
    }
  }

  function loadHistory(entry) {
    setCode(entry.code)
    setReview(entry.review)
  }

  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)
  const recentHistory = history.filter(h => new Date(h.date) >= fifteenDaysAgo)

  if (!user) return <Login onLogin={setUser} />

  return (
    <div className="app-container">

      {/* ── Sidebar ── */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
        {sidebarOpen && (
          <>
            <div className="sidebar-header">
              <img src={user.photoURL} alt="avatar" className="avatar" />
              <span className="sidebar-username">{user.displayName}</span>
              <button onClick={() => signOut(auth)} className="logout-btn">Logout</button>
            </div>
            <h3>History (15 days)</h3>
            <div className="history-list">
              {recentHistory.length === 0 && <p className="no-history">No history yet</p>}
              {recentHistory.map(entry => (
                <div key={entry.id} className="history-item" onClick={() => loadHistory(entry)}>
                  <span className="history-date">{entry.date}</span>
                  <p>{entry.code}…</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="main-content">

        <div className="welcome-banner">
          <h2>AI Code <span>Reviewer</span></h2>
          <p>Enter code and click "Review" to get AI-powered feedback</p>
        </div>

        <main>

          {/* ── Left: Editor ── */}
          <div className="left">

            {/* macOS-style topbar */}
            <div className="editor-topbar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="editor-label">editor.js</span>
            </div>

            {/* Scrollable editor area */}
            <div className="code">
              <Editor
                value={code}
                onValueChange={c => setCode(c)}
                highlight={c => prism.highlight(c, prism.languages.javascript, "javascript")}
                padding={16}
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 14,
                  lineHeight: 1.65,
                  minHeight: '100%',
                  width: '100%',
                  background: 'transparent',
                }}
              />
            </div>

            {/* Review button bar — separate from scroll area */}
            <div className="review-bar">
              <span className="char-count">{code.length} chars</span>
              <button
                className={`review ${loading ? 'loading' : ''}`}
                onClick={reviewCode}
                disabled={loading}
              >
                {loading ? '⏳ Reviewing…' : '▶ Review'}
              </button>
            </div>

          </div>

          {/* ── Right: Result ── */}
          <div className="right">
            <div className="result-topbar">
              <span className="result-topbar-icon" />
              <span>ai-review.md</span>
            </div>
            <div className="result-body">
              {review
                ? <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
                : (
                  <div className="result-empty">
                    <div className="result-empty-icon">✦</div>
                    <p>Your review will appear here</p>
                  </div>
                )
              }
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default App