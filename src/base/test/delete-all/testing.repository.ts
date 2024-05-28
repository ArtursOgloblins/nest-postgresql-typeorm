import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../../features/users/domain/users.entity';
import { UsersConfirmation } from '../../../features/users/domain/users-confirmation.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectRepository(UsersConfirmation)
    private readonly usersConfirmationRepository: Repository<UsersConfirmation>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    // @InjectRepository(Blogs)
    // private readonly blogsRepository: Repository<Blogs>,
    // @InjectRepository(Posts)
    // private readonly postsRepository: Repository<Posts>,
    // @InjectRepository(Comments)
    // private readonly commentsRepository: Repository<Comments>,
    // @InjectRepository(Likes)
    // private readonly likesRepository: Repository<Likes>,
    // @InjectRepository(UsersEmailConfirmation)
    // private readonly authRefreshTokenRepository: Repository<AuthRefreshToken>,
    // @InjectRepository(AuthPasswordRecovery)
    // private readonly authPasswordRecoveryRepository: Repository<AuthPasswordRecovery>,
  ) {}

  async deleteAllData() {
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query('DELETE FROM users_confirmation');
      await queryRunner.query('DELETE FROM users');
      // await queryRunner.query('DELETE FROM blogs');
      // await queryRunner.query('DELETE FROM posts');
      // await queryRunner.query('DELETE FROM comments');
      // await queryRunner.query('DELETE FROM likes');
      // await queryRunner.query('DELETE FROM auth_refresh_token');
      // await queryRunner.query('DELETE FROM auth_password_recovery');

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
