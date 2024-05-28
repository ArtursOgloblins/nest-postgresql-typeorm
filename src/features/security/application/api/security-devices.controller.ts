import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { ActiveSessionOutputDTO } from './dto/output/session-output.dto';
import { GetActiveSessionsByUser } from '../../infrastructure/queries/get-all-active-sessiouns-for-user.query';
import { TerminateNonCurrentSessionsCommand } from '../usecases/terminate-non-current-sessions.usecase';
import { DeviceIdInputDto } from './dto/input/deviceId-input.dto';
import { TerminateSpecifiedSessionCommand } from '../usecases/terminate-specified-session.usecase';

@Controller('security')
export class SecurityDevicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('devices')
  @HttpCode(HttpStatus.OK)
  async getActiveSessionsByUser(
    @Req() req: Request,
  ): Promise<ActiveSessionOutputDTO[]> {
    return await this.queryBus.execute(new GetActiveSessionsByUser(req));
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateNonCurrentSessions(@Req() req: Request, @Res() res: Response) {
    return await this.commandBus.execute(
      new TerminateNonCurrentSessionsCommand(req, res),
    );
  }

  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateSpecifiedSessions(
    @Req() req: Request,
    @Res() res: Response,
    @Param() deviceId: DeviceIdInputDto,
  ) {
    return await this.commandBus.execute(
      new TerminateSpecifiedSessionCommand(req, res, deviceId),
    );
  }
}
