import { runAgent } from "@/lib/agent/runner";

export async function POST(req) {
  try {
    const { repoUrl, prompt, apiKey } = await req.json();

    if (!repoUrl || !prompt || !apiKey) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await runAgent({
      repoUrl,
      prompt,
      apiKey,
    });

    return Response.json({ success: true, result });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
