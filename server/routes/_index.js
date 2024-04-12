const Router = require('express').Router
const router = new Router()

const userRouter = require('./userRouter')
const classRouter = require('./classRouter')
const subjectRouter = require('./subjectRouter')
const taskRouter = require('./taskRouter')
const taskAnswerRouter = require('./taskAnswerRouter')
const testRouter = require('./testRouter')
const testQuestionRouter = require('./testQuestionRouter')
const testAnswerRouter = require('./testAnswerRouter')

router.use('/user', userRouter)
router.use('/class', classRouter)
router.use('/subject', subjectRouter)
router.use('/task', taskRouter)
router.use('/taskAnswer', taskAnswerRouter)
router.use('/test', testRouter)
router.use('/testQuestion', testQuestionRouter)
router.use('/testAnswer', testAnswerRouter)

module.exports = router
