"use client";

import { useState, useEffect } from "react";
import { MODEL_CONFIG } from "@/lib/agent/models";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [prompt, setPrompt] = useState("");

  const [provider, setProvider] = useState("groq");
  const [model, setModel] = useState(MODEL_CONFIG.groq[0]);
  const [apiKey, setApiKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setModel(MODEL_CONFIG[provider][0]);
  }, [provider]);

  const runAgent = async () => {
    setLoading(true);
    setLogs([]);

    const res = await fetch("/api/agent/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoUrl,
        prompt,
        llmConfig: {
          provider,
          model,
          apiKey,
        },
      }),
    });

    const data = await res.json();
    setLogs([JSON.stringify(data, null, 2)]);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ Mini Coding Agent</h1>

      <input
        style={styles.input}
        placeholder="GitHub Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />

      <textarea
        style={styles.textarea}
        placeholder="Describe your change..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* PROVIDER SELECT */}
      <select
        style={styles.input}
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <option value="groq">Groq</option>
        <option value="openai">OpenAI</option>
        <option value="gemini">Gemini</option>
        <option value="claude">Claude</option>
      </select>

      {/* MODEL SELECT */}
      <select
        style={styles.input}
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        {MODEL_CONFIG[provider].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* API KEY */}
      <input
        style={styles.input}
        placeholder="API Key"
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <button style={styles.button} onClick={runAgent} disabled={loading}>
        {loading ? "Running..." : "Run Agent 🚀"}
      </button>

      <div style={styles.output}>
        {logs.map((l, i) => (
          <pre key={i}>{l}</pre>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  title: {
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    height: 120,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  button: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    background: "black",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },
  output: {
    marginTop: 20,
    background: "#111",
    color: "#0f0",
    padding: 10,
    borderRadius: 8,
    fontSize: 12,
    overflowX: "auto",
  },
};
