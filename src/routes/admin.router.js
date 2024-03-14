const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')


//admin
router.get('/login', adminController.loginPage)
router.post('/login', adminController.login)

module.exports = router