module.exports = (sequelize, DataTypes) => {
  const LaptopRequest = sequelize.define(
    "laptopRequest",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      reasonForRequest: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "reason for request field is required"
          }
        }
      },
      stepsTakenToEaseProblem: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Steps taken field is required"
          }
        }
      },
      potentialBenefits: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Potential benefits field is required"
          }
        }
      },
      futureHelpFromUser: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Future help field is required"
          }
        }
      }
    },
    {
      timestamps: true
    }
  );

  // relationship
  LaptopRequest.associate = function (models) {
    LaptopRequest.belongsTo(models.user, { foreignKey: "id" });
  };

  return LaptopRequest;
};
