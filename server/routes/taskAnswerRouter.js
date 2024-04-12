const router = require('express').Router()
const taskAnswerController = require('../controllers/taskAnswerController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    taskAnswerController.create
)
router.get('/', taskAnswerController.getAll)
router.get('/:id', taskAnswerController.getOne)
router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskAnswerController.update
)
router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskAnswerController.delete
)

module.exports = router
