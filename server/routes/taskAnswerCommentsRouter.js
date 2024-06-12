const Router = require('express')
const router = new Router()
const taskAnswerCommentsController = require('../controllers/taskAnswerCommentsController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerCommentsController.createTaskAnswerComment)
router.get(
    '/byTaskAnswer/:taskAnswerId',
    authMiddleware,
    checkRole(['admin', 'teacher', 'student']),
    taskAnswerCommentsController.getTaskAnswerCommentsByTaskAnswer
)

module.exports = router
