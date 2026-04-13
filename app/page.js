"use client"
import { useState } from "react"

export default function Home() {

const [messages,setMessages]=useState([])
const [input,setInput]=useState("")
const [repo,setRepo]=useState("")
const [model,setModel]=useState("groq")
const [mode,setMode]=useState("plan")

async function sendMessage(){

const res = await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
message:input,
repo,
model,
mode
})
})

const data = await res.json()

setMessages([...messages,
{role:"user",content:input},
{role:"assistant",content:data.reply}
])

setInput("")
}

return(

<div style={{padding:20,fontFamily:"Arial"}}>

<h2>AI Coding Agent</h2>

<div>
Repo:
<input value={repo} onChange={e=>setRepo(e.target.value)} />
</div>

<div>
Model:
<select value={model} onChange={e=>setModel(e.target.value)}>
<option>groq</option>
<option>openai</option>
<option>gemini</option>
</select>
</div>

<div>
Mode:
<select value={mode} onChange={e=>setMode(e.target.value)}>
<option>plan</option>
<option>agent</option>
</select>
</div>

<hr/>

<div style={{height:300,overflow:"auto",border:"1px solid gray",padding:10}}>
{messages.map((m,i)=>(
<div key={i}>
<b>{m.role}</b>: {m.content}
</div>
))}
</div>

<input
value={input}
onChange={e=>setInput(e.target.value)}
placeholder="Ask something"
/>

<button onClick={sendMessage}>
Send
</button>

</div>
)
}
