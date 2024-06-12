import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Likes } from '../domain/likes.entity';

@Injectable()
export class LikesQueryRepository {
  constructor(
    @InjectRepository(Likes)
    private readonly likesQueryRepository: Repository<Likes>,
  ) {}
  public async getLikeStatusByEntityAndUserId(
    entityId: number,
    userId: number,
  ) {
    try {
      const likeStatusData = await this.likesQueryRepository
        .createQueryBuilder('l')
        .where('l.entityId = :entityId', { entityId })
        .andWhere('l.userId = :userId', { userId })
        .getOne();
      if (!likeStatusData) {
        return null;
      }
      return likeStatusData;
    } catch (error) {
      console.log('Error in getLikeStatusByEntityAndUserId', error);
      throw error;
    }
  }
}
