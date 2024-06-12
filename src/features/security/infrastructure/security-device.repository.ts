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
    expiringAt: number,
    deviceId: string,
  ) {
    try {
      return this.refreshToken
        .createQueryBuilder('rt')
        .where('rt.userId = :userId', { userId })
        .andWhere('rt.expiringAt = :expiringAt', { expiringAt })
        .andWhere('rt.deviceId = :deviceId', { deviceId })
        .getMany();
    } catch (error) {
      console.log('Error in getUserByConfirmationCode', error);
      throw error;
    }
  }

  public async terminateNonCurrentSessions(
    userId: string,
    expiringAt: number,
    deviceId: string,
  ) {
    try {
      return this.refreshToken
        .createQueryBuilder()
        .delete()
        .from('refresh_token')
        .where('userId = :userId', { userId })
        .andWhere('expiringAt != :expiringAt', { expiringAt })
        .andWhere('deviceId != :deviceId', { deviceId })
        .execute();
    } catch (error) {
      console.log('Error in terminateNonCurrentSessions', error);
      throw error;
    }
  }

  public async getSessionById(deviceId: string) {
    try {
      const sessionData = await this.refreshToken
        .createQueryBuilder('refreshToken')
        .innerJoinAndSelect('refreshToken.user', 'user')
        .where('refreshToken.deviceId = :deviceId', { deviceId })
        .select(['user.id', 'refreshToken.deviceId'])
        .getMany();
      if (sessionData.length == 0) {
        return null;
      }
      return sessionData;
    } catch (error) {
      console.log('Error in getUserByConfirmationCode', error);
      throw error;
    }
  }

  public async terminateSessionById(deviceId: string) {
    try {
      return this.refreshToken
        .createQueryBuilder()
        .delete()
        .from('refresh_token')
        .where('deviceId = :deviceId', { deviceId })
        .execute();
    } catch (error) {
      console.log('Error in terminateNonCurrentSessions', error);
      throw error;
    }
  }
}
