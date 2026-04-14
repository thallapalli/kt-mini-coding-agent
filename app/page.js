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
    if (!repoUrl || !apiKey || !prompt) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setStatus("sending request...");

    setMessages((m) => [...m, { role: "user", text: prompt }]);

    try {
      setStatus("running agent...");

      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
          prompt,
          apiKey,
        }),
      });

      setStatus("processing result...");

      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: JSON.stringify(data.result, null, 2),
        },
      ]);

      setStatus("done");
    } catch (err) {
      setStatus("error");

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: err.message,
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>⚡ AI Coding Agent (Vercel)</h2>

      <p><b>Status:</b> {status}</p>

      <input
        placeholder="GitHub Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <input
        placeholder="API Key (Groq/OpenAI)"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
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

      <div>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <b>{m.role}</b>
            <pre style={{ whiteSpace: "pre-wrap" }}>{m.text}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
