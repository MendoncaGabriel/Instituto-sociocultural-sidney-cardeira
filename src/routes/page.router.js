const express = require('express')
const router = express.Router()
const indexController = require('../controllers/page.controller')

//index
router.get('/', indexController.index)
router.get('/cadastrar-pessoa', indexController.registrationOfPeople)


module.exports = router