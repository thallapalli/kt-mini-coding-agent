import { callLLM } from "../../../lib/llm"

export async function POST(req) {

const body = await req.json()

const { message, model, mode, repo } = body

let prompt = message

if (mode === "plan") {
prompt = `
You are an expert coding agent.

Analyze the repository: ${repo}

User request: ${message}

Create a step-by-step plan.
DO NOT write code.
`
}

const reply = await callLLM({ message: prompt, model })

return Response.json({ reply })

}
