// src/scripts/seed-users.ts

import { AppDataSource } from '../config/db.config';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { usersData } from './seed-users.data';
import { Category } from '../categories/entities/category.entity';
import { seedCategories } from './seed-categories';

async function seedUsers(
  categoryRepo: Repository<Category>,
  userRepo: Repository<User>,
) {
  try {
    const count = await userRepo.count();

    if (count > 0) {
      console.log('Сид прерван: пользователи уже существуют');
      return;
    }

    const categories = await categoryRepo.find();

    if (categories.length === 0) {
      throw new Error('Категории не найдены. Сначала выполните сид категорий.');
    }

    for (const data of usersData) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      const user = userRepo.create({
        ...data,
        wantToLearn: [randomCategory],
        refreshToken: '',
      });

      await userRepo.save(user);
      console.log(
        `Создан пользователь: ${user.email}, категория: ${randomCategory.name}`,
      );
    }

    console.log('Сид выполнен: пользователи добавлены');
  } catch (error) {
    console.error('Ошибка seedUsers:', error);
    throw error;
  }
}

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);

    // await seedCategories(categoryRepository);

    await seedUsers(categoryRepository, userRepository);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

seed();
