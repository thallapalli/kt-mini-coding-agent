import { runAgent } from "@/lib/agent/runner";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { repoUrl, prompt, apiKey } = body;

    if (!repoUrl || !prompt || !apiKey) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await runAgent({
      repoUrl,
      prompt,
      apiKey,
    });

    return Response.json({ success: true, result });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
