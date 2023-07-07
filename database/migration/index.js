require('dotenv').config();
const {sequelize, user} = require('../../models');


sequelize
  .authenticate()
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));
(async () => {
	try {
		await sequelize.sync({alter: true});
		await user.sync({alter: true});
	} catch (error) {
		console.log(error);
	}
})();