import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();

    category.name = createCategoryDto.name;

    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoriesRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Родительская категория не найдена');
      }

      category.parent = parentCategory;
    }

    return await this.categoriesRepository.save(category);
  }

  async findAll() {
    return await this.categoriesRepository.find({
      where: {
        parent: IsNull(),
      },
      relations: ['children'],
    });
  }

  async findOne(id: number) {
    return await this.categoriesRepository.findOneOrFail({
      where: { id },
      relations: ['parent', 'children'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }

    if (updateCategoryDto.name) {
      const existing = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Категория с таким названием уже существует',
        );
      }

      category.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId === null) {
        category.parent = null;
      } else {
        const parent = await this.categoriesRepository.findOne({
          where: { id: updateCategoryDto.parentId },
        });

        if (!parent) {
          throw new NotFoundException('Родительская категория не найдена');
        }

        if (parent.id === id) {
          throw new ConflictException(
            'Категория не может быть родителем самой себе',
          );
        }

        category.parent = parent;
      }
    }

    await this.categoriesRepository.save(category);

    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }

    await this.categoriesRepository.remove(category);

    return { message: 'Категория успешно удалена' };
  }
}
