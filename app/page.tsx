"use client";

import { useState } from "react";

type Provider = "groq" | "openai" | "gemini" | "claude";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<Provider>("groq");
  const [model, setModel] = useState("llama-3.1-8b-instant");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const models: Record<Provider, string[]> = {
    groq: ["llama-3.1-8b-instant"],
    openai: ["gpt-4o-mini"],
    gemini: ["gemini-1.5-flash"],
    claude: ["claude-3-haiku-20240307"],
  };

  async function runAgent() {
    setLoading(true);
    setOutput("");

    const res = await fetch("/api/agent/run", {
      method: "POST",
      body: JSON.stringify({
        repoUrl,
        prompt,
        provider,
        model,
      }),
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        const chunk = decoder.decode(value);
        setOutput((prev) => prev + chunk);

        if (chunk.includes("RESULT:")) {
          setLoading(false);
        }
      }
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚡ Mini Coding Agent</h2>

      {/* Repo */}
      <input
        style={styles.input}
        placeholder="GitHub Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />

      {/* Prompt */}
      <textarea
        style={styles.textarea}
        placeholder="What do you want to change?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Provider + Model */}
      <div style={styles.row}>
        <select
          style={styles.select}
          value={provider}
          onChange={(e) => {
            const p = e.target.value as Provider;
            setProvider(p);
            setModel(models[p][0]);
          }}
        >
          <option value="groq">Groq</option>
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
          <option value="claude">Claude</option>
        </select>

        <select
          style={styles.select}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {models[provider].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Run Button */}
      <button style={styles.button} onClick={runAgent} disabled={loading}>
        {loading ? "Running..." : "Run Agent"}
      </button>

      {/* Output */}
      <pre style={styles.output}>{output}</pre>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 16,
    maxWidth: 600,
    margin: "auto",
    fontFamily: "sans-serif",
  },
  title: {
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  textarea: {
    width: "100%",
    height: 100,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },
  select: {
    flex: 1,
    padding: 10,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  output: {
    marginTop: 20,
    padding: 10,
    background: "#111",
    color: "#0f0",
    height: 300,
    overflow: "auto",
    whiteSpace: "pre-wrap",
  },
};
