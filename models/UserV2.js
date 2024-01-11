const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Utils = require('../utils/generateJwtToken');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    unique: false
  },
  dateOfBirth: {
    type: Date,
    required: true,
    unique: false
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary'],
    unique: false
  },
  howDidYouHearAboutUs: {
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'other'],
    required: false
  },
  isAdmin: {
    type: Boolean,
    required: false,
    unique: false
  },
  isVerified: {
    type: Boolean,
    unique: false
  },
  socialMediaHandles: {
    type: Map,
    of: String
  },
  stateOfOrigin: {
    type: String,
    unique: false
  },
},
  {
    statics: {
      generateJwtToken(user, expiresIn) {
        const {
          _id,
          email,
          isAdmin,
          name,
          username
        } = user;

        return Utils.generateJwtToken(
          {
            id: _id,
            email,
            isAdmin,
            name,
            username
          },
          expiresIn
        );
      }
    },
    timestamps: true
  }
);

UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;