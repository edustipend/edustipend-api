require("dotenv").config();
const { Mail } = require("../services");
const { parse } = require("../utils/CSVFileParser");

const initFileParse = () => {
  const records = parse({
    fileName: "./unverified_users_20230904.csv",
    startLine: 2
  });

  // Added this for testing
  // const records = [['uduak@edustipend.org', 'Uduak', 858585]]

  records.forEach(async (record) => {
    const [email, name, code] = record;
    const link = `${process.env.APP_BASE_URL}/application?email=${email}&code=${code}`;
    Mail.sendVerificationCode(name, email, link);
  });
};

initFileParse();
