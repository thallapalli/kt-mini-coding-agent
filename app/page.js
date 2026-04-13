"use client"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

export default function Home() {

const [messages,setMessages]=useState([])
const [input,setInput]=useState("")
const [repo,setRepo]=useState("")
const [model,setModel]=useState("groq")
const [mode,setMode]=useState("plan")
const [showSettings,setShowSettings]=useState(false)
const [loading,setLoading]=useState(false)

const chatRef = useRef(null)

useEffect(()=>{
chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
},[messages,loading])

async function sendMessage(){

if(!input) return

const userMsg = input
setInput("")
setLoading(true)

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

{/* TOP BAR (simple like mobile app) */}
<div style={styles.topBar}>

<div style={styles.title}>AI Agent</div>

<button
style={styles.settingsBtn}
onClick={()=>setShowSettings(!showSettings)}
>
⚙️
</button>

</div>

{/* SETTINGS MODAL */}
{showSettings && (
<div style={styles.modal} onClick={()=>setShowSettings(false)}>
<div style={styles.modalBox} onClick={e=>e.stopPropagation()}>

<input
style={styles.input}
placeholder="Repo (user/repo)"
value={repo}
onChange={e=>setRepo(e.target.value)}
/>

<select style={styles.input} value={model} onChange={e=>setModel(e.target.value)}>
<option value="groq">Groq</option>
<option value="openai">OpenAI</option>
<option value="anthropic">Claude</option>
<option value="gemini">Gemini</option>
</select>

<select style={styles.input} value={mode} onChange={e=>setMode(e.target.value)}>
<option value="plan">Plan</option>
<option value="agent">Agent</option>
</select>

</div>
</div>
)}

{/* CHAT AREA */}
<div style={styles.chat} ref={chatRef}>

{messages.map((m,i)=>(
<div key={i} style={{
...styles.msg,
alignSelf: m.role==="user" ? "flex-end" : "flex-start",
background: m.role==="user" ? "#4f7cff" : "#1f2937"
}}>

<ReactMarkdown>{m.content}</ReactMarkdown>

</div>
))}

{loading && (
<div style={{...styles.msg,background:"#1f2937"}}>
Typing...
</div>
)}

</div>

{/* INPUT BAR (WhatsApp style) */}
<div style={styles.inputBar}>

<input
style={styles.chatInput}
value={input}
onChange={e=>setInput(e.target.value)}
placeholder="Message AI agent..."
/>

<button style={styles.sendBtn} onClick={sendMessage}>
Send
</button>

</div>

</div>
)
}

const styles = {

app:{
display:"flex",
flexDirection:"column",
height:"100vh",
background:"#0b0f17",
color:"white",
fontFamily:"system-ui"
},

topBar:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"12px 16px",
background:"#0f172a",
borderBottom:"1px solid #1f2937",
position:"sticky",
top:0
},

title:{
fontWeight:"bold",
fontSize:16
},

settingsBtn:{
background:"transparent",
border:"none",
color:"white",
fontSize:18
},

chat:{
flex:1,
overflowY:"auto",
padding:12,
display:"flex",
flexDirection:"column",
gap:10
},

msg:{
maxWidth:"80%",
padding:10,
borderRadius:12,
fontSize:14,
whiteSpace:"pre-wrap",
wordBreak:"break-word"
},

inputBar:{
display:"flex",
padding:10,
borderTop:"1px solid #1f2937",
background:"#0b0f17",
paddingBottom:"calc(10px + env(safe-area-inset-bottom))"
},

chatInput:{
flex:1,
padding:12,
borderRadius:20,
border:"1px solid #334155",
background:"#111827",
color:"white",
outline:"none"
},

sendBtn:{
marginLeft:8,
padding:"10px 14px",
borderRadius:20,
border:"none",
background:"#4f7cff",
color:"white",
fontWeight:"bold"
},

modal:{
position:"fixed",
inset:0,
background:"rgba(0,0,0,0.6)",
display:"flex",
justifyContent:"center",
alignItems:"center"
},

modalBox:{
width:"85%",
background:"#0f172a",
padding:16,
borderRadius:12
},

input:{
width:"100%",
padding:10,
marginBottom:10,
borderRadius:10,
border:"1px solid #334155",
background:"#111827",
color:"white"
}

}
