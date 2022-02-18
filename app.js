const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { checkUser } = require('./middlewares/authMiddleware')
require('dotenv').config()

const usersRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')

const app = express()

const dbURI = process.env.DB_URI

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(ressult => app.listen(process.env.PORT || 5000))
	.catch(err => console.log(err))

// View engine
app.set('view engine', 'ejs')

// Static files
app.use(express.static('public'))

// Parse json & cookies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.get('*', checkUser)

app.get('/', (req, res) => (req.user ? res.redirect('/blog') : res.redirect('/users/signup')))

app.get('/about', (req, res) => res.render('about', { title: 'About' }))

app.use('/users', usersRoutes)

app.use('/blog', blogRoutes)

app.use((req, res) => res.status(404).render('404', { title: '404' }))
