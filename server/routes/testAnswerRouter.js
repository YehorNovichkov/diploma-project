const Router = require('express')
const router = new Router()
const testAnswerController = require('../controllers/testAnswerController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    testAnswerController.createTestAnswer
)

router.get('/', testAnswerController.getTestAnswers)

router.get('/:id', testAnswerController.getOneTestAnswer)

router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testAnswerController.updateTestAnswer
)

router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testAnswerController.deleteTestAnswer
)

module.exports = router
