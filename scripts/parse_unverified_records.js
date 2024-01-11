require("dotenv").config();
const { Mail, Token } = require("../services");
const { parse } = require("../utils/CSVFileParser");
const { randomSixDigits } = require("../utils/helper");

const initFileParse = () => {
  parse({
    fileName: "./scripts/unverified_users_20230904.csv",
    // fileName: "./scripts/test_users.csv",
    startLine: 2
  });
  // Added this for testing
  // const records = [['uduak@edustipend.org', 'Uduak']]
  // const records = [['ranter1570+88@gmail.com', 'Chijioke Ezeh', '728038']]

  // records.forEach(async (record) => {
  //   const [email, name] = record;

  //   const code = randomSixDigits();
  //   console.log(email, name, code)

  //   await Token.genCode(email, code);
  //   console.log('token generated')
  //   const link = `${process.env.APP_BASE_URL}/application?email=${email}&code=${code}`;
  //   console.log(link)

  //   Mail.sendVerificationCode(name, email, link);
  // });
};

const dateDiff = (date) => {
  const today = new Date(Date.now());
  const diffMs = today - new Date(date);
  return Math.round(((diffMs % 86400000) % 3600000) / 60000);
};

// initFileParse();
