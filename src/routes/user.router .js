const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const upload = require('../middlewares/upload.middleware')


router.post('/create',  upload.single('image'), userController.create)
router.get('/searchUserById/:id', userController.searchUserById)
router.get('/searchUserByName/:name', userController.searchUserByName)
router.get('/searchUserByTel/:tel', userController.searchUserByTel)
router.get('/searchUsersByDate/:date', userController.searchUsersByDate)
router.get('/searchUsersByActive/:active', userController.searchUsersByActive)
router.patch('/updateUser/:id', upload.single('image'), userController.updateUser)
router.get('/disactivateUser/:id', userController.disactivateUser)
router.get('/activateUser/:id', userController.activateUser)

module.exports = router