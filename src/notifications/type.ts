import { Socket } from "socket.io";
import { JwtPayload } from "jsonwebtoken";

export interface SocketWithUser extends Socket {
  data: {
    user: JwtPayload;
  };
}