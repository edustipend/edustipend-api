const { nanoid } = require("nanoid");

const generateFlutterwaveTxref = () => {
  return `edustipend-txref-${nanoid()}`;
};

module.exports = generateFlutterwaveTxref;
