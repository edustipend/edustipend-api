const models = require("../models");
const User = require("./User");
const { Mail } = require("../services");

const requestStipend = async (payload) => {
  const id = payload.userId;
  const user = await User.findByPk(id);

  const mailBody = {
    email: user.email,
    subject: "Request sent!",
    message: `Dear ${user.name}, we have received your stipend request`,
    template: "request-received",
    params: {
      name: user.name,
      email: user.email
    }
  };
  Mail._sendEmail(mailBody, (err, info) => {});

  return await models.laptopRequest.create({ ...payload });
};

module.exports = {
  requestStipend
};
