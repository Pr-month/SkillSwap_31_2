import { Role } from 'src/users/role.enums';

export type TJwtPayload = {
  sub: string;
  role: Role;
};

export type TAuthResponse = Request & {
  user: TJwtPayload;
};
