import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { LikesRepository } from './infrastructure/likes.repository';
import { LikesQueryRepository } from './infrastructure/likes.query-repository';
import { AddLikeStatusUseCase } from './application/usecases/add-update-like-status.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from './domain/likes.entity';
import { Comments } from '../comments/domain/commnets.entity';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([Likes, Comments]),
  ],
  controllers: [],
  providers: [LikesRepository, LikesQueryRepository, AddLikeStatusUseCase],
  exports: [LikesRepository, LikesQueryRepository, TypeOrmModule],
})
export class LikesModule {}
