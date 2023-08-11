const faker = require("faker");

const registerUser = {
  name: "eloghosa",
  email: "tes@gmail.com",
  password: "string123456",
  dateOfBirth: "1990-09-02",
  gender: "male",
  stateOfOrigin: "lagos",
  howDidYouHearAboutUs: "facebook",
  isApproved: true
};

const badRegisterUserRequest = {
  name: "eloghosa",
  email: "test@gmail.com",
  password: "string123456",

  gender: "male",
  howDidYouHearAboutUs: "facebook"
};

const completeStipendRequestData = {
  email: "tes@gmail.com",
  stipendCategory: "course",
  reasonForRequest: "To help me with one",
  stepsTakenToEaseProblem: "I have used pirate sites",
  potentialBenefits: "I could get to learn a lot",
  futureHelpFromUser: "I will give back to the community"
};

const anotherCompleteStipendRequestData = {
  email: "mez@yahoo.co.uk",
  stipendCategory: "laptop",
  reasonForRequest: "I need to code",
  stepsTakenToEaseProblem: "I go to expensive cyber cafes",
  potentialBenefits: "It would give me more practice time",
  futureHelpFromUser: "I will re-invest in edustipend"
};

const incompleteStipendRequestData = {
  email: "tes@gmail.com",
  stipendCategory: "course",
  reasonForRequest: "To help me with one"
};

const badStipendRequestDataType = {
  email: "tes@gmail.com",
  stipendCategory: "course",
  reasonForRequest: "To help me with one",
  stepsTakenToEaseProblem: "I have used pirate sites",
  potentialBenefits: "I could get to learn a lot",
  futureHelpFromUser: "I will give back to the community",
  hasReceivedLaptopBefore: "Not received"
};
const approvedUser ={
email: 'linda@gmail.com',
stipendCategory: "data",
reasonForRequest: "To help me pleas",
stepsTakenToEaseProblem: "none yet",
potentialBenefits: "I could get to learn a lot",
futureHelpFromUser: "I will give back to the community",
hasReceivedLaptopBefore: "Not received",
isApproved: true
}

module.exports = {
  registerUser,
  badRegisterUserRequest,
  completeStipendRequestData,
  incompleteStipendRequestData,
  badStipendRequestDataType,
  anotherCompleteStipendRequestData,
  approvedUser
};
