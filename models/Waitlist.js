module.exports = (sequelize, DataTypes) => {
  const Waitlist = sequelize.define(
    "waitlist",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
      hasBeenNotified: {
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
      }
    },
    {
      paranoid: true
    }
  );

  return Waitlist;
};
