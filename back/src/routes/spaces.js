const express = require('express');
const { Op } = require('sequelize');
const { Space } = require('../models');
const { authMiddleware, requireRoles } = require('../middleware/auth');

const router = express.Router();

const SORT = {
  price_asc: [['pricePerHour', 'ASC']],
  price_desc: [['pricePerHour', 'DESC']],
  rating_desc: [['rating', 'DESC']],
  id_asc: [['id', 'ASC']],
};

router.get('/popular', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 3, 20);
    const rows = await Space.findAll({
      order: [['rating', 'DESC'], ['id', 'ASC']],
      limit,
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch popular spaces' });
  }
});

router.get('/', async (req, res) => {
  try {
    const {
      zoneType,
      minPrice,
      maxPrice,
      minCapacity,
      sort,
      page: pageStr,
      limit: limitStr,
    } = req.query;

    const page = Math.max(1, parseInt(pageStr, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr, 10) || 10));
    const offset = (page - 1) * limit;

    const where = {};

    if (zoneType != null && zoneType !== '') {
      const allowed = ['open-space', 'meeting-room', 'private-office'];
      if (!allowed.includes(zoneType)) {
        return res.status(400).json({ error: 'Invalid zoneType' });
      }
      where.zoneType = zoneType;
    }

    if (minPrice != null && minPrice !== '') {
      const val = parseFloat(minPrice);
      if (Number.isNaN(val)) {
        return res.status(400).json({ error: 'Invalid minPrice' });
      }
      where.pricePerHour = where.pricePerHour || {};
      where.pricePerHour[Op.gte] = val;
    }

    if (maxPrice != null && maxPrice !== '') {
      const val = parseFloat(maxPrice);
      if (Number.isNaN(val)) {
        return res.status(400).json({ error: 'Invalid maxPrice' });
      }
      where.pricePerHour = where.pricePerHour || {};
      where.pricePerHour[Op.lte] = val;
    }

    if (minCapacity != null && minCapacity !== '') {
      const val = parseInt(minCapacity, 10);
      if (Number.isNaN(val)) {
        return res.status(400).json({ error: 'Invalid minCapacity' });
      }
      where.capacity = { [Op.gte]: val };
    }

    const order = SORT[sort] || SORT.id_asc;

    const { rows, count } = await Space.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    res.json({
      data: rows,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch spaces' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const space = await Space.findByPk(req.params.id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch space' });
  }
});

router.post('/', authMiddleware, requireRoles('manager'), async (req, res) => {
  try {
    const {
      title,
      zoneType,
      pricePerHour,
      capacity,
      description,
      images,
    } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const allowedZones = ['open-space', 'meeting-room', 'private-office'];
    if (!zoneType || !allowedZones.includes(zoneType)) {
      return res.status(400).json({ error: 'Valid zoneType is required' });
    }
    if (pricePerHour == null || pricePerHour === '') {
      return res.status(400).json({ error: 'pricePerHour is required' });
    }
    const price = parseFloat(pricePerHour);
    if (Number.isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Invalid pricePerHour' });
    }
    if (capacity == null || capacity === '') {
      return res.status(400).json({ error: 'capacity is required' });
    }
    const cap = parseInt(capacity, 10);
    if (Number.isNaN(cap) || cap < 1) {
      return res.status(400).json({ error: 'Invalid capacity' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const imgs = Array.isArray(images) ? images : [];
    const space = await Space.create({
      title: String(title).trim(),
      zoneType,
      pricePerHour: price,
      capacity: cap,
      description: String(description).trim(),
      images: imgs,
      rating: 0,
    });
    res.status(201).json(space);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create space' });
  }
});

router.put('/:id', authMiddleware, requireRoles('manager'), async (req, res) => {
  try {
    const space = await Space.findByPk(req.params.id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    const {
      title,
      zoneType,
      pricePerHour,
      capacity,
      description,
      images,
    } = req.body;

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      space.title = String(title).trim();
    }
    if (zoneType !== undefined) {
      const allowedZones = ['open-space', 'meeting-room', 'private-office'];
      if (!allowedZones.includes(zoneType)) {
        return res.status(400).json({ error: 'Invalid zoneType' });
      }
      space.zoneType = zoneType;
    }
    if (pricePerHour !== undefined) {
      const price = parseFloat(pricePerHour);
      if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Invalid pricePerHour' });
      }
      space.pricePerHour = price;
    }
    if (capacity !== undefined) {
      const cap = parseInt(capacity, 10);
      if (Number.isNaN(cap) || cap < 1) {
        return res.status(400).json({ error: 'Invalid capacity' });
      }
      space.capacity = cap;
    }
    if (description !== undefined) {
      if (!String(description).trim()) {
        return res.status(400).json({ error: 'Description cannot be empty' });
      }
      space.description = String(description).trim();
    }
    if (images !== undefined) {
      space.images = Array.isArray(images) ? images : [];
    }

    await space.save();
    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update space' });
  }
});

router.delete('/:id', authMiddleware, requireRoles('manager'), async (req, res) => {
  try {
    const space = await Space.findByPk(req.params.id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    await space.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete space' });
  }
});

module.exports = router;
