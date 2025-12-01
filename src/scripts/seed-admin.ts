import { AppDataSource } from 'src/config/db.config';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { adminData } from './seed-admin.data';

export async function seedAdmin(userRepository: Repository<User>) {
  try {
    const existingAdmin = await userRepository.findOne({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log('Пользователь уже существует');
      return;
    }

    const adminUser = userRepository.create({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      about: adminData.about,
      birthday: adminData.birthday,
      city: adminData.city,
      gender: adminData.gender,
      avatar: adminData.avatar,
      role: adminData.role,
      refreshToken: '',
    });

    await userRepository.save(adminUser);
    console.log('Пользователь с правами администратора успешно создан');
  } catch (error) {
    console.error('Error in seedAdmin:', error);
    throw error;
  }
}

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection');

    const userRepository = AppDataSource.getRepository(User);

    await seedAdmin(userRepository);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

seed();
