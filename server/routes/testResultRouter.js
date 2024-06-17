const Router = require('express')
const router = new Router()
const testResultController = require('../controllers/testResultController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/studentIdTestId', authMiddleware, testResultController.getTestResultByStudentIdTestId)
router.post('/', authMiddleware, checkRole(['admin', 'student']), testResultController.createTestResult)
router.get('/testId/:testId', authMiddleware, checkRole(['admin', 'teacher', 'parent']), testResultController.getTestResultsByTestId)
router.get('/studentId/:studentId', authMiddleware, checkRole(['admin', 'teacher', 'parent']), testResultController.getTestResultsByStudentId)
router.get('/avgMark/:studentId', authMiddleware, checkRole(['admin', 'teacher', 'parent']), testResultController.getAvarageMarkByStudentId)
router.get('/:id', authMiddleware, testResultController.getOneTestResult)
router.put('/:id', authMiddleware, checkRole(['teacher', 'admin']), testResultController.updateTestResult)
router.delete('/:id', authMiddleware, checkRole(['teacher', 'admin']), testResultController.deleteTestResult)
router.patch('/:id', authMiddleware, checkRole(['teacher', 'admin', 'student']), testResultController.completeTestResult)

module.exports = router
