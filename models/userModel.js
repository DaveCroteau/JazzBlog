const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Please add a name'],
			unique: true,
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			lowercase: true,
			validate: [email => (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ? true : false), 'Please enter a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: [6, 'Minimum password lenght is 6'],
		},
	},
	{
		timestamps: true,
	}
)

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt()
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email })

	if (user) {
		const auth = await bcrypt.compare(password, user.password)
		if (auth) {
			return user
		} else {
			throw Error('Incorrect password')
		}
	} else {
		throw Error('Invalid email')
	}
}

module.exports = mongoose.model('User', userSchema)
