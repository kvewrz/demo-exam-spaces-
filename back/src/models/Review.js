const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Space = require('./Space');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  spaceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'spaces', key: 'id' },
    onDelete: 'CASCADE',
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['user_id', 'space_id'] },
  ],
});

Review.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(Space, { foreignKey: 'spaceId' });
Space.hasMany(Review, { foreignKey: 'spaceId' });

module.exports = Review;
