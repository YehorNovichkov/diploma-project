const router = require('express').Router()
const testQuestionController = require('../controllers/testQuestionController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    testQuestionController.create
)

router.get('/', testQuestionController.getAll)

router.get('/:id', testQuestionController.getOne)

router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testQuestionController.update
)

router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testQuestionController.delete
)

module.exports = router
