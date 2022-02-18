const express = require('express')
const router = express.Router()
const { get_signup, post_signup, get_login, post_login, get_logout } = require('../controllers/usersController')

router.get('/signup', get_signup)

router.post('/signup', post_signup)

router.get('/login', get_login)

router.post('/login', post_login)

router.get('/logout', get_logout)

module.exports = router
