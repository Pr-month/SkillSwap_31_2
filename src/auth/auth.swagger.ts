import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserGender } from '../users/users.enums';
import { ApiHttpError } from '../common/swagger/swagger.common';

const userGenderEnum = Object.values(UserGender).filter(
  (v) => typeof v === 'string',
) as string[];

const registerBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 32, example: 'Иван' },
    email: {
      type: 'string',
      format: 'email',
      minLength: 5,
      maxLength: 255,
      example: 'ivan@example.com',
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 4096,
      example: 'StrongP@ssw0rd',
    },
    about: {
      type: 'string',
      minLength: 6,
      maxLength: 512,
      example: 'Немного обо мне',
    },
    birthday: {
      type: 'string',
      format: 'date-time',
      description: 'ISO 8601 (IsDateString)',
      example: '1995-05-20T00:00:00.000Z',
    },
    city: { type: 'string', minLength: 1, maxLength: 512, example: 'Москва' },
    gender: {
      type: 'string',
      enum: userGenderEnum.length ? userGenderEnum : undefined,
      example: userGenderEnum[0] ?? 'notSpecified',
    },
    avatar: {
      type: 'string',
      format: 'uri',
      minLength: 5,
      maxLength: 1024,
      example: 'https://cdn.example.com/avatars/1.png',
    },
    categoryId: { type: 'integer', minimum: 1, example: 3 },
  },
  required: [
    'name',
    'email',
    'password',
    'about',
    'birthday',
    'city',
    'gender',
    'avatar',
    'categoryId',
  ],
  additionalProperties: false,
};

const loginBodySchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', example: 'ivan@example.com' },
    password: { type: 'string', example: 'StrongP@ssw0rd' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

const tokensResponseSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.payload.signature',
    },
    refresh_token: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.payload.signature',
    },
  },
  required: ['access_token', 'refresh_token'],
  additionalProperties: false,
};

export const AuthControllerSwagger = () => applyDecorators(ApiTags('Auth'));

export const AuthRegisterSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Регистрация',
      description:
        'Создаёт пользователя и возвращает пару токенов (access_token, refresh_token).',
    }),
    ApiBody({ schema: registerBodySchema }),
    ApiCreatedResponse({
      description: 'Пользователь зарегистрирован, токены выданы',
      schema: tokensResponseSchema,
    }),
    ApiHttpError({
      status: 404,
      description: 'Категория не найдена (categoryId)',
      messageExample: 'Категория не найдена',
      pathExample: '/auth/register',
      errorExample: 'Not Found',
    }),
    ApiHttpError({
      status: 409,
      description: 'Конфликт (например, email уже занят)',
      messageExample: 'ресурс уже существует',
      pathExample: '/auth/register',
      errorExample: 'Conflict',
    }),
    ApiHttpError({
      status: 400,
      description: 'Невалидное тело запроса (ValidationPipe)',
      messageExample: 'Bad Request Exception',
      pathExample: '/auth/register',
    }),
  );

export const AuthLoginSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Логин',
      description: 'Аутентификация по email/password и выдача пары токенов.',
    }),
    ApiBody({ schema: loginBodySchema }),
    ApiCreatedResponse({
      description: 'Успешный логин, токены выданы',
      schema: tokensResponseSchema,
    }),
    ApiHttpError({
      status: 401,
      description: 'Неверный email/пароль',
      messageExample: 'Unauthorized',
      pathExample: '/auth/login',
      errorExample: 'Unauthorized',
    }),
    ApiHttpError({
      status: 400,
      description: 'Невалидное тело запроса',
      messageExample: 'Bad Request Exception',
      pathExample: '/auth/login',
    }),
  );

export const AuthRefreshSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Обновление токенов',
      description:
        'Требуется refresh-токен в заголовке Authorization: Bearer <refresh_token>',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      description: 'Новая пара токенов',
      schema: tokensResponseSchema,
    }),
    ApiHttpError({
      status: 401,
      description: 'Нет/невалидный refresh-токен',
      messageExample: 'Unauthorized',
      pathExample: '/auth/refresh',
      errorExample: 'Unauthorized',
    }),
  );
