export async function callLLM({ message, model }) {

try {

// ---------------- GROQ ----------------
if (model === "groq") {

const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.GROQ_API_KEY}`
},
body: JSON.stringify({
model: "llama3-8b-8192",
messages: [
{ role: "user", content: message }
]
})
})

// return raw response for debugging
const text = await res.text()
return text
}


// ---------------- OPENAI (optional backup) ----------------
if (model === "openai") {

const res = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{ role: "user", content: message }
]
})
})

const text = await res.text()
return text
}


// ---------------- DEFAULT ----------------
return "Model not configured"

} catch (e) {

return "LLM ERROR: " + e.message

}

}
