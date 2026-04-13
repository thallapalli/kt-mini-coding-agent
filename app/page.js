"use client"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

export default function Home() {

const [messages,setMessages]=useState([])
const [input,setInput]=useState("")
const [repo,setRepo]=useState("")
const [model,setModel]=useState("groq")
const [mode,setMode]=useState("plan")
const [loading,setLoading]=useState(false)

const chatRef = useRef(null)

useEffect(()=>{
if(chatRef.current){
chatRef.current.scrollTop = chatRef.current.scrollHeight
}
},[messages,loading])

async function sendMessage(){

if(!input) return

setLoading(true)

const userMsg = input
setInput("")

setMessages(prev=>[
...prev,
{role:"user",content:userMsg}
])

const res = await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
message:userMsg,
repo,
model,
mode
})
})

const data = await res.json()

setMessages(prev=>[
...prev,
{role:"assistant",content:data.reply}
])

setLoading(false)
}

return(
<div style={styles.app}>

{/* Sidebar */}
<div style={styles.sidebar}>

<div style={styles.logo}>⚡ AI Agent</div>

<input style={styles.input} placeholder="Repo (user/repo)" value={repo} onChange={e=>setRepo(e.target.value)} />

<select style={styles.input} value={model} onChange={e=>setModel(e.target.value)}>
<option>groq</option>
<option>openai</option>
<option>anthropic</option>
<option>gemini</option>
</select>

<select style={styles.input} value={mode} onChange={e=>setMode(e.target.value)}>
<option>plan</option>
<option>agent</option>
</select>

</div>

{/* Chat */}
<div style={styles.chat}>

<div style={styles.messages} ref={chatRef}>

{messages.map((m,i)=>(
<div key={i} style={{
...styles.msg,
alignSelf: m.role==="user" ? "flex-end" : "flex-start",
background: m.role==="user" ? "#4f7cff" : "#1f2937"
}}>

<ReactMarkdown
components={{
code({children}) {
return (
<pre style={styles.code}>
<code>{children}</code>
</pre>
)
}
}}
>
{m.content}
</ReactMarkdown>

</div>
))}

{loading && (
<div style={{...styles.msg,background:"#1f2937"}}>
Typing...
</div>
)}

</div>

{/* input */}
<div style={styles.inputBar}>
<input
style={styles.chatInput}
value={input}
onChange={e=>setInput(e.target.value)}
placeholder="Ask AI to code..."
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
padding:16,
background:"#0f172a",
borderRight:"1px solid #1f2937"
},

logo:{
fontSize:18,
fontWeight:"bold",
marginBottom:16
},

input:{
width:"100%",
padding:10,
marginBottom:10,
borderRadius:8,
border:"1px solid #334155",
background:"#111827",
color:"white"
},

chat:{
flex:1,
display:"flex",
flexDirection:"column"
},

messages:{
flex:1,
padding:20,
overflowY:"auto",
display:"flex",
flexDirection:"column",
gap:10
},

msg:{
maxWidth:"75%",
padding:12,
borderRadius:12,
fontSize:14,
whiteSpace:"pre-wrap"
},

code:{
background:"#0a0a0a",
padding:10,
borderRadius:8,
overflowX:"auto",
fontSize:13
},

inputBar:{
display:"flex",
padding:12,
borderTop:"1px solid #1f2937",
background:"#0b0f17"
},

chatInput:{
flex:1,
padding:12,
borderRadius:10,
border:"1px solid #334155",
background:"#111827",
color:"white"
},

button:{
marginLeft:10,
padding:"10px 16px",
borderRadius:10,
border:"none",
background:"#4f7cff",
color:"white",
fontWeight:"bold"
}

}
