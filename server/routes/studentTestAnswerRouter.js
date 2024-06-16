const Router = require('express')
const router = new Router()
const studentTestAnswerController = require('../controllers/studentTestAnswerController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/resultIdQuestionId', authMiddleware, studentTestAnswerController.getStudentTestAnswersByResultIdQuestionId)
router.post('/', authMiddleware, checkRole(['student', 'admin']), studentTestAnswerController.createStudentTestAnswers)
router.get('/', authMiddleware, studentTestAnswerController.getStudentTestAnswers)
router.get('/:id', authMiddleware, studentTestAnswerController.getOneStudentTestAnswer)
router.put('/:id', authMiddleware, checkRole(['teacher', 'admin']), studentTestAnswerController.updateStudentTestAnswer)
router.delete('/:id', authMiddleware, checkRole(['teacher', 'admin']), studentTestAnswerController.deleteStudentTestAnswer)

module.exports = router
