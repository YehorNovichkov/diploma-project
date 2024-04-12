const router = require('express').Router()
const classController = require('../controllers/classController')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

router.post('/', roleCheckMiddleware(['admin']), classController.create)

router.get('/', classController.getAll)

router.get('/:id', classController.getOne)

router.put('/:id', roleCheckMiddleware(['admin']), classController.update)

router.delete('/:id', roleCheckMiddleware(['admin']), classController.delete)

module.exports = router
