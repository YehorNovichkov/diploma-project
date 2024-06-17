const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, checkRole(['teacher', 'admin']), taskController.createTask)
router.get('/', authMiddleware, taskController.getTasks)
router.get('/:id', authMiddleware, taskController.getOneTask)
router.put('/:id', authMiddleware, checkRole(['teacher', 'admin']), taskController.updateTask)
router.patch('/hidden/:id', authMiddleware, checkRole(['teacher', 'admin']), taskController.updateHiddenTask)
router.patch('/:id', authMiddleware, checkRole(['teacher', 'admin']), taskController.updateTaskFilesCount)
router.delete('/:id', authMiddleware, checkRole(['teacher', 'admin']), taskController.deleteTask)

module.exports = router
