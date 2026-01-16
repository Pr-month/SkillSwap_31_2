import { Categories } from './seed-categories.data';
import { usersData } from './seed-users.data';

export const skillsData = [
  {
    title: 'Управление творческими проектами',
    description:
      'Планирование и управление проектами в сфере искусства и творчества',
    images: ['', ''],
    owner: usersData[0].email,
    categoryName: Categories[0].name,
    subcategoryName: Categories[0].children[0],
  },
  {
    title: 'Разработка на React',
    description:
      'Современная разработка на React с использованием TypeScript, Hooks и Redux',
    images: ['', ''],
    owner: usersData[0].email,
    categoryName: Categories[1].name,
    subcategoryName: Categories[1].children[0],
  },
  {
    title: 'Графический дизайн',
    description:
      'Создание логотипов, брендбуков и полиграфии в Adobe Illustrator',
    images: ['', ''],
    owner: usersData[0].email,
    categoryName: Categories[2].name,
    subcategoryName: Categories[2].children[0],
  },
  {
    title: 'Личная финансовая грамотность',
    description: 'Управление личными финансами, бюджетом и накоплениями',
    images: ['', ''],
    owner: usersData[0].email,
    categoryName: Categories[3].name,
    subcategoryName: Categories[3].children[0],
  },
  {
    title: 'Таргетированная реклама',
    description: 'Настройка и ведение рекламных кампаний в социальных сетях',
    images: ['', ''],
    owner: usersData[1].email,
    categoryName: Categories[4].name,
    subcategoryName: Categories[4].children[0],
  },
  {
    title: 'Методика преподавания',
    description: 'Современные методы и подходы в обучении',
    images: ['', ''],
    owner: usersData[1].email,
    categoryName: Categories[5].name,
    subcategoryName: Categories[5].children[0],
  },
  {
    title: 'Английский для IT-специалистов',
    description: 'Технический английский для программистов и разработчиков',
    images: ['', ''],
    owner: usersData[1].email,
    categoryName: Categories[6].name,
    subcategoryName: Categories[6].children[0],
  },
  {
    title: 'Игра на гитаре',
    description: 'Обучение игре на акустической и электрогитаре с нуля',
    images: ['guitar1.png', 'guitar2.png'],
    owner: usersData[1].email,
    categoryName: Categories[7].name,
    subcategoryName: Categories[7].children[0],
  },
];
