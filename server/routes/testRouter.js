const Router = require('express')
const router = new Router()
const taskController = require('../controllers/testController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/roleCheckMiddleware')

router.post('/', authMiddleware, checkRole(['teacher', 'admin']), taskController.createTest)
router.get('/', authMiddleware, taskController.getTests)
router.get('/:id', authMiddleware, taskController.getOneTest)
router.put('/:id', authMiddleware, checkRole(['teacher', 'admin']), taskController.updateTest)
router.patch('/:id', authMiddleware, checkRole(['teacher', 'admin']), taskController.updateHiddenTest)
router.delete('/:id', authMiddleware, checkRole(['teacher', 'admin']), taskController.deleteTest)

module.exports = router
