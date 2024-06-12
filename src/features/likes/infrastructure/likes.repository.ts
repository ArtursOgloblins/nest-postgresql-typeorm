import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from '../domain/likes.entity';
import { Repository } from 'typeorm';
import { NewLikeInputDataDto } from '../api/dto/input/new-likestatus-input-params.dto';
import { Users } from '../../users/domain/users.entity';
import { LikeStatuses } from '../api/dto/like-status.enum';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  public async addLikeStatus(inputData: NewLikeInputDataDto) {
    try {
      const { entityId, userId, likeStatus, entityType } = inputData;
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      const result = await this.likesRepository
        .createQueryBuilder()
        .insert()
        .into('likes')
        .values({
          user: user,
          entityId: entityId,
          status: likeStatus,
          entityType: entityType,
        })
        .execute();

      return result.raw[0] as Likes;
    } catch (error) {
      console.log('Error in addLikeStatus', error);
      throw error;
    }
  }

  public async updateLikeStatus(entityId: number, likeStatus: LikeStatuses) {
    try {
      await this.likesRepository
        .createQueryBuilder()
        .update(Likes)
        .set({
          status: likeStatus,
        })
        .where('id = :entityId', { entityId })
        .execute();
    } catch (error) {
      console.log('Error in updateLikeStatus', error);
      throw error;
    }
  }
}
