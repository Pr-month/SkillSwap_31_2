// src/scripts/seed-users.ts

import { AppDataSource } from '../config/db.config';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { usersData } from './seed-users.data';

async function seedUsers(userRepo: Repository<User>) {
  try {
    const count = await userRepo.count();

    if (count > 0) {
      console.log('Сид прерван: пользователи уже существуют');
      return;
    }

    for (const data of usersData) {
      const user = userRepo.create({
        ...data,
        refreshToken: '',
      });

      await userRepo.save(user);
      console.log(`Создан пользователь: ${user.email}`);
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

    await seedUsers(userRepository);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

seed();
