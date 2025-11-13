export type TJwtPayload = {
    _id: string;
    role: 'user' | 'admin'; // нужно импортировать роль
}