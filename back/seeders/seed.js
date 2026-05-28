require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  User,
  Space,
  Booking,
  Review,
  sequelize,
  recalcSpaceRating,
} = require('../src/models');

async function seed() {
  try {
    await sequelize.authenticate();

    const [manager] = await User.findOrCreate({
      where: { email: 'manager@example.com' },
      defaults: {
        password: await bcrypt.hash('manager123', 10),
        role: 'manager',
        name: 'Менеджер',
        isActive: true,
      },
    });

    const [client] = await User.findOrCreate({
      where: { email: 'client@example.com' },
      defaults: {
        password: await bcrypt.hash('client123', 10),
        role: 'client',
        name: 'Клиент',
        isActive: true,
      },
    });

    await User.findOrCreate({
      where: { email: 'guest@example.com' },
      defaults: {
        password: await bcrypt.hash('guest123', 10),
        role: 'guest',
        name: 'Гость',
        isActive: true,
      },
    });

    const [admin] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        name: 'Администратор',
        isActive: true,
      },
    });

    const [client2] = await User.findOrCreate({
      where: { email: 'client2@example.com' },
      defaults: {
        password: await bcrypt.hash('client123', 10),
        role: 'client',
        name: 'Клиент 2',
        isActive: true,
      },
    });

    const [client3] = await User.findOrCreate({
      where: { email: 'client3@example.com' },
      defaults: {
        password: await bcrypt.hash('client123', 10),
        role: 'client',
        name: 'Клиент 3',
        isActive: true,
      },
    });

    const spacesData = [
      {
        title: 'Open Space — у окна',
        zoneType: 'open-space',
        pricePerHour: 300,
        capacity: 8,
        description: 'Светлое общее пространство с панорамными окнами, розетки у каждого места.',
        images: ['/img/open1.jpg', '/img/open2.jpg'],
      },
      {
        title: 'Переговорная «Берёза»',
        zoneType: 'meeting-room',
        pricePerHour: 800,
        capacity: 6,
        description: 'Тихая комната для встреч, доска и экран.',
        images: ['/img/meeting1.jpg'],
      },
      {
        title: 'Кабинет Solo',
        zoneType: 'private-office',
        pricePerHour: 1200,
        capacity: 1,
        description: 'Отдельный кабинет для фокусной работы.',
        images: ['/img/office1.jpg', '/img/office2.jpg'],
      },
      {
        title: 'Hot desk зона',
        zoneType: 'open-space',
        pricePerHour: 250,
        capacity: 12,
        description: 'Гибкие места без фиксации, кофе и чай включены.',
        images: ['/img/hotdesk.jpg'],
      },
      {
        title: 'Фокус-рум «Тишина»',
        zoneType: 'private-office',
        pricePerHour: 950,
        capacity: 2,
        description: 'Небольшая комната на двоих, шумоизоляция.',
        images: ['/img/focus1.jpg'],
      },
      {
        title: 'Переговорная «Дуб»',
        zoneType: 'meeting-room',
        pricePerHour: 900,
        capacity: 10,
        description: 'Проектор 4K, граффити-доска, вода в кулере.',
        images: ['/img/meeting2.jpg'],
      },
      {
        title: 'Лаунж с диванами',
        zoneType: 'open-space',
        pricePerHour: 200,
        capacity: 20,
        description: 'Нерабочие встречи и короткие созвоны, мягкая зона.',
        images: ['/img/lounge1.jpg', '/img/lounge2.jpg'],
      },
    ];

    const spaces = [];
    for (const s of spacesData) {
      const [row] = await Space.findOrCreate({
        where: { title: s.title },
        defaults: {
          ...s,
          rating: 0,
        },
      });
      spaces.push(row);
    }

    await Booking.findOrCreate({
      where: { userId: client.id, spaceId: spaces[0].id, date: '2026-05-01' },
      defaults: {
        userId: client.id,
        spaceId: spaces[0].id,
        date: '2026-05-01',
        timeFrom: '10:00',
        timeTo: '14:00',
        comment: 'Нужны тихие места у окна',
        status: 'pending',
      },
    });

    await Booking.findOrCreate({
      where: { userId: client.id, spaceId: spaces[1].id, date: '2026-04-25' },
      defaults: {
        userId: client.id,
        spaceId: spaces[1].id,
        date: '2026-04-25',
        timeFrom: '12:00',
        timeTo: '13:00',
        comment: 'Созвон с командой',
        status: 'approved',
      },
    });

    const bookingSeeds = [
      {
        where: { userId: client.id, spaceId: spaces[2].id, date: '2026-05-03' },
        defaults: {
          userId: client.id,
          spaceId: spaces[2].id,
          date: '2026-05-03',
          timeFrom: '09:00',
          timeTo: '11:00',
          comment: 'Подготовка к экзамену',
          status: 'approved',
        },
      },
      {
        where: { userId: client2.id, spaceId: spaces[0].id, date: '2026-05-05' },
        defaults: {
          userId: client2.id,
          spaceId: spaces[0].id,
          date: '2026-05-05',
          timeFrom: '14:00',
          timeTo: '18:00',
          comment: 'Нужен стол у розетки',
          status: 'pending',
        },
      },
      {
        where: { userId: client3.id, spaceId: spaces[3].id, date: '2026-05-06' },
        defaults: {
          userId: client3.id,
          spaceId: spaces[3].id,
          date: '2026-05-06',
          timeFrom: '11:00',
          timeTo: '15:00',
          comment: 'Работа в паре',
          status: 'pending',
        },
      },
      {
        where: { userId: manager.id, spaceId: spaces[4].id, date: '2026-05-08' },
        defaults: {
          userId: manager.id,
          spaceId: spaces[4].id,
          date: '2026-05-08',
          timeFrom: '10:00',
          timeTo: '12:00',
          comment: 'Проверка зоны перед открытием',
          status: 'approved',
        },
      },
      {
        where: { userId: admin.id, spaceId: spaces[5].id, date: '2026-05-10' },
        defaults: {
          userId: admin.id,
          spaceId: spaces[5].id,
          date: '2026-05-10',
          timeFrom: '15:00',
          timeTo: '17:00',
          comment: 'Аудит переговорной',
          status: 'approved',
        },
      },
      {
        where: { userId: client2.id, spaceId: spaces[5].id, date: '2026-05-12' },
        defaults: {
          userId: client2.id,
          spaceId: spaces[5].id,
          date: '2026-05-12',
          timeFrom: '09:30',
          timeTo: '10:30',
          comment: 'Интервью кандидата',
          status: 'rejected',
        },
      },
      {
        where: { userId: client3.id, spaceId: spaces[6].id, date: '2026-05-14' },
        defaults: {
          userId: client3.id,
          spaceId: spaces[6].id,
          date: '2026-05-14',
          timeFrom: '16:00',
          timeTo: '19:00',
          comment: 'Встреча с заказчиком',
          status: 'cancelled',
        },
      },
    ];

    for (const b of bookingSeeds) {
      await Booking.findOrCreate({
        where: b.where,
        defaults: b.defaults,
      });
    }

    await Review.findOrCreate({
      where: { userId: client.id, spaceId: spaces[0].id },
      defaults: {
        userId: client.id,
        spaceId: spaces[0].id,
        text: 'Удобно и тихо, рекомендую.',
        rating: 5,
        isHidden: false,
      },
    });

    await Review.findOrCreate({
      where: { userId: manager.id, spaceId: spaces[1].id },
      defaults: {
        userId: manager.id,
        spaceId: spaces[1].id,
        text: 'Отличная переговорка для презентаций.',
        rating: 4,
        isHidden: false,
      },
    });

    await Review.findOrCreate({
      where: { userId: client.id, spaceId: spaces[2].id },
      defaults: {
        userId: client.id,
        spaceId: spaces[2].id,
        text: 'Кабинет компактный, всё необходимое есть.',
        rating: 5,
        isHidden: false,
      },
    });

    const reviewSeeds = [
      {
        where: { userId: client2.id, spaceId: spaces[0].id },
        defaults: {
          userId: client2.id,
          spaceId: spaces[0].id,
          text: 'Много света, wi-fi стабильный.',
          rating: 4,
          isHidden: false,
        },
      },
      {
        where: { userId: client3.id, spaceId: spaces[0].id },
        defaults: {
          userId: client3.id,
          spaceId: spaces[0].id,
          text: 'Шумновато у прохода, но цена ок.',
          rating: 3,
          isHidden: false,
        },
      },
      {
        where: { userId: client2.id, spaceId: spaces[1].id },
        defaults: {
          userId: client2.id,
          spaceId: spaces[1].id,
          text: 'Удобно для воркшопа на шестерых.',
          rating: 5,
          isHidden: false,
        },
      },
      {
        where: { userId: manager.id, spaceId: spaces[2].id },
        defaults: {
          userId: manager.id,
          spaceId: spaces[2].id,
          text: 'Кабинет держит фокус, клиенты довольны.',
          rating: 5,
          isHidden: false,
        },
      },
      {
        where: { userId: client2.id, spaceId: spaces[3].id },
        defaults: {
          userId: client2.id,
          spaceId: spaces[3].id,
          text: 'Hot desk — то, что нужно на день.',
          rating: 4,
          isHidden: false,
        },
      },
      {
        where: { userId: client3.id, spaceId: spaces[4].id },
        defaults: {
          userId: client3.id,
          spaceId: spaces[4].id,
          text: 'Фокус-рум отлично глушит соседей.',
          rating: 5,
          isHidden: false,
        },
      },
      {
        where: { userId: client.id, spaceId: spaces[5].id },
        defaults: {
          userId: client.id,
          spaceId: spaces[5].id,
          text: 'Большой стол, удобные стулья.',
          rating: 4,
          isHidden: false,
        },
      },
      {
        where: { userId: manager.id, spaceId: spaces[6].id },
        defaults: {
          userId: manager.id,
          spaceId: spaces[6].id,
          text: 'Лаунж хорош для неформальных встреч.',
          rating: 4,
          isHidden: false,
        },
      },
      {
        where: { userId: admin.id, spaceId: spaces[4].id },
        defaults: {
          userId: admin.id,
          spaceId: spaces[4].id,
          text: 'Тестовый отзыв для модерации',
          rating: 2,
          isHidden: true,
        },
      },
    ];

    for (const rv of reviewSeeds) {
      await Review.findOrCreate({
        where: rv.where,
        defaults: rv.defaults,
      });
    }

    for (const sp of spaces) {
      await recalcSpaceRating(sp.id);
    }

    console.log('Seed completed.');
    console.log('manager@example.com / manager123 (manager)');
    console.log('client@example.com / client123 (client)');
    console.log('client2@example.com / client123 (client)');
    console.log('client3@example.com / client123 (client)');
    console.log('guest@example.com / guest123 (guest)');
    console.log('admin@example.com / admin123 (admin)');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
