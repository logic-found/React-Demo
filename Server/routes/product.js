const express = require('express')
const router = express.Router()
const {  getAllProducts, getProductDetails, deleteAllProducts, updateProductDetails } = require('../controllers/product')
const {auth, authorizeRole} = require('../middleware/auth')

router
.get('/all', auth, getAllProducts)
.delete('/all', auth, authorizeRole,  deleteAllProducts)
.get('/:id', auth, getProductDetails)
.patch('/:id', auth, updateProductDetails)


module.exports = router