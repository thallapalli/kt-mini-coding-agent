export async function askLLM(prompt: string, apiKey: string) {
  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const data = await res.json();

    console.log("🧠 Groq raw response:", JSON.stringify(data, null, 2));

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "Empty LLM response. Check API key or Groq quota."
      );
    }

    return content;
  } catch (err: any) {
    console.error("LLM ERROR:", err.message);
    throw new Error("LLM failed: " + err.message);
  }
}
