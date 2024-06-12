import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DeviceIdInputDto } from '../api/dto/input/deviceId-input.dto';
import { SecurityDevicesRepository } from '../../infrastructure/security-device.repository';

export class TerminateSpecifiedSessionCommand {
  constructor(
    public readonly req: Request,
    public readonly res: Response,
    public readonly deviceIdToDelete: DeviceIdInputDto,
  ) {}
}

@CommandHandler(TerminateSpecifiedSessionCommand)
export class TerminateSpecifiedSessionUseCase
  implements ICommandHandler<TerminateSpecifiedSessionCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private jwtService: JwtService,
  ) {}

  async execute(command: TerminateSpecifiedSessionCommand) {
    const { req, res, deviceIdToDelete } = command;
    const refreshToken = req.cookies.refreshToken;
    const deviceToDelete = deviceIdToDelete.deviceId;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const decodedRefreshToken = await this.jwtService.decode(refreshToken);
    const { userId } = decodedRefreshToken;

    const sessionToDelete =
      await this.securityDevicesRepository.getSessionById(deviceToDelete);

    if (!sessionToDelete) {
      throw new NotFoundException(`Session not found`);
    }

    if (sessionToDelete[0].user.id !== userId) {
      throw new ForbiddenException();
    }

    const removeSessionById =
      await this.securityDevicesRepository.terminateSessionById(deviceToDelete);

    if (!removeSessionById) {
      throw new UnauthorizedException();
    }

    return res.json({ message: 'Session terminated.' });
  }
}
