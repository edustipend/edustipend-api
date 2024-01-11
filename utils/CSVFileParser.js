const fs = require("fs");
const { parse } = require("csv-parse");
const { Mail, Token } = require("../services");
const { randomSixDigits } = require("./helper");

const parseRecords = async ({ fileName, startLine }) => {
  fs.createReadStream(fileName)
    .pipe(parse({ delimiter: ",", from_line: startLine }))
    .on("data", async (row) => {
      const code = randomSixDigits();
      const [email, name] = row;
      console.log(email, name, code);

      await Token.genCode(email, code);
      console.log("token generated");

      const link = `${process.env.APP_BASE_URL}/application?email=${email}&code=${code}`;
      console.log(link);
      Mail.sendVerificationCode(name, email, link);
    })
    .on("end", function () {
      console.log("File parsing complete");
    })
    .on("error", function (error) {
      console.error("Error parsing file");
      console.log(error.message);
    });
};

module.exports = {
  parse: parseRecords
};
