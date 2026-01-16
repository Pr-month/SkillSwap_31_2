import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiHttpError } from '../common/swagger/swagger.common';
import { Role, UserGender } from './users.enums';

const userGenderEnum = Object.values(UserGender).filter(
  (v) => typeof v === 'string',
) as string[];

const roleEnum = Object.values(Role).filter(
  (v) => typeof v === 'string',
) as string[];

const categorySchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 3 },
    name: { type: 'string', example: 'Frontend' },
  },
  required: ['id', 'name'],
  additionalProperties: false,
};

const skillSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 12 },
    name: { type: 'string', example: 'React' },
  },
  required: ['id', 'name'],
  additionalProperties: false,
};

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Иван' },
    email: { type: 'string', format: 'email', example: 'ivan@example.com' },
    about: { type: 'string', example: 'Люблю учиться и делиться опытом' },
    birthday: {
      type: 'string',
      format: 'date-time',
      example: '1995-05-20T00:00:00.000Z',
    },
    city: { type: 'string', example: 'Москва' },
    gender: {
      type: 'string',
      enum: userGenderEnum.length ? userGenderEnum : undefined,
      example: userGenderEnum[0] ?? 'notSpecified',
    },
    avatar: {
      type: 'string',
      example: 'https://cdn.example.com/avatars/1.png',
    },

    skills: { type: 'array', items: skillSchema, nullable: true },
    wantToLearn: { type: 'array', items: categorySchema, nullable: true },
    favoriteSkills: { type: 'array', items: skillSchema, nullable: true },

    role: {
      type: 'string',
      enum: roleEnum.length ? roleEnum : undefined,
      example: 'User',
    },
  },
  required: [
    'id',
    'name',
    'email',
    'about',
    'birthday',
    'city',
    'gender',
    'avatar',
    'role',
  ],
  additionalProperties: false,
};

const paginatedUsersSchema = {
  type: 'object',
  properties: {
    users: { type: 'array', items: userSchema },
    total: { type: 'integer', example: 42 },
    page: { type: 'integer', example: 1 },
    totalPages: { type: 'integer', example: 5 },
  },
  required: ['users', 'total', 'page', 'totalPages'],
  additionalProperties: false,
};

const updateMeBodySchema = {
  type: 'object',
  description: 'Частичное обновление профиля. Все поля необязательны.',
  properties: {
    name: { type: 'string', example: 'Иван' },
    email: { type: 'string', format: 'email', example: 'ivan@example.com' },
    about: { type: 'string', example: 'Немного обо мне' },
    birthday: {
      type: 'string',
      format: 'date-time',
      example: '1995-05-20T00:00:00.000Z',
    },
    city: { type: 'string', example: 'Москва' },
    avatar: {
      type: 'string',
      format: 'uri',
      example: 'https://cdn.example.com/avatars/1.png',
    },
    categoryId: {
      type: 'integer',
      example: 3,
    },
  },
  additionalProperties: false,
};

const updatePasswordBodySchema = {
  type: 'object',
  properties: {
    oldPassword: { type: 'string', example: 'OldP@ssw0rd' },
    newPassword: { type: 'string', example: 'NewP@ssw0rd' },
  },
  required: ['oldPassword', 'newPassword'],
  additionalProperties: false,
};

const passwordUpdatedSchema = {
  type: 'object',
  properties: {
    message: { type: 'string', example: 'Пароль успешно изменен' },
  },
  required: ['message'],
  additionalProperties: false,
};

export const UsersControllerSwagger = () => applyDecorators(ApiTags('Users'));

export const UsersFindAllSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить список пользователей (пагинация)' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Номер страницы (>= 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'Размер страницы (>= 1)',
    }),
    ApiOkResponse({
      description: 'Список пользователей',
      schema: paginatedUsersSchema,
    }),
    ApiHttpError({
      status: 404,
      description: 'Пользователи не найдены / страница не найдена',
      messageExample: 'Пользователи не найдены',
      pathExample: '/users',
      errorExample: 'Not Found',
    }),
    ApiHttpError({
      status: 400,
      description: 'Некорректные параметры запроса',
      messageExample: 'Bad Request Exception',
      pathExample: '/users',
    }),
  );

export const UsersGetMeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить текущего пользователя' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Текущий пользователь', schema: userSchema }),
    ApiHttpError({
      status: 401,
      description: 'Нет/невалидный access token',
      messageExample: 'Unauthorized',
      pathExample: '/users/me',
      errorExample: 'Unauthorized',
    }),
    ApiHttpError({
      status: 404,
      description: 'Пользователь не найден',
      messageExample: 'Пользователь с ID 1 не найден',
      pathExample: '/users/me',
      errorExample: 'Not Found',
    }),
  );

