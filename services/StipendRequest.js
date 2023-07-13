const models = require("../models");

const requestStipend = async (payload) => {
  return await models.laptopRequest.create({ ...payload });
}

module.exports = {
  requestStipend
}