"use client";

import { useState } from "react";

export default function Page() {
  const [repoUrl, setRepoUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");

  async function runAgent() {
    setLoading(true);
    setMessages([]);

    setStatus("running agent...");

    const res = await fetch("/api/agent/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoUrl,
        prompt,
      }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value);

      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line) continue;

        setMessages((m) => [...m, { role: "system", text: line }]);
      }
    }

    setLoading(false);
    setStatus("done");
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>⚡ AI Coding Agent</h2>

      <p>Status: {status}</p>

      <input
        placeholder="GitHub Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <textarea
        placeholder="What should the agent do?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%", height: 120 }}
      />

      <button onClick={runAgent} disabled={loading}>
        {loading ? "Running Agent..." : "Run Agent 🚀"}
      </button>

      <hr />

      {messages.map((m, i) => (
        <pre
          key={i}
          style={{
            background: "#111",
            color: "#0f0",
            padding: 10,
            borderRadius: 6,
            whiteSpace: "pre-wrap",
          }}
        >
          {m.text}
        </pre>
      ))}
    </div>
  );
}
