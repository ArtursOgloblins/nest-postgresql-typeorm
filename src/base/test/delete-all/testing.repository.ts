import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../../features/users/domain/users.entity';
import { UsersConfirmation } from '../../../features/users/domain/users-confirmation.entity';
import { PasswordRecovery } from '../../../features/auth/domain/auth.password-recovery.entity';
import { RefreshToken } from '../../../features/auth/domain/auth.refresh-token.entity';
import { Blogs } from '../../../features/blogs/domain/blogs.entity';
import { Posts } from '../../../features/posts/domain/posts.entity';
import { Comments } from '../../../features/comments/domain/commnets.entity';
import { Likes } from '../../../features/likes/domain/likes.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectRepository(UsersConfirmation)
    private readonly usersConfirmationRepository: Repository<UsersConfirmation>,
    @InjectRepository(PasswordRecovery)
    private readonly authPasswordRecoveryRepository: Repository<PasswordRecovery>,
    @InjectRepository(RefreshToken)
    private readonly authRefreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
  ) {}

  async deleteAllData() {
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query('DELETE FROM users_confirmation');
      await queryRunner.query('DELETE FROM password_recovery');
      await queryRunner.query('DELETE FROM refresh_token');
      await queryRunner.query('DELETE FROM comments');
      await queryRunner.query('DELETE FROM likes');
      await queryRunner.query('DELETE FROM posts');
      await queryRunner.query('DELETE FROM blogs');
      await queryRunner.query('DELETE FROM users');

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
