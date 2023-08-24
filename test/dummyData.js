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

const BadResetPasswordData = {
  name: "eloghosa"
};

const badResetData = {
  email: "tes@gmail.com"
};

const passwordCheck = {
  email: "tes@gmail.com",
  password: "newPassword_123",
  confirmPassword: "newPassword_123",
  code: "123456"
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
  stipendCategory: "",
  reasonForRequest: "To help me with one",
  stepsTakenToEaseProblem: "I have used pirate sites",
  potentialBenefits: "I could get to learn a lot",
  futureHelpFromUser: "I will give back to the community"
};
const approvedUser = {
  email: "linda@gmail.com",
  stipendCategory: "data",
  reasonForRequest: "To help me pleas",
  stepsTakenToEaseProblem: "none yet",
  potentialBenefits: "I could get to learn a lot",
  futureHelpFromUser: "I will give back to the community",
  isApproved: true
};

/**
 * I will set a startDate that will always be 2 days ahead of the current date
 * And an endDate that will always be 5 days ahead of the current date
 * So that the test will never fail because of expiration of dates
 */

// today's date
const todaysDate = new Date();
todaysDate.toISOString().split("T")[0];

// startDate
const startDate = new Date();
startDate.setDate(startDate.getDate() + 2);
startDate.toISOString().split("T")[0];

// endDate
const endDate = new Date();
endDate.setDate(startDate.getDate() + 5);
endDate.toISOString().split("T")[0];

// upcoming date object
const validUpcomingApplicationWindow = {
  startDate,
  endDate
};

const validActiveApplicationWindow = {
  startDate: todaysDate,
  endDate
};

const invalidApplicationWindowFormat = {
  startDate: "09-01-1998",
  endDate: "09-08-1998"
};

module.exports = {
  registerUser,
  badRegisterUserRequest,
  BadResetPasswordData,
  badResetData,
  passwordCheck,
  completeStipendRequestData,
  incompleteStipendRequestData,
  badStipendRequestDataType,
  anotherCompleteStipendRequestData,
  approvedUser,
  validUpcomingApplicationWindow,
  validActiveApplicationWindow,
  invalidApplicationWindowFormat
};
