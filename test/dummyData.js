const faker = require("faker");

const registerUser = {
  name: "eloghosa",
  email: "tes@gmail.com",
  password: "string123456",
  dateOfBirth: "1990-09-02",
  gender: "male",
  stateOfOrigin: "lagos",
  howDidYouHearAboutUs: "facebook"
};

const badRegisterUserRequest = {
  name: "eloghosa",
  email: "test@gmail.com",
  password: "string123456",

  gender: "male",
  howDidYouHearAboutUs: "facebook"
};

const passwordReset = {
  name: "eloghosa",
  email: "tes@gmail.com"
}

const badResetRequest = {
    email: "test@gmail.com"
}

module.exports = {
  registerUser,
  badRegisterUserRequest,
  passwordReset,
  badResetRequest
};