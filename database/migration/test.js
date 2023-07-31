require("dotenv").config();
const { sequelize, user, token, stipendRequest } = require("../../models");

exports.declutter = async () => {
  try {
    await sequelize.sync({ alter: true });
    await user.destroy({ where: {}, force: true });
    await token.destroy({ where: {}, force: true });
    await stipendRequest.destroy({ where: {}, force: true });
  } catch (e) {
    console.log(e);
  }
};
