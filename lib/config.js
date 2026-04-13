export const config = {

defaultModel: "groq",

models: {
groq: {
provider: "groq",
model: "llama-3.1-8b-instant",
apiKey: process.env.GROQ_API_KEY,
baseUrl: "https://api.groq.com/openai/v1/chat/completions"
},

openai: {
provider: "openai",
model: "gpt-4o-mini",
apiKey: process.env.OPENAI_API_KEY,
baseUrl: "https://api.openai.com/v1/chat/completions"
},

anthropic: {
provider: "anthropic",
model: "claude-3-5-sonnet-20241022",
apiKey: process.env.ANTHROPIC_API_KEY
},

gemini: {
provider: "gemini",
model: "gemini-1.5-pro",
apiKey: process.env.GEMINI_API_KEY
}

}

}
