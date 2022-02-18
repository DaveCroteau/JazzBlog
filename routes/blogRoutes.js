const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const {
	get_blog_index,
	get_blog_my_index,
	get_blog_details,
	get_blog_create,
	post_blog_create,
	get_blog_update,
	put_blog_update,
	delete_blog,
} = require('../controllers/blogController')

router.get('/', get_blog_index)

router.get('/myposts', protect, get_blog_my_index)

router.get('/post/:id', get_blog_details)

router.get('/create', protect, get_blog_create)

router.post('/create', protect, post_blog_create)

router.get('/update/:id', protect, get_blog_update)

router.put('/post/:id', protect, put_blog_update)

router.delete('/post/:id', protect, delete_blog)

module.exports = router
