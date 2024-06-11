const Router = require('express')
const router = new Router()
const subjectController = require('../controllers/subjectController')
const checkRole = require('../middleware/roleCheckMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, checkRole(['admin']), subjectController.createSubject)
router.post('/search', authMiddleware, subjectController.getSubjectsByName)
router.get('/', authMiddleware, subjectController.getSubjects)
router.get('/:id', authMiddleware, subjectController.getOneSubject)
router.put('/:id', authMiddleware, checkRole(['admin']), subjectController.updateSubject)
router.delete('/:id', authMiddleware, checkRole(['admin']), subjectController.deleteSubject)

module.exports = router
