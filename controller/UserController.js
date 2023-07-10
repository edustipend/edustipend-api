//controller file
const User = require('../services/User')


const password = async (req, res)=>{
    const {email}= req.body
    User.resetPassword()
  res.status(200).send('Done')
  }

module.exports = password;
