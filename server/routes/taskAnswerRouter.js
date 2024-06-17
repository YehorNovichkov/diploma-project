const Router = require('express')
const router = new Router()
const taskAnswerController = require('../controllers/taskAnswerController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.createTaskAnswer)
router.get('/', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.getTaskAnswers)
router.get('/byTaskAndStudent', checkRole(['admin', 'teacher', 'student']), authMiddleware, taskAnswerController.getTaskAnswerByTaskAndStudent)
router.get('/byTask/:taskId', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.getTaskAnswersByTask)
router.get('/byStudent/:studentId', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.getTaskAnswersByStudent)
router.get('/avgMark/:studentId', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.getAvarageMarkByStudentId)
router.get('/:id', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.getOneTaskAnswer)
router.put('/:id', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.updateTaskAnswer)
router.patch('/:id', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.updateTaskAnswerFilesCount)
router.patch('/mark/:id', authMiddleware, checkRole(['admin', 'teacher']), taskAnswerController.updateTaskAnswerMark)
router.delete('/:id', authMiddleware, checkRole(['admin', 'teacher', 'student']), taskAnswerController.deleteTaskAnswer)

module.exports = router