export const UsersFindOneSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить пользователя по ID' }),
    ApiParam({ name: 'id', type: Number, example: 1 }),
    ApiOkResponse({ description: 'Пользователь', schema: userSchema }),
    ApiHttpError({
      status: 404,
      description: 'Пользователь не найден',
      messageExample: 'Пользователь с ID 1 не найден',
      pathExample: '/users/1',
      errorExample: 'Not Found',
    }),
    ApiHttpError({
      status: 400,
      description: 'Некорректный id',
      messageExample: 'Bad Request Exception',
      pathExample: '/users/abc',
    }),
  );

export const UsersFindBySkillSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Найти пользователей по навыку',
      description:
        'Ищет ID навыка и возвращается до 10 уникальных пользователей.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 12,
      description: 'ID навыка',
    }),
    ApiOkResponse({
      description: 'Список пользователей (до 10)',
      schema: { type: 'array', items: userSchema },
    }),
    ApiHttpError({
      status: 404,
      description: 'Навык не найден',
      messageExample: 'Навык с id 12 не найден',
      pathExample: '/users/by-skill/12',
      errorExample: 'Not Found',
    }),
    ApiHttpError({
      status: 400,
      description: 'Некорректный id',
      messageExample: 'Bad Request Exception',
      pathExample: '/users/by-skill/abc',
    }),
  );

export const UsersUpdateMeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Обновить профиль текущего пользователя' }),
    ApiBearerAuth(),
    ApiBody({ schema: updateMeBodySchema }),
    ApiOkResponse({
      description: 'Обновлённый пользователь',
      schema: userSchema,
    }),
    ApiHttpError({
      status: 401,
      description: 'Нет/невалидный access token',
      messageExample: 'Unauthorized',
      pathExample: '/users/me',
      errorExample: 'Unauthorized',
    }),
    ApiHttpError({
      status: 404,
      description: 'Пользователь не найден',
      messageExample: 'Пользователь с ID 1 не найден',
      pathExample: '/users/me',
      errorExample: 'Not Found',
    }),
    ApiHttpError({
      status: 400,
      description: 'Некорректное тело запроса',
      messageExample: 'Bad Request Exception',
      pathExample: '/users/me',
    }),
  );

export const UsersUpdatePasswordSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Сменить пароль текущего пользователя' }),
    ApiBearerAuth(),
    ApiBody({ schema: updatePasswordBodySchema }),
    ApiOkResponse({
      description: 'Пароль изменён',
      schema: passwordUpdatedSchema,
    }),
    ApiHttpError({
      status: 401,
      description: 'Нет/невалидный access token или неверный текущий пароль',
      messageExample: 'Неверный текущий пароль',
      pathExample: '/users/me/password',
      errorExample: 'Unauthorized',
    }),
    ApiHttpError({
      status: 400,
      description: 'Новый пароль совпадает со старым / невалидное тело',
      messageExample: 'Новый пароль должен отличаться от старого',
      pathExample: '/users/me/password',
    }),
    ApiHttpError({
      status: 404,
      description: 'Пользователь не найден',
      messageExample: 'Пользователь с ID 1 не найден',
      pathExample: '/users/me/password',
      errorExample: 'Not Found',
    }),
  );

export const UsersRemoveSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Удалить пользователя по ID (только Admin)' }),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: Number, example: 1 }),
    ApiOkResponse({ description: 'Пользователь удалён (тело пустое)' }),
    ApiHttpError({
      status: 401,
      description: 'Нет/невалидный access token',
      messageExample: 'Unauthorized',
      pathExample: '/users/1',
      errorExample: 'Unauthorized',
    }),
    ApiHttpError({
      status: 403,
      description: 'Недостаточно прав (нужна роль Admin)',
      messageExample: 'Forbidden',
      pathExample: '/users/1',
      errorExample: 'Forbidden',
    }),
    ApiHttpError({
      status: 400,
      description: 'Некорректный id пользователя',
      messageExample: 'Некорректный id пользователя',
      pathExample: '/users/abc',
    }),
    ApiHttpError({
      status: 404,
      description: 'Пользователь не найден',
      messageExample: 'Пользователь с id 1 не найден',
      pathExample: '/users/1',
      errorExample: 'Not Found',
    }),
  );
