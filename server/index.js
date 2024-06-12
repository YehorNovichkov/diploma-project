require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/_index')
const errorHandler = require('./middleware/errorHandlingMiddleware')
const http = require('http')
const { Server } = require('socket.io')
const { createTaskAnswerComment } = require('./controllers/taskAnswerCommentsController')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use(errorHandler)
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

io.on('connection', (socket) => {
    socket.on('joinRoom', (taskAnswerId) => {
        socket.join(taskAnswerId)
        console.log(`Socket ${socket.id} joined room ${taskAnswerId}`)
    })

    socket.on('newComment', async (comment) => {
        const { taskAnswerId, text, author } = comment

        try {
            const createdComment = await createTaskAnswerComment({
                text,
                taskAnswerId,
                authorId: author.id,
            })

            console.log(`Broadcasting new comment to room ${taskAnswerId}:`, createdComment)
            io.to(taskAnswerId).emit('comment', createdComment)
        } catch (error) {
            socket.emit('error', 'Error saving comment')
        }
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
    })
})

const port = process.env.PORT || 4000

try {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
} catch (error) {
    console.log(error)
}
