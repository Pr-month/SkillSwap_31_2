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
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Категория с таким названием уже существует');
    }

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

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return {
      id,
      updateCategoryDto,
    };
  }

  remove(id: number) {
    return id;
  }
}
