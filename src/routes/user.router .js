const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const upload = require('../middlewares/upload.middleware')


router.post('/create',  upload, userController.create)


router.post('/updateUser/:id', upload, userController.updateUser)

router.get('/searchUserById/:id', userController.searchUserById)
router.get('/searchUserByName/:name', userController.searchUserByName)
router.get('/searchUserByTel/:tel', userController.searchUserByTel)
router.get('/searchUsersByDate/:date', userController.searchUsersByDate)
router.get('/searchUsersByActive/:active', userController.searchUsersByActive)
router.get('/disactivateUser/:id', userController.disactivateUser)
router.get('/activateUser/:id', userController.activateUser)
router.get('/getListOfUsers/:page/:limit', userController.getListOfUsers)
router.get('/getFilter/', userController.getFilter)

module.exports = router