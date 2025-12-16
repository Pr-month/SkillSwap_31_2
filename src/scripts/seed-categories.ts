import { Repository } from 'typeorm';
import { AppDataSource } from '../config/db.config';
import { Category } from '../categories/entities/category.entity';
import { Categories } from './seed-categories.data';

export async function seedCategories(categoryRepo: Repository<Category>) {
  const existing = await categoryRepo.count();
  if (existing > 0)
    console.log('Сид прерван: Категории уже есть в базе данных');
  else {
    let category: Category;
    let childCategory: Category;
    for (const item of Categories) {
      category = await categoryRepo.save({ name: item.name });
      console.log(category);
      for (const child of item.children) {
        childCategory = await categoryRepo.save({
          name: child,
          parent: category,
        });
        console.log(childCategory);
      }
    }
    console.log('Сид выполнен, категории добавлены');
  }
}

async function seed() {
  await AppDataSource.initialize(); //Используем подключение из config/ormconfig.ts
  const categoryRepo = AppDataSource.getRepository(Category);

  await seedCategories(categoryRepo);

  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error('Выводим ошибку', e);
  process.exit(1);
});
