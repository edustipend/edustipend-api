const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const { combine, errors, json, prettyPrint, timestamp } = format;

const logDir = path.join(__dirname, "..", "logs");

const options = {
  json: true,
  dirname: logDir,
  filename: "%DATE%",
  datePattern: "YYYY-MM-DD",
  utc: false,
  extension: ".log",
  maxFiles: "1d"
};

const Logger = createLogger({
  format: combine(errors({ stack: true }), json(), timestamp(), prettyPrint()),
  transports: new DailyRotateFile(options)
});

if (process.env.NODE_ENV === "development"
  // TODO: Add prod logging service, then we can remove this
  || process.env.NODE_ENV === "production"
) {
  Logger.add(new transports.Console());
}

module.exports = Logger;
