import { runAgent } from "@/lib/agent/runner";

export async function POST(req: Request) {
  const { repoUrl, prompt } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (msg: string) => {
        controller.enqueue(encoder.encode(msg + "\n"));
      };

      try {
        send("🚀 Starting agent...");

        // ✅ GET KEY FROM ENV (IMPORTANT FIX)
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
          send("❌ Missing GROQ_API_KEY in environment variables");
          controller.close();
          return;
        }

        send("📦 Running agent...");

        const result = await runAgent({
          repoUrl,
          prompt,
          apiKey,
          onProgress: send,
        });

        send("🎉 Done");
        send("RESULT:" + JSON.stringify(result));

        controller.close();
      } catch (err: any) {
        send("❌ Error: " + err.message);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
