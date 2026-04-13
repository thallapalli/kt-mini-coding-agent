import { config } from "./config"

export async function callLLM({ message, model }) {

try {

const selected = config.models[model || config.defaultModel]

if (!selected) return "Model not found"

// ---------------- GROQ / OPENAI (same format) ----------------
if (selected.provider === "groq" || selected.provider === "openai") {

const res = await fetch(selected.baseUrl, {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${selected.apiKey}`
},
body: JSON.stringify({
model: selected.model,
messages: [
{ role: "system", content: "You are a senior software engineer." },
{ role: "user", content: message }
]
})
})

const data = await res.json()

return data?.choices?.[0]?.message?.content || JSON.stringify(data)
}

// ---------------- ANTHROPIC (Claude) ----------------
if (selected.provider === "anthropic") {

const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: {
"Content-Type": "application/json",
"x-api-key": selected.apiKey,
"anthropic-version": "2023-06-01"
},
body: JSON.stringify({
model: selected.model,
max_tokens: 2000,
messages: [
{ role: "user", content: message }
]
})
})

const data = await res.json()

return data?.content?.[0]?.text || JSON.stringify(data)
}

// ---------------- GEMINI ----------------
if (selected.provider === "gemini") {

const res = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/${selected.model}:generateContent?key=${selected.apiKey}`,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
contents: [
{
parts: [{ text: message }]
}
]
})
}
)

const data = await res.json()

return data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data)
}

return "Unsupported provider"

} catch (e) {
return "LLM ERROR: " + e.message
}

}
