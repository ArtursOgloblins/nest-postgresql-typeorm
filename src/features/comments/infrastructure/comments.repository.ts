import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Comments } from '../domain/commnets.entity';
import { NewCommentInputDataDto } from '../api/dto/input/new-comment-input-data.dto';
import { Users } from '../../users/domain/users.entity';
import { Posts } from '../../posts/domain/posts.entity';
import { NewCommentDataDto } from '../api/dto/input/new-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  public async addComment(inputData: NewCommentInputDataDto) {
    try {
      const { userId, postId, content } = inputData;
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      const result = await this.commentsRepository
        .createQueryBuilder()
        .insert()
        .into('comments')
        .values([
          {
            user: user,
            post: post,
            userLogin: user.login,
            content: content,
          },
        ])
        .execute();
      return result.raw[0] as Comments;
    } catch (error) {
      console.log('Error in addComment', error);
      throw error;
    }
  }

  public async updateComment(
    commentId: number,
    contentData: NewCommentDataDto,
  ) {
    try {
      await this.commentsRepository
        .createQueryBuilder()
        .update(Comments)
        .set({ content: contentData.content })
        .where('id = :commentId', { commentId })
        .execute();
    } catch (error) {
      console.log('Error in updateComment', error);
      throw error;
    }
  }

  public async deleteCommentById(commentId: number): Promise<UpdateResult> {
    try {
      return await this.commentsRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :commentId', { commentId })
        .execute();
    } catch (error) {
      console.log('Error in deleteCommentById', error);
      throw error;
    }
  }
}
