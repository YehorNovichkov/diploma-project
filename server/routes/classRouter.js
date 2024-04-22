const Router = require('express')
const router = new Router()
const classController = require('../controllers/classController')
const checkRole = require('../middleware/roleCheckMiddleware')

router.post('/', checkRole(['admin']), classController.createClass)

router.get('/', classController.getClasses)

router.get('/:id', classController.getOneClass)

router.put('/:id', checkRole(['admin']), classController.updateClass)

router.delete('/:id', checkRole(['admin']), classController.deleteClass)

module.exports = router
