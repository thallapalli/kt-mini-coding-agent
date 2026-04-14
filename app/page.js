"use client";

import { useState } from "react";

export default function Page() {
  const [repoUrl, setRepoUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");

  async function runAgent() {
    setLoading(true);
    setStatus("running agent...");

    setMessages((m) => [...m, { role: "user", text: prompt }]);

    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, apiKey, prompt }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: JSON.stringify(data.result, null, 2),
        },
      ]);

      setStatus("done");
    } catch (e) {
      setStatus("error");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>⚡ AI Coding Agent</h2>

      <p>Status: {status}</p>

      <input
        placeholder="Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <textarea
        placeholder="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ display: "block", marginBottom: 10, height: 120 }}
      />

      <button onClick={runAgent} disabled={loading}>
        {loading ? "Running..." : "Run Agent"}
      </button>

      <hr />

      {messages.map((m, i) => (
        <pre key={i} style={{ background: "#111", color: "#0f0", padding: 10 }}>
          {m.role}: {m.text}
        </pre>
      ))}
    </div>
  );
}
