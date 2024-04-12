require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('express').Router()
const errorHandler = require('./middleware/errorHandlingMiddleware')

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use(errorHandler)

const port = process.env.PORT || 4000

try {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
} catch (error) {
    console.log(error)
}
