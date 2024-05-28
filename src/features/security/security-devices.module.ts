import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { SecurityDevicesController } from './application/api/security-devices.controller';
import { SecurityDevicesRepository } from './infrastructure/security-device.repository';
import { GetActiveSessionsByUserQuery } from './infrastructure/queries/get-all-active-sessiouns-for-user.query';
import { TerminateNonCurrentSessionsUseCase } from './application/usecases/terminate-non-current-sessions.usecase';
import { TerminateSpecifiedSessionUseCase } from './application/usecases/terminate-specified-session.usecase';
@Module({
  imports: [CqrsModule],
  controllers: [SecurityDevicesController],
  providers: [
    JwtService,
    SecurityDevicesRepository,
    GetActiveSessionsByUserQuery,
    TerminateNonCurrentSessionsUseCase,
    TerminateSpecifiedSessionUseCase,
  ],
  exports: [SecurityDevicesRepository],
})
export class SecurityDevicesModule {}
