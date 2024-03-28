//importe mongoose
const mongoose = require('mongoose')

const User = mongoose.model('User', {
	user: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

module.exports = User