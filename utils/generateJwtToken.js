require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateJwtToken = function ({
	id,
	isAdmin,
	name,
	email
}) {
	return jwt.sign(
		{
			id,
			isAdmin,
			name,
			email
		},
		process.env.APP_TOKEN_KEY,
		{
			expiresIn: "5d"
		}
	);
};

module.exports = {
	generateJwtToken
}
