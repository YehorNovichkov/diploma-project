const Router = require('express')
const router = new Router()
const testAnswerController = require('../controllers/testAnswerController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, roleCheckMiddleware(['teacher', 'admin']), testAnswerController.createTestAnswer)
router.get('/', authMiddleware, testAnswerController.getTestAnswers)
router.get('/testQuestion/:testQuestionId', authMiddleware, testAnswerController.getTestAnswersByQuestionId)
router.get('/:id', authMiddleware, testAnswerController.getOneTestAnswer)
router.put('/:id', authMiddleware, roleCheckMiddleware(['teacher', 'admin']), testAnswerController.updateTestAnswer)
router.delete('/:id', authMiddleware, roleCheckMiddleware(['teacher', 'admin']), testAnswerController.deleteTestAnswer)

module.exports = router
