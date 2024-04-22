const Router = require('express')
const router = new Router()
const taskController = require('../controllers/testController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.createTest
)

router.get('/', taskController.getTests)

router.get('/:id', taskController.getOneTest)

router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.updateTest
)

router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    taskController.deleteTest
)

module.exports = router
