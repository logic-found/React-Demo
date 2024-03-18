const express = require('express')
const router = express.Router()
const { register, login, getUserDetails, deleteAllUsers} = require('../controllers/user')
const {auth} = require('../middleware/auth')

router
.post('/new', register)
.post('/login', login)
.get('/me',auth, getUserDetails)
.delete('/all', deleteAllUsers)


module.exports = router