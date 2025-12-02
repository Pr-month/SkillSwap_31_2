import { Socket } from 'socket.io';
import { TJwtPayload } from 'src/auth/type';

// Расширенный интерфейс для Socket
export interface ExtendedSocket extends Socket {
  data: {
    user?: TJwtPayload;
  };
}
