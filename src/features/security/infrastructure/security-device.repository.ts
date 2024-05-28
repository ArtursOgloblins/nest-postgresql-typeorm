import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../auth/domain/auth.refresh-token.entity';

@Injectable()
export class SecurityDevicesRepository {
  public constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>,
  ) {}

  public async getActiveSessions(userId: string) {
    try {
      return this.refreshToken
        .createQueryBuilder('rt')
        .where('rt.userId = :userId', { userId })
        .getMany();
    } catch (error) {
      console.log('Error in getActiveSessions', error);
      throw error;
    }
  }

  public async getCurrentSession(
    userId: string,
    createdAt: Date,
    deviceId: string,
  ) {
    try {
      return this.refreshToken
        .createQueryBuilder('rt')
        .where('rt.userId = :userId', { userId })
        .andWhere('rt.createdAt = :createdAt', { createdAt })
        .andWhere('rt.deviceId = :deviceId', { deviceId })
        .getMany();
    } catch (error) {
      console.log('Error in getUserByConfirmationCode', error);
      throw error;
    }
  }

  public async terminateNonCurrentSessions(
    userId: string,
    createdAt: Date,
    deviceId: string,
  ) {
    try {
      return this.refreshToken
        .createQueryBuilder('rt')
        .delete()
        .from('refreshToken')
        .andWhere('rt.userId = :userId', { userId })
        .andWhere('rt.createdAt = :createdAt', { createdAt })
        .andWhere('rt.deviceId = :deviceId', { deviceId })
        .execute();
    } catch (error) {
      console.log('Error in terminateNonCurrentSessions', error);
      throw error;
    }
  }

  public async getSessionById(deviceId: string) {
    try {
      return this.refreshToken
        .createQueryBuilder('rt')
        .where('rt.deviceId = :deviceId', { deviceId })
        .getOne();
    } catch (error) {
      console.log('Error in getUserByConfirmationCode', error);
      throw error;
    }
  }

  public async terminateSessionById(deviceId: string) {
    try {
      return this.refreshToken
        .createQueryBuilder('rt')
        .delete()
        .from('refreshToken')
        .andWhere('rt.deviceId = :deviceId', { deviceId })
        .execute();
    } catch (error) {
      console.log('Error in terminateNonCurrentSessions', error);
      throw error;
    }
  }
}
