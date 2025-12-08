import { Role } from '../users/users.enums';
import { Socket } from 'socket.io';

export type TJwtPayload = {
  sub: number;
  role: Role;
  [key: string]: number | string;
};

export type TAuthResponse = Request & {
  user: TJwtPayload;
};

// Расширенный интерфейс для Socket
export interface ExtendedSocket extends Socket {
  data: {
    user?: TJwtPayload;
  };
}
