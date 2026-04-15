"use client";

import { useState, useEffect } from "react";
import Auth from "@/components/Auth";
import RepoBrowser from "@/components/RepoBrowser";
import ProjectContext from "@/components/ProjectContext";
import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

type Provider = "groq" | "openai" | "gemini" | "claude";

interface Project {
  id: string
  repo_id: number
  repo_name: string
  repo_full_name: string
  repo_url: string
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showRepoBrowser, setShowRepoBrowser] = useState(false);
  
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<Provider>("groq");
  const [model, setModel] = useState("llama-3.1-8b-instant");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const models: Record<Provider, string[]> = {
    groq: ["llama-3.1-8b-instant"],
    openai: ["gpt-4o-mini"],
    gemini: ["gemini-1.5-flash"],
    claude: ["claude-3-haiku-20240307"],
  };

  async function runAgent() {
    if (!activeProject) {
      alert("Please select a project first");
      return;
    }

    setLoading(true);
    setOutput("");

    const res = await fetch("/api/agent/run", {
      method: "POST",
      body: JSON.stringify({
        repoUrl: activeProject.repo_url,
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

  const handleSelectRepo = async (repo: any) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: session.user.id,
          repo_id: repo.id,
          repo_name: repo.name,
          repo_full_name: repo.full_name,
          repo_url: repo.html_url,
        }
      ])
      .select()
      .single();

    if (!error && data) {
      setActiveProject(data);
      setShowRepoBrowser(false);
    } else if (error && error.code === '23505') {
      // Already exists, just fetch it
      const { data: existing } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('repo_id', repo.id)
        .single();
      
      if (existing) {
        setActiveProject(existing);
        setShowRepoBrowser(false);
      }
    } else {
      console.error("Error saving project", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ margin: 0 }}>⚡ Mini Coding Agent</h2>
        <Auth />
      </header>

      {!session ? (
        <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #ccc', borderRadius: '8px' }}>
          <p>Please sign in with GitHub to start using the agent.</p>
        </div>
      ) : (
        <>
          {/* Project Context */}
          <ProjectContext 
            userId={session.user.id} 
            activeProject={activeProject} 
            setActiveProject={setActiveProject} 
          />

          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => setShowRepoBrowser(!showRepoBrowser)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showRepoBrowser ? 'Hide Repository Browser' : 'Browse GitHub Repositories'}
            </button>
          </div>

          {showRepoBrowser && (
            <RepoBrowser 
              token={session.provider_token!} 
              onSelectRepo={handleSelectRepo} 
            />
          )}

          <div style={{ marginTop: '32px', borderTop: '1px solid #eee', paddingTop: '32px' }}>
            {activeProject && (
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #0070f3' }}>
                <strong>Active Project:</strong> {activeProject.repo_full_name}
              </div>
            )}

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
            <button style={styles.button} onClick={runAgent} disabled={loading || !activeProject}>
              {loading ? "Running..." : "Run Agent"}
            </button>

            {/* Output */}
            <pre style={styles.output}>{output}</pre>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    maxWidth: 800,
    margin: "auto",
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  textarea: {
    width: "100%",
    height: 120,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  row: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
  },
  select: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ddd',
    background: 'white',
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: '16px',
    fontWeight: 600,
  },
  output: {
    marginTop: 24,
    padding: 16,
    background: "#1e1e1e",
    color: "#d4d4d4",
    height: 400,
    overflow: "auto",
    whiteSpace: "pre-wrap",
    borderRadius: 8,
    fontSize: '13px',
    lineHeight: '1.5',
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace'
  },
};
