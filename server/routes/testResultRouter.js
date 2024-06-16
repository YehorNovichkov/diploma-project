const Router = require('express')
const router = new Router()
const testResultController = require('../controllers/testResultController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/studentIdTestId', authMiddleware, testResultController.getTestResultByStudentIdTestId)
router.post('/', authMiddleware, checkRole(['admin', 'student']), testResultController.createTestResult)
router.get('/', authMiddleware, testResultController.getTestResults)
router.get('/:id', authMiddleware, testResultController.getOneTestResult)
router.put('/:id', authMiddleware, checkRole(['teacher', 'admin']), testResultController.updateTestResult)
router.delete('/:id', authMiddleware, checkRole(['teacher', 'admin']), testResultController.deleteTestResult)
router.patch('/:id', authMiddleware, checkRole(['teacher', 'admin', 'student']), testResultController.completeTestResult)

module.exports = router
