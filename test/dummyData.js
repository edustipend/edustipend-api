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

const BadResetPasswordData = {
  name: "eloghosa"
};

const badResetData = {
  email: "tes@gmail.com"
};

const passwordCheck = {
  email: "tes@gmail.com",
  password: "newPassword_123",
  confirmPassword: "newPassword"
};

module.exports = {
  registerUser,
  badRegisterUserRequest,
  BadResetPasswordData,
  badResetData,
  passwordCheck
};
