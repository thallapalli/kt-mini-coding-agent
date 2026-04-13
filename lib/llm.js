export async function callLLM({ message, model }) {

if (model === "groq") {

const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.GROQ_API_KEY}`
},
body: JSON.stringify({
model: "llama3-70b-8192",
messages: [
{ role: "system", content: "You are a helpful coding assistant." },
{ role: "user", content: message }
]
})
})

const data = await res.json()

return data.choices?.[0]?.message?.content || "No response"

}

return "Model not configured yet"
}
