const router = require('express').Router()
const studentsTaskAnswerController = require('../controllers/studentsTaskAnswerController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['student']),
    studentsTaskAnswerController.create
)
router.get('/', studentsTaskAnswerController.getAll)
router.get('/:id', studentsTaskAnswerController.getOne)
router.put(
    '/:id',
    roleCheckMiddleware(['student', 'teacher']),
    studentsTaskAnswerController.update
)
router.delete(
    '/:id',
    roleCheckMiddleware(['student', 'teacher']),
    studentsTaskAnswerController.delete
)

module.exports = router
