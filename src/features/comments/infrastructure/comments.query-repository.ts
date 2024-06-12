import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../domain/commnets.entity';
import { EntityType, Likes } from '../../likes/domain/likes.entity';
import { LikeStatuses } from '../../likes/api/dto/like-status.enum';
import { CommentsQueryParamsDto } from '../api/dto/input/comments-query-params.dto';
import { CommentsResponseDTO } from '../api/dto/output/comment-response.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
  ) {}

  async getCommentsByPostId(
    postId: number,
    params: CommentsQueryParamsDto,
    userId: number,
  ) {
    try {
      const sortBy = params.sortBy || 'createdAt';
      const sortDirection = params.sortDirection || 'desc';
      const pageNumber = params.pageNumber || 1;
      const pageSize = params.pageSize || 10;
      const validSortColumns = {
        createdAt: 'createdAt',
      };

      const validSortDirections = ['asc', 'desc'];
      const skipAmount = (pageNumber - 1) * pageSize;

      const sortByColumn = validSortColumns[sortBy] || 'createdAt';
      const sortOrder = validSortDirections.includes(sortDirection)
        ? sortDirection
        : 'desc';

      const queryBuilder = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoin(
          'likes',
          'like',
          'like.entityType = :entityType AND like.entityId = comment.id',
          { entityType: EntityType.COMMENT },
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :likeStatus THEN 1 ELSE 0 END)',
          'likesCount',
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikesCount',
        )
        .where('comment.postId = :postId', { postId })
        .setParameters({
          likeStatus: LikeStatuses.Like,
          dislikeStatus: LikeStatuses.Dislike,
        })
        .groupBy('comment.id, user.id')
        .orderBy(
          `comment.${sortByColumn}`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        )
        .take(pageSize)
        .skip(skipAmount);

      const [comments, totalCount] = await queryBuilder.getManyAndCount();
      const rawResults = await queryBuilder.getRawMany();

      const commentsData = await Promise.all(
        comments.map(async (comment, index) => {
          const raw = rawResults[index];
          const myLikeStatus = await this.likesRepository.findOne({
            where: {
              entityType: EntityType.COMMENT,
              entityId: comment.id,
              user: { id: userId },
            },
          });

          return new CommentsResponseDTO(
            comment,
            parseInt(raw.likesCount, 10) || 0,
            parseInt(raw.dislikesCount, 10) || 0,
            myLikeStatus ? myLikeStatus.status : LikeStatuses.None,
          );
        }),
      );

      return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: totalCount,
        items: commentsData,
      };
    } catch (error) {
      console.log('Error in getCommentsByPostId', error);
      throw error;
    }
  }

  public async findComment(commentId: number) {
    try {
      const comment = await this.commentsRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.user', 'user')
        .where('c.id = :commentId', { commentId })
        .getOne();
      if (!comment) {
        return null;
      }
      return comment;
    } catch (error) {
      console.log('Error in findComment', error);
      throw error;
    }
  }

  public async getCommentById(commentId: number, userId: number) {
    try {
      const queryBuilder = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoin(
          'likes',
          'like',
          'like.entityType = :entityType AND like.entityId = comment.id',
          { entityType: EntityType.COMMENT },
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :likeStatus THEN 1 ELSE 0 END)',
          'likesCount',
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikesCount',
        )
        .where('comment.id = :commentId', { commentId })
        .setParameters({
          likeStatus: LikeStatuses.Like,
          dislikeStatus: LikeStatuses.Dislike,
        })
        .groupBy('comment.id, user.id');

      const result = await queryBuilder.getRawAndEntities();
      const comment = result.entities[0];
      const raw = result.raw[0];

      if (!comment) {
        return null;
      }

      const myLikeStatus = await this.likesRepository.findOne({
        where: {
          entityType: EntityType.COMMENT,
          entityId: commentId,
          user: { id: userId },
        },
      });

      return {
        commentData: comment,
        likesCount: parseInt(raw.likesCount, 10) || 0,
        dislikesCount: parseInt(raw.dislikesCount, 10) || 0,
        myLikeStatus: myLikeStatus ? myLikeStatus.status : LikeStatuses.None,
      };
    } catch (error) {
      console.log('Error in getCommentById', error);
      throw error;
    }
  }
}
