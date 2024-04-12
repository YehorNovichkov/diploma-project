const router = require('express').Router()
const taskController = require('../controllers/taskController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.create
)
router.get('/', taskController.getAll)
router.get('/:id', taskController.getOne)
router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.update
)
router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.delete
)
