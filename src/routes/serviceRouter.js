const express = require('express')
const router = express.Router()

const servicesController = require('../controllers/service.controller')

router.post('/', servicesController.create)
router.delete('/:id', servicesController.delete)
router.patch('/:id', servicesController.update)


module.exports = router