const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.createTask
)
router.get('/', taskController.getTasks)
router.get('/:id', taskController.getOneTask)
router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.updateTask
)
router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.deleteTask
)

module.exports = router
