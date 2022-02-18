const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Create a jwt token
const createToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// handle errors
const errHandler = err => {
	if (err.code === 11000) {
		return { error: { email: 'That email is already registred' } }
	}

	if (err.message === 'Invalid email') return { error: { email: 'Invalid email' } }
	if (err.message === 'Incorrect password') return { error: { password: 'Invalid password' } }

	const keys = Object.keys(err.errors)
	const error = keys.reduce((acc, cur) => {
		acc[cur] = err.errors[cur].message
		return acc
	}, {})

	return { error }
}

// @desc	Get the signup page
// @route	GET => /users/signup
// @access	Public
const get_signup = (req, res) => {
	res.render('users/signup', { title: 'Sign up' })
}

// @desc	Signup a user
// @route	POST => /users/signup
// @access	Public
const post_signup = async (req, res) => {
	const { username, email, password } = req.body

	try {
		const user = await User.create({ username, email, password })
		const token = createToken(user._id)
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'Strict',
			maxAge: 1000 * 60 * 60 * 24 * 7,
		})
		res.status(201).json({ id: user._id, username: user.username, email: user.email })
	} catch (err) {
		res.status(400).json(errHandler(err))
	}
}

// @desc	Get the login page
// @route	GET => /users/login
// @access	Public
const get_login = (req, res) => {
	res.render('users/login', { title: 'Login' })
}

// @desc	Logs in a user
// @route	POST => /users/login
// @access	Public
const post_login = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.login(email, password)
		const token = createToken(user._id)
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'Strict',
			maxAge: 1000 * 60 * 60 * 24 * 7,
		})
		res.status(200).json({ id: user._id, username: user.username, email: user.email })
	} catch (err) {
		res.status(400).json(errHandler(err))
	}
}

// @desc	Logs out a user
// @route	GET => /users/logout
// @access	Public
const get_logout = (req, res) => {
	res.cookie('token', '', { maxAge: 1 })
	res.redirect('/')
}

module.exports = {
	get_signup,
	post_signup,
	get_login,
	post_login,
	get_logout,
}
