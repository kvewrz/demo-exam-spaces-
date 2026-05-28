require('dotenv').config();
const { sequelize } = require('../src/models');

async function migrate() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Migrations completed (tables synced).');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
