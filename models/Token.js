module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "token",
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
        validate: {
          isEmail: {
            args: true,
            msg: "Email is not valid"
          }
        }
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      indexes: [
        {
          fields: ["email"]
        }
      ]
    }
  );
  //   Token.associate = function(models) {};
  return Token;
};
