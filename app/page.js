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
body:JSON.stringify({ message:input, repo, model, mode })
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

<div style={styles.app}>

{/* Sidebar */}
<div style={styles.sidebar}>

<div style={styles.logo}>⚡ AI Agent</div>

<div style={styles.section}>
<div style={styles.label}>Repo</div>
<input style={styles.input} value={repo} onChange={e=>setRepo(e.target.value)} placeholder="user/repo"/>
</div>

<div style={styles.section}>
<div style={styles.label}>Model</div>
<select style={styles.input} value={model} onChange={e=>setModel(e.target.value)}>
<option value="groq">Groq (Fast)</option>
<option value="openai">OpenAI (Smart)</option>
<option value="anthropic">Claude</option>
<option value="gemini">Gemini</option>
</select>
</div>

<div style={styles.section}>
<div style={styles.label}>Mode</div>
<select style={styles.input} value={mode} onChange={e=>setMode(e.target.value)}>
<option value="plan">Plan</option>
<option value="agent">Agent</option>
</select>
</div>

<div style={styles.hint}>
Tip: Use Plan mode first
</div>

</div>

{/* Chat */}
<div style={styles.chat}>

{/* messages */}
<div style={styles.messages}>
{messages.map((m,i)=>(
<div key={i} style={{
...styles.msg,
alignSelf: m.role==="user" ? "flex-end" : "flex-start",
background: m.role==="user" ? "#4f7cff" : "#1f2937"
}}>
{m.content}
</div>
))}
</div>

{/* input bar */}
<div style={styles.inputBar}>
<input
style={styles.chatInput}
value={input}
onChange={e=>setInput(e.target.value)}
placeholder="Ask your AI agent..."
/>

<button style={styles.button} onClick={sendMessage}>
Send
</button>
</div>

</div>

</div>
)
}

const styles = {

app:{
display:"flex",
height:"100vh",
background:"#0b0f17",
color:"white",
fontFamily:"system-ui"
},

sidebar:{
width:260,
background:"#0f172a",
borderRight:"1px solid #1f2937",
padding:16
},

logo:{
fontSize:18,
fontWeight:"bold",
marginBottom:20
},

section:{
marginBottom:16
},

label:{
fontSize:12,
opacity:0.7,
marginBottom:6
},

input:{
width:"100%",
padding:10,
borderRadius:8,
border:"1px solid #334155",
background:"#111827",
color:"white",
outline:"none"
},

hint:{
fontSize:12,
opacity:0.5,
marginTop:20
},

chat:{
flex:1,
display:"flex",
flexDirection:"column"
},

messages:{
flex:1,
padding:20,
display:"flex",
flexDirection:"column",
gap:10,
overflowY:"auto"
},

msg:{
maxWidth:"70%",
padding:12,
borderRadius:12,
fontSize:14,
whiteSpace:"pre-wrap"
},

inputBar:{
display:"flex",
padding:12,
borderTop:"1px solid #1f2937",
background:"#0f0f10"
},

chatInput:{
flex:1,
padding:12,
borderRadius:10,
border:"1px solid #334155",
background:"#111827",
color:"white",
outline:"none"
},

button:{
marginLeft:10,
padding:"10px 16px",
borderRadius:10,
border:"none",
background:"#4f7cff",
color:"white",
fontWeight:"bold",
cursor:"pointer"
}

}
