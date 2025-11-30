import { ForbiddenException } from "@nestjs/common";
import { Request as RequestEntity } from "../requests/entities/request.entity";
import { Role } from "../users/users.enums";
import { RequestStatus } from "../requests/requests.enums";

export function checkRequestPermissions(
    request: RequestEntity,
    userId: number,
    userRole: Role,
    action: 'update' | 'delete' = 'update'
): void {
    if (userRole === Role.Admin) {
        return;
    }

    if (!request.sender) {
        throw new ForbiddenException('Не удалось проверить права доступа к заявке');
    }

    if (request.sender.id !== userId) {
        throw new ForbiddenException(`Вы можете ${action === 'update' ? 'обновлять' : 'удалять'} только свои заявки`);
    }

    if (action === 'update' && request.status !== RequestStatus.pending) {
        throw new ForbiddenException('Вы можете обновлять только заявки со статусом "входящие"');
    }


}