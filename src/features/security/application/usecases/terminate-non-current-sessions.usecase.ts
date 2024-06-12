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
    const { exp, deviceId, userId } = decodedRefreshToken;
    const expiringAt = exp;

    const currentSession =
      await this.securityDevicesRepository.getCurrentSession(
        userId,
        expiringAt,
        deviceId,
      );

    if (!currentSession) {
      throw new UnauthorizedException();
    }

    const removedNonCurrentSessions =
      await this.securityDevicesRepository.terminateNonCurrentSessions(
        userId,
        expiringAt,
        deviceId,
      );

    if (!removedNonCurrentSessions) {
      throw new UnauthorizedException();
    }

    return res.json({ message: 'Sessions terminated.' });
  }
}
