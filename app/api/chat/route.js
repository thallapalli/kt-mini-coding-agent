export async function POST(req){

const body = await req.json()

const message = body.message
const repo = body.repo
const model = body.model
const mode = body.mode

return Response.json({
reply:`Mode:${mode}
Model:${model}
Repo:${repo}

You said: ${message}`
})

}
