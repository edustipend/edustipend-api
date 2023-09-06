const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "name field is required"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Email is not valid"
          },
          notEmpty: {
            args: true,
            msg: "Email field is required"
          }
        }
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "dateOfBirth field is required of format: YYYY-MM-DD"
          }
        }
      },
      gender: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["male", "female", "non-binary"],
        validate: {
          notNull: {
            args: true,
            msg: "gender field is required"
          }
        }
      },
      stateOfOrigin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "stateOfOrigin field is required"
          }
        }
      },
      twitter: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            args: true,
            msg: "not a valid url"
          }
        }
      },
      howDidYouHearAboutUs: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["facebook", "twitter", "instagram", "other"],
        validate: {
          notNull: {
            args: true,
            msg: "howDidYouHearAboutUs field is required"
          }
        }
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isCreateAccount: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password field is required"
          }
        }
      }
    },
    { paranoid: true }
  );

  //  relationship
  User.associate = function (models) {
    User.hasMany(models.stipendRequest, {
      foreignKey: "userId",
      as: "stipendRequests"
    });
  };

  // instance method
  User.prototype.generateJwtToken = function () {
    return jwt.sign(
      {
        id: this.id,
        isAdmin: this.isAdmin,
        name: this.name,
        email: this.email
      },
      process.env.APP_TOKEN_KEY,
      {
        expiresIn: "5d"
      }
    );
  };

  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
