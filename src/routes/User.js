const userController = require('../controllers/UserController');
const express = require('express');
const upload = require("../../multer");
const router = express.Router();


router.post('/signup', upload.array('image'), userController.signup)
router.post('/signin', userController.signin)
router.post('/logout', userController.logout)
router.post('/refreshtoken', userController.refreshToken)

module.exports = router;