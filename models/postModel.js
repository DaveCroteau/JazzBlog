const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		title: {
			type: String,
			required: [true, 'Please add a title'],
		},
		post: {
			type: String,
			required: [true, 'Please add text'],
		},
	},
	{
		timestamps: true,
	}
)

postSchema.pre('findOneAndUpdate', function (next) {
	this.options.runValidators = true
	next()
})

module.exports = mongoose.model('Post', postSchema)
