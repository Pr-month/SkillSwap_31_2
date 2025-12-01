import { Role, UserGender } from '../users/users.enums';

export const usersData = [
  {
    name: 'Иван Петров',
    email: 'ivan@example.com',
    password: 'password123',
    about: 'Люблю программировать',
    birthday: new Date('1990-01-01'),
    city: 'Москва',
    gender: UserGender.male,
    avatar: 'avatar1.png',
    role: Role.User,
  },
  {
    name: 'Мария Иванова',
    email: 'maria@example.com',
    password: 'securepass',
    about: 'QA инженер',
    birthday: new Date('1995-05-10'),
    city: 'Санкт-Петербург',
    gender: UserGender.female,
    avatar: 'avatar2.png',
    role: Role.User,
  },
];
