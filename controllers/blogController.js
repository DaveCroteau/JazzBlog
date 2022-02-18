const Post = require('../models/postModel')

// Handle error
const errHandler = err => {
	if (err.message === 'Not authorized') return { error: { messgae: 'Not autorized' } }
	if (err.message === 'No post was found') return { error: { message: 'No post was found' } }

	const keys = Object.keys(err.errors)
	const error = keys.reduce((acc, cur) => {
		acc[cur] = err.errors[cur].message
		return acc
	}, {})

	return { error }
}

// @desc	Get the blog page & fetch all blogs
// @route	Get => /blog
// @access	Public
const get_blog_index = async (req, res) => {
	try {
		const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 })
		res.status(200).render('blog/blog', { title: 'Blog', posts })
	} catch (err) {
		res.status(404).render('404', { title: '404' })
	}
}

// @desc	Get specific user blog page & fetch is blog posts
// @route	GET => /blog/myposts
// @access	Private
const get_blog_my_index = async (req, res) => {
	const user = req.user

	try {
		const posts = await Post.find({ author: user }).populate('author', 'username').sort({ updatedAt: -1 })
		res.status(200).render('blog/myPosts', { title: 'My Posts', posts })
	} catch (err) {
		res.status(404).render('404', { title: '404' })
	}
}

// @desc	Get all the details for a single blog post
// @route	GET => /blog/post/:id
// @access	Public
const get_blog_details = async (req, res) => {
	try {
		const id = req.params.id
		const post = await Post.findById(id).populate('author', 'username')
		res.status(200).render('blog/details', { title: 'Details', post })
	} catch (err) {
		res.status(404).render('404', { title: '404' })
	}
}

// @desc Get the create page
// @route	GET => /blog/create
// @access	Private
const get_blog_create = (req, res) => {
	try {
		res.render('blog/create', { title: 'Create' })
	} catch (err) {
		res.status(404).render('404', { title: '404' })
	}
}

// @desc	Create a blog post
// @route	POST => /blog/create
// @access	Private
const post_blog_create = async (req, res) => {
	const author = req.user
	const { title, post } = req.body

	try {
		const newPost = await Post.create({ author, title, post })
		res.json({ id: newPost._id })
	} catch (err) {
		res.status(400).json(errHandler(err))
	}
}

// @desc	Get the update page and fill the fields
// @route	GET => /blog/update/:id
// @access	Private
const get_blog_update = async (req, res) => {
	const id = req.params.id

	try {
		const post = await Post.findById(id)
		res.status(200).render('blog/update', { title: 'Update', post })
	} catch (err) {
		res.status(404).render('404', { title: '404' })
	}
}

// @desc	Update blog post data
// @route	PUT => /blog/post/:id
// @access	Private
const put_blog_update = async (req, res) => {
	const id = req.params.id
	const author = req.user
	const { title, post } = req.body

	try {
		const original = await Post.findById(req.params.id)

		if (!original) {
			res.status(400)
			throw new Error('No post was found')
		}

		if (original.author.toString() !== req.user) {
			res.status(401)
			throw new Error('Not authorized')
		}

		const updated = await Post.findOneAndUpdate({ _id: id }, { author, title, post })
		res.json({ id: updated._id })
	} catch (err) {
		res.status(400).json(errHandler(err))
	}
}

// @desc	Delete a blog post
// @route	DELETE => /blog/post/:id
// @access	Private
const delete_blog = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post) {
			res.status(400)
			throw new Error('No post was found')
		}

		if (post.author.toString() !== req.user) {
			res.status(401)
			throw new Error('Not authorized')
		}

		await post.remove()

		res.status(200).json({ id: req.params.id })
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
}

module.exports = {
	get_blog_index,
	get_blog_my_index,
	get_blog_details,
	get_blog_create,
	post_blog_create,
	get_blog_update,
	put_blog_update,
	delete_blog,
}
