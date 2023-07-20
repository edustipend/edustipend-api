require("dotenv").config();
const { sequelize, user, token, stipendRequest } = require("../../models");

exports.declutter = async () => {
  try {
    await sequelize.sync({ alter: true });
    await user.destroy({ where: {}, force: true });
    await token.sync({ where: {}, force: true });
    await stipendRequest.sync({ where: {}, force: true });
  } catch (e) {
    console.log(e);
  }
};
