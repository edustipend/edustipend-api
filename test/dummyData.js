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

const goodRequestData = {
  email: "tes@gmail.com",
  stipendCategory: "course",
  reasonForRequest: "To help me with one",
  stepsTakenToEaseProblem: "I have used pirate sites",
  potentialBenefits: "I could get to learn a lot",
  futureHelpFromUser: "I will give back to the community",
  hasReceivedLaptopBefore: false
};

const badRequestData = {
  email: "tes@gmail.com",
  stipendCategory: "course",
  reasonForRequest: "To help me with one"
};

const badRequestDataType = {
  email: "tes@gmail.com",
  stipendCategory: "course",
  reasonForRequest: "To help me with one",
  stepsTakenToEaseProblem: "I have used pirate sites",
  potentialBenefits: "I could get to learn a lot",
  futureHelpFromUser: "I will give back to the community",
  hasReceivedLaptopBefore: "Not received"
};

module.exports = {
  registerUser,
  badRegisterUserRequest,
  goodRequestData,
  badRequestData,
  badRequestDataType
};
