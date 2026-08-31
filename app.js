const express = require('express')
const app = express()
const connectDB = require('./config/db')
const userRouter = require('./routes/user.route')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middlewares/errorHandler.middleware')
const projectRouter = require('./routes/project.route')
const commentRouter = require('./routes/comment.route')
const cors = require('cors')
const taskRouter = require('./routes/tasks.route')
require('dotenv').config()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use('/api/auth', userRouter)
app.use('/api/project', projectRouter)
app.use('/api/project', taskRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/comments', commentRouter)
app.use(errorHandler)

connectDB()

app.listen(process.env.PORT, () => {
    console.log(` serveur ouvert au port ${process.env.PORT}`)
})

