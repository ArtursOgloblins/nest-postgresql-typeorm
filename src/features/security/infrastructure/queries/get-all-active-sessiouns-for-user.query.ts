import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecurityDevicesRepository } from '../security-device.repository';
import { ActiveSessionOutputDTO } from '../../application/api/dto/output/session-output.dto';

export class GetActiveSessionsByUser {
  constructor(public readonly req: any) {}
}

@QueryHandler(GetActiveSessionsByUser)
export class GetActiveSessionsByUserQuery
  implements IQueryHandler<GetActiveSessionsByUser>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    query: GetActiveSessionsByUser,
  ): Promise<ActiveSessionOutputDTO[]> {
    const { req } = query;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const decodedRefreshToken = await this.jwtService.decode(refreshToken);

    const { userId } = decodedRefreshToken;

    const activeSessions =
      await this.securityDevicesRepository.getActiveSessions(userId);

    if (!activeSessions) {
      throw new NotFoundException(`No active sessions`);
    }

    return activeSessions.map((session) => new ActiveSessionOutputDTO(session));
  }
}
