import React, { useState, useRef, useEffect } from "react";
import Prism from "prismjs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { nanoid } from "nanoid";
import "prismjs/themes/prism.css";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // Editor, output, and snippets state & refs
  const [code, setCode] = useState(
    () =>
      window.location.hash
        ? decodeURIComponent(window.location.hash.slice(1))
        : "// Write your JavaScript code here!\nconsole.log('Hello, playground!');"
  );
  const [output, setOutput] = useState("");
  const [savedSnippets, setSavedSnippets] = useState(() => {
    try {
      const stored = localStorage.getItem("snippets");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [activeSnippet, setActiveSnippet] = useState(null);
  const outputRef = useRef(null);

  // Syntax highlight update
  useEffect(() => {
    Prism.highlightAll();
  }, [code, savedSnippets, activeSnippet]);

  // Handle saving snippets to localStorage
  useEffect(() => {
    localStorage.setItem("snippets", JSON.stringify(savedSnippets));
  }, [savedSnippets]);

  // Handle restoring code from snippet
  useEffect(() => {
    if (activeSnippet !== null) {
      setCode(savedSnippets[activeSnippet]?.code || "");
    }
  }, [activeSnippet]);

  // PUBLIC_INTERFACE
  const runCode = () => {
    let capturedOutput = "";
    const customConsole = {
      log: (...args) => {
        capturedOutput += args.join(" ") + "\n";
      },
      error: (...args) => {
        capturedOutput += "Error: " + args.join(" ") + "\n";
      }
    };
    try {
      // eslint-disable-next-line no-new-func
      // Use a Function constructor for sandboxed eval
      const result = new Function("console", code)(customConsole);
      if (result !== undefined) {
        capturedOutput += result + "\n";
      }
      setOutput(capturedOutput.trim());
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  // PUBLIC_INTERFACE
  const saveSnippet = () => {
    const name = prompt("Name your snippet:", "Untitled");
    if (!name) return;
    setSavedSnippets([
      { id: nanoid(), name, code },
      ...savedSnippets
    ]);
  };

  // PUBLIC_INTERFACE
  const shareSnippet = () => {
    const hash = encodeURIComponent(code);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    setShareUrl(url);
    window.history.replaceState(null, "", "#" + hash);
  };

  // PUBLIC_INTERFACE
  const deleteSnippet = (id) => {
    setSavedSnippets(snippets => snippets.filter(s => s.id !== id));
    setActiveSnippet(null);
  };

  // PUBLIC_INTERFACE
  const handleSnippetLoad = (idx) => {
    setActiveSnippet(idx);
  };

  // PUBLIC_INTERFACE
  const handleEditorChange = (e) => {
    setCode(e.target.value);
    setActiveSnippet(null);
  };

  // PUBLIC_INTERFACE
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  // Responsive drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="playground-app">
      {/* Navbar */}
      <nav className="navbar">
        <span className="logo">JS Playground</span>
        <a
          className="navbar-link"
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </nav>
      
      <div className="main-content">
        {/* Side panel for snippets */}
        <aside className={`snippets-panel ${drawerOpen ? "open" : ""}`}>
          <div className="snippets-header">
            <span>Saved Snippets</span>
            <button
              className="drawer-toggle"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Toggle snippets panel"
            >
              {drawerOpen ? "⏴" : "⏵"}
            </button>
          </div>
          <ul className="snippets-list">
            {savedSnippets.length === 0 && (
              <li className="snippets-empty">No snippets saved</li>
            )}
            {savedSnippets.map((snippet, idx) => (
              <li key={snippet.id} className={activeSnippet === idx ? "active" : ""}>
                <button className="snippet-name" onClick={() => handleSnippetLoad(idx)}>
                  {snippet.name}
                </button>
                <button
                  className="snippet-delete"
                  title="Delete snippet"
                  onClick={() => deleteSnippet(snippet.id)}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="playground-section">
          {/* Code Editor */}
          <div className="editor-container">
            <div className="editor-header">
              <span>Editor</span>
              <div className="editor-actions">
                <button className="btn" onClick={runCode} title="Run code">
                  ▶ Run
                </button>
                <button className="btn" onClick={saveSnippet} title="Save snippet">
                  💾 Save
                </button>
                <CopyToClipboard text={code} onCopy={handleCopy}>
                  <button className="btn">{copied ? "Copied!" : "📋 Copy"}</button>
                </CopyToClipboard>
                <button className="btn" onClick={shareSnippet} title="Get shareable URL">
                  🔗 Share
                </button>
              </div>
            </div>
            <textarea
              className="code-editor"
              spellCheck={false}
              value={code}
              onChange={handleEditorChange}
              aria-label="JavaScript code editor"
              rows={16}
              tabIndex={0}
            />
            <pre className="editor-highlight">
              <code className="language-js">{code}</code>
            </pre>
            {shareUrl && (
              <div className="share-link">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  aria-label="shareable URL"
                  onFocus={e => e.target.select()}
                />
                <CopyToClipboard text={shareUrl}>
                  <button className="btn btn-small" style={{marginLeft: 4}}>Copy Link</button>
                </CopyToClipboard>
              </div>
            )}
          </div>

          {/* Output Area */}
          <div className="output-container">
            <div className="output-header">Output</div>
            <pre className="output-area" ref={outputRef}>{output}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
