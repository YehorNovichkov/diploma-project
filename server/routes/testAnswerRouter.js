const router = require('express').Router()
const testAnswerController = require('../controllers/testAnswerController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post(
    '/',
    roleCheckMiddleware(['teacher', 'admin']),
    testAnswerController.create
)

router.get('/', testAnswerController.getAll)

router.get('/:id', testAnswerController.getOne)

router.put(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testAnswerController.update
)

router.delete(
    '/:id',
    roleCheckMiddleware(['teacher', 'admin']),
    testAnswerController.delete
)

module.exports = router
