import { User } from '../users/entities/user.entity';
import { Role, UserGender } from '../users/users.enums';

export const adminData: Omit<User, 'id' | 'beforeInsert'> = {
    name: "Администратор",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    about: "Системный администратор",
    birthday: new Date('1990-01-01'),
    city: "Москва",
    gender: UserGender.male,
    avatar: "",
    skills: [],
    favoriteSkills: [],
    role: Role.Admin,
    refreshToken: ""
};