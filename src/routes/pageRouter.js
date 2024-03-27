const express = require('express')
const router = express.Router()
const indexController = require('../controllers/pageController')

//index
router.get('/', indexController.index)
router.get('/cadastrar-pessoa', indexController.registrationOfPeople)
router.get('/lista-de-pessoas', indexController.listOfPeoples)
router.get('/perfil', indexController.personProfile)
router.get('/editar-cadastro', indexController.editRegistration)
router.get('/editar-dependente', indexController.editDependent)
router.get('/servicos', indexController.services)


module.exports = router

