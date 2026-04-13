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
const [showSidebar,setShowSidebar]=useState(false)

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

{/* MOBILE TOP BAR */}
<div style={styles.topBar}>
<button onClick={()=>setShowSidebar(!showSidebar)} style={styles.menuBtn}>
☰
</button>
<div style={styles.title}>AI Agent</div>
</div>

{/* SIDEBAR (drawer on mobile) */}
{showSidebar && (
<div style={styles.sidebarOverlay} onClick={()=>setShowSidebar(false)}>
<div style={styles.sidebar} onClick={e=>e.stopPropagation()}>

<input
style={styles.input}
placeholder="Repo (user/repo)"
value={repo}
onChange={e=>setRepo(e.target.value)}
/>

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
</div>
)}

{/* CHAT AREA */}
<div style={styles.chat}>

<div style={styles.messages} ref={chatRef}>

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

{/* INPUT */}
<div style={styles.inputBar}>
<input
style={styles.chatInput}
value={input}
onChange={e=>setInput(e.target.value)}
placeholder="Ask AI..."
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
flexDirection:"column",
height:"100vh",
background:"#0b0f17",
color:"white",
fontFamily:"system-ui"
},

/* TOP BAR (mobile only) */
topBar:{
display:"flex",
alignItems:"center",
padding:10,
background:"#0f172a",
borderBottom:"1px solid #1f2937"
},

menuBtn:{
fontSize:20,
background:"transparent",
border:"none",
color:"white",
marginRight:10
},

title:{
fontWeight:"bold"
},

/* SIDEBAR OVERLAY */
sidebarOverlay:{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.6)",
zIndex:10
},

sidebar:{
width:260,
height:"100%",
background:"#0f172a",
padding:16
},

/* CHAT */
chat:{
flex:1,
display:"flex",
flexDirection:"column"
},

messages:{
flex:1,
padding:12,
overflowY:"auto",
display:"flex",
flexDirection:"column",
gap:10
},

msg:{
maxWidth:"80%",
padding:10,
borderRadius:10,
fontSize:14,
whiteSpace:"pre-wrap"
},

inputBar:{
display:"flex",
padding:10,
borderTop:"1px solid #1f2937",
background:"#0b0f17"
},

chatInput:{
flex:1,
padding:10,
borderRadius:8,
border:"1px solid #334155",
background:"#111827",
color:"white"
},

button:{
marginLeft:8,
padding:"10px 14px",
borderRadius:8,
border:"none",
background:"#4f7cff",
color:"white",
fontWeight:"bold"
},

input:{
width:"100%",
padding:10,
marginBottom:10,
borderRadius:8,
border:"1px solid #334155",
background:"#111827",
color:"white"
}

}
