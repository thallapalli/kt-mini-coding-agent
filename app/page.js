"use client"
import { useState } from "react"

export default function Home() {

const [messages,setMessages]=useState([])
const [input,setInput]=useState("")
const [repo,setRepo]=useState("")
const [model,setModel]=useState("groq")
const [mode,setMode]=useState("plan")

async function sendMessage(){

if(!input) return

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

setMessages(prev=>[
...prev,
{role:"user",content:input},
{role:"assistant",content:data.reply}
])

setInput("")
}

return(

<div style={{display:"flex",height:"100vh",fontFamily:"Arial"}}>

{/* Sidebar */}
<div style={{
width:250,
borderRight:"1px solid #ddd",
padding:15,
background:"#f7f7f7"
}}>

<h3>⚙️ Settings</h3>

<div>
<label>Repo</label>
<input
style={{width:"100%",marginBottom:10}}
value={repo}
onChange={e=>setRepo(e.target.value)}
placeholder="username/repo"
/>
</div>

<div>
<label>Model</label>
<select
style={{width:"100%",marginBottom:10}}
value={model}
onChange={e=>setModel(e.target.value)}
>
<option value="groq">Groq</option>
<option value="openai">OpenAI</option>
<option value="gemini">Gemini</option>
</select>
</div>

<div>
<label>Mode</label>
<select
style={{width:"100%"}}
value={mode}
onChange={e=>setMode(e.target.value)}
>
<option value="plan">Plan</option>
<option value="agent">Agent</option>
</select>
</div>

</div>

{/* Chat Area */}
<div style={{flex:1,display:"flex",flexDirection:"column"}}>

{/* Messages */}
<div style={{
flex:1,
overflowY:"auto",
padding:20,
background:"#fafafa"
}}>
{messages.map((m,i)=>(
<div key={i} style={{
marginBottom:15,
display:"flex",
justifyContent: m.role==="user" ? "flex-end" : "flex-start"
}}>
<div style={{
maxWidth:"70%",
padding:10,
borderRadius:10,
background: m.role==="user" ? "#007bff" : "#e5e5ea",
color: m.role==="user" ? "white" : "black"
}}>
{m.content}
</div>
</div>
))}
</div>

{/* Input */}
<div style={{
padding:10,
borderTop:"1px solid #ddd",
display:"flex",
gap:10
}}>

<input
style={{
flex:1,
padding:10,
borderRadius:8,
border:"1px solid #ccc"
}}
value={input}
onChange={e=>setInput(e.target.value)}
placeholder="Ask your coding agent..."
/>

<button
onClick={sendMessage}
style={{
padding:"10px 15px",
background:"#007bff",
color:"white",
border:"none",
borderRadius:8
}}
>
Send
</button>

</div>

</div>

</div>
)
}
