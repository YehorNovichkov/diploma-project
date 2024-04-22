const Router = require('express')
const router = new Router()
const subjectController = require('../controllers/subjectController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    subjectController.createSubject
)
router.get('/', subjectController.getSubjects)
router.get('/:id', subjectController.getOneSubject)
router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    subjectController.updateSubject
)
router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    subjectController.deleteSubject
)

module.exports = router
