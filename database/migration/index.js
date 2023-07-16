require("dotenv").config();
const { sequelize, user, token,stipendRequest } = require("../../models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");

    await sequelize.sync({ alter: true });
    await user.sync({ alter: true });
    await token.sync({ alter: true });
    await stipendRequest.sync({ alter: true });

    console.log("Database synchronization completed.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();
