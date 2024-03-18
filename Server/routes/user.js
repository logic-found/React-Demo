const express = require('express')
const router = express.Router()
const { register, login, getUserDetails, deleteAllUsers} = require('../controllers/user')
const {auth, authorizeRole} = require('../middleware/auth')

router
.post('/new', register)
.post('/login', login)
.get('/me',auth, getUserDetails)
.delete('/all',auth, authorizeRole, deleteAllUsers)


module.exports = router