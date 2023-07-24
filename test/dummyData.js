const faker = require("faker");

const registerUser = {
  name: "linda",
  email: "linda@gmail.com",
  password: "string123456",
  dateOfBirth: "1990-09-02",
  gender: "female",
  stateOfOrigin: "lagos",
  howDidYouHearAboutUs: "facebook"
};

const badRegisterUserRequest = {
  name: "linda",
  email: "linda@gmail.com",
  password: "string123456",

  gender: "male",
  howDidYouHearAboutUs: "facebook"
};

const passwordReset ={
  email: "linda@gmail.com",
  name: "linda"
}

const badPasswordReset ={
  email: "linda@gmail.com"
}

const passwordVerify ={
  email: "linda@gmail.com",
  password: "string123456",
  verificationCode: 'ABCD1234'
}

module.exports = {
  registerUser,
  badRegisterUserRequest,
  passwordReset,
  badPasswordReset,
  passwordVerify
};