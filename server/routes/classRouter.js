const Router = require('express')
const router = new Router()
const classController = require('../controllers/classController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, checkRole(['admin']), classController.createClass)
router.get('/', authMiddleware, classController.getClasses)
router.post('/search', authMiddleware, classController.getClassesByName)
router.get('/:id', authMiddleware, classController.getOneClass)
router.put('/:id', authMiddleware, checkRole(['admin']), classController.updateClass)
router.delete('/:id', authMiddleware, checkRole(['admin']), classController.deleteClass)

module.exports = router
