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

const resetPassword = {
  name: "eloghosa",
  email: "tes@gmail.com"
}

const BadResetPasswordData = {
  name: "eloghosa"
}

const badResetData = {
  email: 'tes@gmail.com'
}

const updatePassword ={
  email: "tes@gmail.com",
  password: "12345",
  confirmPassword: "12345",
  verificationCode: "123456"
}


module.exports = {
  registerUser,
  badRegisterUserRequest,
  resetPassword,
  BadResetPasswordData,
  badResetData,
  updatePassword
};
