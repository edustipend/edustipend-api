module.exports = (sequelize, DataTypes) => {
  const ApplicationWindow = sequelize.define("applicationWindow", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "application start date is required of format: YYYY-MM-DD"
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "application end date is required of format: YYYY-MM-DD"
        },
        isEndDateAfterStartDate(value) {
          if (value <= this.startDate) {
            throw new Error("Start date must be before end date");
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "upcoming", "expired"],
      defaultValue: "upcoming",
      allowNull: true
    },
    isClosedByAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
    /**
     * @possibleModification
     * Subsequently, we can add a provision to track which admin
     * sets and/or closes an application window
     */
  });

  return ApplicationWindow;
};
