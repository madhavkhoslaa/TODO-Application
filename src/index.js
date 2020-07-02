const express = require('express')

const UserRouter = require('./routes/user')
const TaskRouter = require('./routes/task')
const auth = require('./middleware/auth')
require('./db/mongoose')


const port = process.env.port || 7001

const app = express()
app.use(auth)
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => console.log(`Server Running on ${port}`))