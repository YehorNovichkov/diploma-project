const Router = require('express')
const router = new Router()
const ImageKit = require('imagekit')

const userRouter = require('./userRouter')
const classRouter = require('./classRouter')
const subjectRouter = require('./subjectRouter')
const taskRouter = require('./taskRouter')
const taskAnswerRouter = require('./taskAnswerRouter')
const taskAnswerCommentsRouter = require('./taskAnswerCommentsRouter')
const testRouter = require('./testRouter')
const testQuestionRouter = require('./testQuestionRouter')
const testAnswerRouter = require('./testAnswerRouter')
const testResultRouter = require('./testResultRouter')
const studentTestAnswerRouter = require('./studentTestAnswerRouter')

router.use('/user', userRouter)
router.use('/class', classRouter)
router.use('/subject', subjectRouter)
router.use('/task', taskRouter)
router.use('/taskAnswer', taskAnswerRouter)
router.use('/taskAnswerComment', taskAnswerCommentsRouter)
router.use('/test', testRouter)
router.use('/testQuestion', testQuestionRouter)
router.use('/testAnswer', testAnswerRouter)
router.use('/testResult', testResultRouter)
router.use('/studentTestAnswer', studentTestAnswerRouter)

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

router.get('/imagekit-auth', (req, res) => {
    var result = imagekit.getAuthenticationParameters()
    res.send(result)
})

module.exports = router
