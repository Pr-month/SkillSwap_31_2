import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  create(createCategoryDto: CreateCategoryDto) {
    return createCategoryDto;
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return id;
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
