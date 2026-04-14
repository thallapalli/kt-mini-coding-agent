import { runAgent } from "@/lib/agent/runner";

export async function POST(req) {
  const { repoUrl, prompt, apiKey } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (msg) => {
        controller.enqueue(encoder.encode(msg + "\n"));
      };

      try {
        send("🚀 Starting agent...");

        send("📦 Cloning repo...");
        const result = await runAgent({
          repoUrl,
          prompt,
          apiKey,
          onProgress: send,
        });

        send("✅ Done!");
        send("RESULT:" + JSON.stringify(result));

        controller.close();
      } catch (err) {
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
