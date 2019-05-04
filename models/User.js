module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 255],
      },
    },
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    //   validate: {
    //     isEmail: true,
    //     len: [1, 255],
    //   },
    // },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = models => {
    User.hasMany(models.Review, {
      foreignKey: {
        name: 'userId',
        //allowNull: false, // add cascade delete to use this
        constraints: false,
      },
    });
  };

  return User;
};