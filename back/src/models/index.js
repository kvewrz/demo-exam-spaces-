const { sequelize } = require('../config/database');
const User = require('./User');
const RefreshToken = require('./RefreshToken');
const Space = require('./Space');
const Booking = require('./Booking');
const Review = require('./Review');

async function recalcSpaceRating(spaceId) {
  const reviews = await Review.findAll({
    where: { spaceId, isHidden: false },
    attributes: ['rating'],
  });
  if (!reviews.length) {
    await Space.update({ rating: 0 }, { where: { id: spaceId } });
    return;
  }
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  const avg = Math.round((sum / reviews.length) * 100) / 100;
  await Space.update({ rating: avg }, { where: { id: spaceId } });
}

module.exports = {
  sequelize,
  User,
  RefreshToken,
  Space,
  Booking,
  Review,
  recalcSpaceRating,
};
