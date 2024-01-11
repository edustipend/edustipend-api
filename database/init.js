require("dotenv").config();
const mongoose = require("mongoose");
const Logger = require("../config/logger");

const { DB_HOST, DB_PASSWORD, DB_USERNAME } = process.env;

const init = () => {
  try {
    const mongoString = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`;
    mongoose.connect(mongoString);
    Logger.info("DB connected succesfully");
  } catch (err) {
    Logger.error(err);
  }
};

module.exports = init;
