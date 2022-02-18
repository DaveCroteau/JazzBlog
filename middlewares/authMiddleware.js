const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = (req, res, next) => {
	const token = req.cookies.token

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			if (err) {
				res.redirect('/users/login')
			} else {
				req.user = decodedToken.id
				next()
			}
		})
	} else {
		res.redirect('/users/login')
	}
}

const checkUser = (req, res, next) => {
	const token = req.cookies.token

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null
				next()
			} else {
				const user = await User.findById(decodedToken.id)
				req.user = decodedToken.id
				res.locals.user = user
				next()
			}
		})
	} else {
		res.locals.user = null
		next()
	}
}

module.exports = { protect, checkUser }
