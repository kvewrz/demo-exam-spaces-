const express = require('express');
const bcrypt = require('bcryptjs');
const { authMiddleware, requireRoles } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

function userPublic(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

router.use(authMiddleware);

router.get('/me', async (req, res) => {
  try {
    res.json(userPublic(req.user));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch profile' });
  }
});

router.patch('/me', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ error: 'Name cannot be empty' });
      }
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      const trimmed = String(email).trim().toLowerCase();
      if (!trimmed) {
        return res.status(400).json({ error: 'Email cannot be empty' });
      }
      const existing = await User.findOne({ where: { email: trimmed } });
      if (existing && existing.id !== user.id) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      user.email = trimmed;
    }

    if (password !== undefined && password !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json(userPublic(user));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

router.get('/', requireRoles('admin'), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']],
      limit,
      offset,
    });

    res.json({
      data: rows.map((u) => userPublic(u)),
      total: count,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
});

router.patch('/:id', requireRoles('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { isActive } = req.body;
    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }
    await user.save();
    res.json(userPublic(user));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update user' });
  }
});

module.exports = router;
