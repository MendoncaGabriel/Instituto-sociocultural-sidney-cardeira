const express = require('express')
const router = express.Router()
const indexController = require('../controllers/page.controller')

//index
router.get('/', indexController.index)
router.get('/cadastrar-pessoa', indexController.registrationOfPeople)
router.get('/lista-de-pessoas', indexController.listOfPeoples)
router.get('/perfil', indexController.personProfile)


module.exports = router