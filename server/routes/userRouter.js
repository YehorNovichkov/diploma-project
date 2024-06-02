const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/search', authMiddleware, userController.getUsersByPartOfFullNameAndRole)
router.post('/', authMiddleware, roleCheckMiddleware(['admin']), userController.addUser)
router.get('/:id', userController.getUser)
router.get('/roles/:id', userController.getUserRoles)
router.get('/by-role/:role', authMiddleware, userController.getUsersByRole)
router.get('/by-class/:classId', authMiddleware, userController.getUsersByClass)
router.put('/:id', authMiddleware, roleCheckMiddleware(['admin']), userController.updateUser)

module.exports = router
