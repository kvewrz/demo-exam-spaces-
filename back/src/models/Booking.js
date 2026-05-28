const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Space = require('./Space');

const Booking = sequelize.define('Booking', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeFrom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeTo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: { isIn: [['pending', 'approved', 'rejected', 'cancelled']] },
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
});

Booking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(Space, { foreignKey: 'spaceId' });
Space.hasMany(Booking, { foreignKey: 'spaceId' });

module.exports = Booking;
