import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SecurityDevicesRepository } from '../../infrastructure/security-device.repository';

export class TerminateNonCurrentSessionsCommand {
  constructor(
    public readonly req: Request,
    public readonly res: Response,
  ) {}
}

@CommandHandler(TerminateNonCurrentSessionsCommand)
export class TerminateNonCurrentSessionsUseCase
  implements ICommandHandler<TerminateNonCurrentSessionsCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private jwtService: JwtService,
  ) {}

  async execute(command: TerminateNonCurrentSessionsCommand) {
    const { req, res } = command;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const decodedRefreshToken = await this.jwtService.decode(refreshToken);
    const { iat, deviceId, userId } = decodedRefreshToken;
    const createdAt = new Date(iat * 1000);

    const currentSession =
      await this.securityDevicesRepository.getCurrentSession(
        userId,
        createdAt,
        deviceId,
      );

    if (!currentSession) {
      throw new UnauthorizedException();
    }

    const removedNonCurrentSessions =
      await this.securityDevicesRepository.terminateNonCurrentSessions(
        userId,
        createdAt,
        deviceId,
      );

    if (!removedNonCurrentSessions) {
      throw new UnauthorizedException();
    }

    return res.json({ message: 'Sessions terminated.' });
  }
}
