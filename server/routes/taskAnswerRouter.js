const Router = require('express')
const router = new Router()
const taskAnswerController = require('../controllers/taskAnswerController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    taskAnswerController.createTaskAnswer
)
router.get('/', taskAnswerController.getTaskAnswers)
router.get('/:id', taskAnswerController.getOneTaskAnswer)
router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskAnswerController.updateTaskAnswer
)
router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskAnswerController.deleteTaskAnswer
)

module.exports = router
