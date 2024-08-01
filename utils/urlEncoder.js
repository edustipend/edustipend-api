require("dotenv").config();

const constructEncodedSALReferralUrl = (
  name,
  email,
  campaign = "Edustipend at 2",
  source
) => {
  const referralUrl = `https://www.edustipend.org/support-a-learner?utm_campaign=${campaign}&utm_medium=${email}&utm_referrer=${name}&utm_source=${
    source ?? ""
  }`;
  return encodeURI(referralUrl);
};

module.exports = {
  constructEncodedSALReferralUrl
};
