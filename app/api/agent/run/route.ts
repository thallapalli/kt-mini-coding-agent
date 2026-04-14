import { runAgent } from "@/lib/agent/runner";

export async function POST(req: Request) {
  const { repoUrl, prompt, provider, model } = await req.json();

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        const send = (msg: string) => {
          controller.enqueue(encoder.encode(msg + "\n"));
        };

        const safeClose = () => {
          try {
            controller.close();
          } catch {}
        };

        try {
          send("🚀 Starting agent...");

          // pick correct API key based on provider
          let apiKey = "";
          if (provider === "openai") apiKey = process.env.OPENAI_API_KEY || "";
          else if (provider === "gemini") apiKey = process.env.GEMINI_API_KEY || "";
          else if (provider === "claude") apiKey = process.env.CLAUDE_API_KEY || "";
          else apiKey = process.env.GROQ_API_KEY || "";

          if (!apiKey) {
            send("❌ Missing API key");
            safeClose();
            return;
          }

          // ⏱ timeout protection
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Agent timeout (60s)")), 60000)
          );

          const task = runAgent({
            repoUrl,
            prompt,
            llmConfig: {
              provider: provider || "groq",
              model: model || "llama-3.1-8b-instant",
              apiKey,
            },
            onProgress: send,
          });

          const result = await Promise.race([task, timeout]);

          send("🎉 Done");
          send("RESULT:" + JSON.stringify(result));
        } catch (err: any) {
          send("❌ Error: " + err.message);
        } finally {
          safeClose();
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
