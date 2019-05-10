module.exports = function(sequelize, DataTypes) {
  const Review = sequelize.define("Review", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        max: 5,
      },
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 255],
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [6, 1023],
      }
    }
  });

  Review.associate = models => {
    Review.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        //allowNull: false, // add cascade delete to use this
      },
    });
  };

  return Review;
};

