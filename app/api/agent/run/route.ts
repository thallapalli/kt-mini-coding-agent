import { runAgent } from "@/lib/agent/runner";

export async function POST(req: Request) {
  const body = await req.json();

  const repoUrl = body.repoUrl;
  const prompt = body.prompt;

  // NEW: full LLM config support (optional UI upgrade)
  const llmConfig = body.llmConfig;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (msg: string) => {
        controller.enqueue(encoder.encode(msg + "\n"));
      };

      try {
        send("🚀 Starting AI Coding Agent...");
        send(`📦 Repo: ${repoUrl}`);

        // -----------------------------
        // API KEY RESOLUTION LOGIC
        // -----------------------------

        const apiKey =
          llmConfig?.apiKey || process.env.GROQ_API_KEY;

        const provider = llmConfig?.provider || "groq";
        const model =
          llmConfig?.model || "llama-3.3-70b-versatile";

        if (!apiKey) {
          send("❌ ERROR: Missing API key");
          send("👉 Add GROQ_API_KEY in Vercel env or pass from UI");
          controller.close();
          return;
        }

        send(`🧠 Provider: ${provider}`);
        send(`🤖 Model: ${model}`);

        send("📚 Initializing repo analysis...");

        const result = await runAgent({
          repoUrl,
          prompt,
          llmConfig: {
            provider,
            model,
            apiKey,
          },
          onProgress: send,
        });

        send("🎉 Agent Execution Complete");

        send("📄 Final Result:");
        send(JSON.stringify(result, null, 2));

        controller.close();
      } catch (err: any) {
        send("❌ Agent Failed");
        send("Error: " + (err?.message || "Unknown error"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
