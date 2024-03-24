const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const upload = require('../middlewares/upload.middleware')

router.post('/create',  upload, userController.create)
router.post('/update', upload, userController.update)
router.get('/activate', userController.activate)
router.get('/disactivate', userController.disactivate)
router.get('/findById', userController.findById)
router.get('/findByFilter', userController.findByQuery)
router.get('/getList', userController.getList)
router.get('/findByDate', userController.findByDate)

module.exports = router