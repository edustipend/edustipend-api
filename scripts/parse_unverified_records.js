require("dotenv").config();
const { Mail } = require("../services");
const { parse } = require("../utils/CSVFileParser");

const initFileParse = () => {
  const records = parse({
    fileName: "./scripts/unverified_users_20230904.csv",
    startLine: 2
  });

  // Added this for testing
  // const records = [['uduak@edustipend.org', 'Uduak', 858585]]

  records.forEach(async (record) => {
    const [email, name, code] = record;
    // console.log(email, name, code)
    const link = `${process.env.APP_BASE_URL}/application?email=${email}&code=${code}`;
    Mail.sendVerificationCode(name, email, link);
  });
};

initFileParse();
