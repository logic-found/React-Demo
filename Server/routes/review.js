const express = require('express')
const router = express.Router()
const {  getReview,  getAllReviews, updateReviewStatus, deleteAllReviews, getAllPendingReviews} = require('../controllers/review')
const {auth, authorizeRole} = require('../middleware/auth')

router
.get('/all', auth,  getAllReviews)
.get('/pending',  auth, authorizeRole,  getAllPendingReviews)
.delete('/all', auth, authorizeRole, deleteAllReviews)
.get('/:id', auth, getReview)
.patch('/:id', auth, authorizeRole,  updateReviewStatus)


module.exports = router