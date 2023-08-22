module.exports = (sequelize, DataTypes) => {
  const StipendRequest = sequelize.define(
    "stipendRequest",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
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
      stipendCategory: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["laptop", "data", "course"],
        validate: {
          notEmpty: {
            args: true,
            msg: "Stipend category field is required"
          }
        }
      },

      reasonForRequest: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Reason for request field is required"
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
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isDenied: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      hasReceivedStipendBefore: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    },
    {
      timestamps: true
    }
  );
  //relationship
  StipendRequest.associate = function (models) {
    StipendRequest.belongsTo(models.user, {
      foreignKey: "userId"
    });
  };
  return StipendRequest;
};
