import { Role } from 'src/users/users.enums';

export type TJwtPayload = {
  sub: number;
  role: Role;
  [key: string]: any;
};

export type TAuthResponse = Request & {
  user: TJwtPayload;
};
