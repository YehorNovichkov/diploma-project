const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 4000

try {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
} catch (error) {
    console.log(error)
}
