const Router = require('express')
const router = new Router()
const testQuestionController = require('../controllers/testQuestionController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    testQuestionController.createTestQuestion
)

router.get('/', testQuestionController.getTestQuestions)

router.get('/:id', testQuestionController.getOneTestQuestion)

router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testQuestionController.updateTestQuestion
)

router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testQuestionController.deleteTestQuestion
)

module.exports = router
