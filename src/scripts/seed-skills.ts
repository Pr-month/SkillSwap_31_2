// src/scripts/seed-users.ts

import { AppDataSource } from '../config/db.config';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { usersData } from './seed-users.data';
import { skillsData } from './seed-skills.data';


async function seedSkills(
  skillRepo: Repository<Skill>,
  userRepo: Repository<User>,
  categoryRepo: Repository<Category>) {
  try {
    console.log('Начало сидинга навыков...');

    const users = await userRepo.find();
    const userMap = new Map(users.map(user => [user.id, user]));

    const categories = await categoryRepo.find({
      relations: ['parent'],
    });

    const parentCategoryMap = new Map<string, Category>();
    const childCategoryMap = new Map<string, Category>();

    categories.forEach(category => {
      if (!category.parent) {
        parentCategoryMap.set(category.name, category);
      } else {
        childCategoryMap.set(category.name, category);
      }
    });

    for (const skillData of skillsData) {
      const owner = userMap.get(skillData.ownerId);
      if (!owner) {
        console.warn(`Пользователь с id ${skillData.ownerId} не найден, пропускаем...`);
        continue;
      }

      let category: Category | undefined;

      category = childCategoryMap.get(skillData.subcategoryName);

      if (!category) {
        category = parentCategoryMap.get(skillData.categoryName);
      }

      const skill = skillRepo.create({
        title: skillData.title,
        description: skillData.description,
        images: skillData.images,
        owner: owner,
        favoritedBy: [],
      });

      await skillRepo.save(skill);
      console.log('Сидинг навыков успешно создан!');
    }

  } catch (error) {
    console.error('Ошибка при создании навыков:', error);
    throw error;
  }
}

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const skillRepo = AppDataSource.getRepository(Skill);
    const userRepo = AppDataSource.getRepository(User);
    const categoryRepo = AppDataSource.getRepository(Category);

    await seedSkills(skillRepo, userRepo, categoryRepo);

    console.log('Все навыки успешно созданы');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

seed();
