import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { FindCitiesQueryDto } from './dto/find-city-dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const checkCityExist = await this.cityRepository.findOne({
      where: { name: createCityDto.name },
    });

    if (checkCityExist) {
      throw new ConflictException('Город с таким названием уже существует');
    }

    const city = this.cityRepository.create(createCityDto);
    return await this.cityRepository.save(city);
  }

  async findAll(query: FindCitiesQueryDto) {
    const { page, limit, search } = query;
    const offset = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<City> = {};
    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    const total = await this.cityRepository.count({ where: whereConditions });

    const totalPages = Math.ceil(total / limit);
    if (page > totalPages && total > 0) {
      throw new NotFoundException(
        `Страница ${page} не найдена. Всего страниц: ${totalPages}`,
      );
    }

    const cities = await this.cityRepository.find({
      order: { name: 'ASC' },
      skip: offset,
      take: limit,
      where: whereConditions,
    });

    if (cities.length === 0) {
      throw new NotFoundException('Города не найдены');
    }

    return {
      cities,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: number) {
    const city = await this.cityRepository.findOneOrFail({ where: { id } });
    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);

    Object.assign(city, updateCityDto);

    return await this.cityRepository.save(city);
  }

  async remove(id: number) {
    if (!id || Number.isNaN(id)) {
      throw new BadRequestException('Некорректный id города');
    }

    const city = await this.cityRepository.findOne({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException(`Город с id ${id} не найден`);
    }

    await this.cityRepository.remove(city);
  }
}
