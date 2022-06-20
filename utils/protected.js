const { verify } = require('jsonwebtoken')
const User = require('../models/user')

const protected = async (req, res, next) => {
	const authorization = req.headers['authorization']

	if (!authorization)
		return res.status(500).json({
			message: 'No token! 🤔',
			type: 'error',
		})

	const token = authorization.split(' ')[1]
	let id
	try {
		id = verify(token, process.env.ACCESS_TOKEN_SECRET).id
	} catch {
		return res.status(500).json({
			message: 'Invalid token! 🤔',
			type: 'error',
		})
	}

	if (!id)
		return res.status(500).json({
			message: 'Invalid token! 🤔',
			type: 'error',
		})

	const user = await User.findById(id)

	if (!user)
		return res.status(500).json({
			message: "User doesn't exist! 😢",
			type: 'error',
		})

	req.user = user
	next()
}

module.exports = { protected }
