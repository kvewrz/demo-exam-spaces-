const express = require('express');
const { Review, Space, User, recalcSpaceRating } = require('../models');
const { authMiddleware, requireRoles } = require('../middleware/auth');

const router = express.Router();

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

router.get('/', async (req, res) => {
  try {
    const { spaceId, page: pageStr, limit: limitStr } = req.query;
    if (spaceId == null || spaceId === '') {
      return res.status(400).json({ error: 'spaceId is required' });
    }
    const sid = parseInt(spaceId, 10);
    if (Number.isNaN(sid)) {
      return res.status(400).json({ error: 'Invalid spaceId' });
    }
    const { page, limit, offset } = parsePagination({ page: pageStr, limit: limitStr });
    const { rows, count } = await Review.findAndCountAll({
      where: { spaceId: sid, isHidden: false },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'email', 'name'] }],
      limit,
      offset,
      distinct: true,
      col: 'id',
    });
    res.json({
      data: rows,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});

router.get('/manage', authMiddleware, requireRoles('manager', 'admin'), async (req, res) => {
  try {
    const { spaceId, page: pageStr, limit: limitStr } = req.query;
    if (spaceId == null || spaceId === '') {
      return res.status(400).json({ error: 'spaceId is required' });
    }
    const sid = parseInt(spaceId, 10);
    if (Number.isNaN(sid)) {
      return res.status(400).json({ error: 'Invalid spaceId' });
    }
    const { page, limit, offset } = parsePagination({ page: pageStr, limit: limitStr });
    const { rows, count } = await Review.findAndCountAll({
      where: { spaceId: sid },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'email', 'name'] }],
      limit,
      offset,
      distinct: true,
      col: 'id',
    });
    res.json({
      data: rows,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});

router.use(authMiddleware);

router.post('/', requireRoles('client', 'manager'), async (req, res) => {
  try {
    const { spaceId, text, rating } = req.body;
    if (spaceId == null || spaceId === '') {
      return res.status(400).json({ error: 'spaceId is required' });
    }
    const sid = parseInt(spaceId, 10);
    if (Number.isNaN(sid)) {
      return res.status(400).json({ error: 'Invalid spaceId' });
    }
    const space = await Space.findByPk(sid);
    if (!space) {
      return res.status(400).json({ error: 'Space not found' });
    }
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: 'text is required' });
    }
    if (rating == null || rating === '') {
      return res.status(400).json({ error: 'rating is required' });
    }
    const r = parseInt(rating, 10);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: 'rating must be 1..5' });
    }

    const existing = await Review.findOne({
      where: { userId: req.user.id, spaceId: sid },
    });
    if (existing) {
      return res.status(400).json({ error: 'You already left a review for this zone' });
    }

    const review = await Review.create({
      userId: req.user.id,
      spaceId: sid,
      text: String(text).trim(),
      rating: r,
      isHidden: false,
    });
    await recalcSpaceRating(sid);
    const created = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['id', 'email', 'name'] }],
    });
    res.status(201).json(created);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'You already left a review for this zone' });
    }
    res.status(500).json({ error: err.message || 'Failed to create review' });
  }
});

router.patch('/:id', requireRoles('manager', 'admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    const { isHidden } = req.body;
    if (isHidden !== undefined) {
      review.isHidden = Boolean(isHidden);
    }
    const sid = review.spaceId;
    await review.save();
    await recalcSpaceRating(sid);
    const updated = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['id', 'email', 'name'] }],
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update review' });
  }
});

router.delete('/:id', requireRoles('manager', 'admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    const sid = review.spaceId;
    await review.destroy();
    await recalcSpaceRating(sid);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete review' });
  }
});

module.exports = router;
