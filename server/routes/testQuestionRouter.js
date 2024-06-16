const Router = require('express')
const router = new Router()
const testQuestionController = require('../controllers/testQuestionController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, roleCheckMiddleware(['teacher', 'admin']), testQuestionController.createTestQuestion)
router.get('/', authMiddleware, testQuestionController.getTestQuestions)
router.get('/test/:testId', authMiddleware, testQuestionController.getTestQuestionsByTestId)
router.get('/ids/:testId', authMiddleware, testQuestionController.getTestQuestionIdsByTestId)
router.get('/:id', authMiddleware, testQuestionController.getOneTestQuestion)
router.put('/:id', authMiddleware, roleCheckMiddleware(['teacher', 'admin']), testQuestionController.updateTestQuestion)
router.patch('/:id', authMiddleware, roleCheckMiddleware(['teacher', 'admin']), testQuestionController.updateTestQuestionFilesCount)
router.delete('/:id', authMiddleware, roleCheckMiddleware(['teacher', 'admin']), testQuestionController.deleteTestQuestion)

module.exports = router
