const router = require('express').Router()
const subjectController = require('../controllers/subjectController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    subjectController.create
)

router.get('/', subjectController.getAll)

router.get('/:id', subjectController.getOne)

router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    subjectController.update
)

router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    subjectController.delete
)

module.exports = router
