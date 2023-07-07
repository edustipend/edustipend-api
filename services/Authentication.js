const bcrypt = require("bcryptjs");
const User = require("./User");

class Authentication {

    /**
     * @param {string} password
     */

    static async hashpassword(password) {
        return await bcrypt.hash(password, 10);
    }

    	/**
	 * @description Compare password
	 * @param {*} data
	 */

	static async comparePassword(password, dbpassword) {
		return bcrypt.compare(password, dbpassword);
	}

    /**
     * @description Register a new user
     * @param {object} data
     */

    static async register(data) {
        const {name, email, dateOfBirth, gender, stateOfOrigin,howDidYouHearAboutUs, password} = data;

        const hashedPassword = await this.hashpassword(password);
        await User.create({ name, email, dateOfBirth, gender, stateOfOrigin,howDidYouHearAboutUs, hashedPassword });
    }

}

module.exports = Authentication;