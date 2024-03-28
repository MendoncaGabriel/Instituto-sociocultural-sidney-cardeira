const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/', userController.create)
router.patch('/:id', userController.update)
router.delete('/:id', userController.delete)

module.exports = router