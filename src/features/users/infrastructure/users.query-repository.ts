import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Users } from '../domain/users.entity';
import { PaginatedUserResponseDTO } from '../api/dto/output/paginated-users-response.dto';
import { UserQueryParamsDTO } from '../api/dto/input/users-queryParams.dto';
import { UserResponseDTO } from '../api/dto/output/user-response.dto';
import { PasswordRecovery } from '../../auth/domain/auth.password-recovery.entity';
import { RefreshToken } from '../../auth/domain/auth.refresh-token.entity';

@Injectable()
export class UsersQueryRepository {
  public constructor(
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
    @InjectRepository(PasswordRecovery)
    private readonly passwordRecoveryRepository: Repository<PasswordRecovery>,
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>,
  ) {}

  public async getAllUsers(
    params: UserQueryParamsDTO,
  ): Promise<PaginatedUserResponseDTO | null> {
    try {
      const {
        sortBy = 'createdAt',
        sortDirection = 'desc',
        pageNumber = 1,
        pageSize = 10,
        searchLoginTerm = '',
        searchEmailTerm = '',
      } = params;
      const validSortColumns = {
        createdAt: 'createdAt',
        login: 'Login',
      };

      const validSortDirections = ['asc', 'desc'];
      const skipAmount = (pageNumber - 1) * pageSize;

      const sortByColumn = validSortColumns[sortBy] || 'createdAt';
      const sortOrder = validSortDirections.includes(sortDirection)
        ? sortDirection
        : 'desc';

      const [users, totalCount] = await this.users.findAndCount({
        where: [
          { isDeleted: null, login: ILike(`%${searchLoginTerm}%`) },
          { isDeleted: null, email: ILike(`%${searchEmailTerm}%`) },
        ],
        order: { [sortByColumn]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
        take: pageSize,
        skip: skipAmount,
      });

      const sanitisedUsers = users.map((user) => new UserResponseDTO(user));

      return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: totalCount,
        items: sanitisedUsers,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async getUserByLogin(login: string): Promise<Users | null> {
    try {
      const user = await this.users.findOne({ where: { login } });
      return user || null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async getUserByEmail(email: string): Promise<Users | null> {
    try {
      return this.users
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.confirmation', 'umc')
        .where('u.email = :loginOrEmail', {
          email,
        })
        .select([
          'u.id',
          'u.password',
          'u.login',
          'u.email',
          'umc.isConfirmed',
          'umc.confirmationCode',
        ])
        .getOne();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async getUserById(userId: string): Promise<Users | null> {
    try {
      const user = await this.users.findOneBy({ id: userId, isDeleted: false });
      return user || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async findByLoginOrEmail(loginOrEmail: string) {
    try {
      return this.users
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.confirmation', 'umc')
        .where('u.login = :loginOrEmail OR u.email = :loginOrEmail', {
          loginOrEmail,
        })
        .select([
          'u.id',
          'u.password',
          'u.login',
          'u.email',
          'umc.isConfirmed',
          'umc.confirmationCode',
        ])
        .getOne();
    } catch (error) {
      console.log('Error in findByLoginOrEmail', error);
      throw error;
    }
  }

  public async validateCode(code: string) {
    try {
      return await this.users
        .createQueryBuilder('u')
        .innerJoinAndSelect('u.confirmation', 'umc')
        .where('u.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('umc.confirmationCode = :code', { code })
        .andWhere('umc.isConfirmed = :isConfirmed', { isConfirmed: false })
        .andWhere('umc.expirationDate > CURRENT_TIMESTAMP')
        .getOne();
    } catch (error) {
      console.log('Error in validateCode', error);
      throw error;
    }
  }

  public async getUserByConfirmationCode(conformationCode: string) {
    try {
      return this.users
        .createQueryBuilder('u')
        .innerJoinAndSelect('u.confirmation', 'umc')
        .where('u.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('umc.confirmationCode = :conformationCode', {
          conformationCode,
        })
        .getOne();
    } catch (error) {
      console.log('Error in getUserByConfirmationCode', error);
      throw error;
    }
  }

  public async getUserDataForPasswordRecovery(email: string) {
    try {
      return this.users
        .createQueryBuilder('u')
        .innerJoinAndSelect('u.passwordRecovery', 'pr')
        .where('u.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('u.email = :email', { email })
        .select(['u.id', 'pr.confirmationCode'])
        .getOne();
    } catch (error) {
      console.log('Error in getUserDataForPasswordRecovery', error);
      throw error;
    }
  }

  public async getPasswordRecoveryDetails(recoveryCode: string) {
    try {
      return this.passwordRecoveryRepository
        .createQueryBuilder('pr')
        .leftJoinAndSelect('pr.user', 'u')
        .select(['u.id', 'pr.expirationDate', 'pr.isValid'])
        .where('pr.confirmationCode = :recoveryCode', { recoveryCode })
        .getOne();
    } catch (error) {
      console.log('Error in getPasswordRecoveryDetails', error);
      throw error;
    }
  }

  public async validateRefreshToken(
    createdAt: Date,
    deviceId: string,
    userId: string,
  ) {
    try {
      return this.refreshToken
        .createQueryBuilder('rt')
        .select(['rt.userId'])
        .where('pr.userId = :userId', { userId })
        .andWhere('pr.deviceId = :deviceId', { deviceId })
        .andWhere('pr.createdAt = :createdAt', { createdAt })
        .getOne();
    } catch (error) {
      console.log('Error in getPasswordRecoveryDetails', error);
      throw error;
    }
  }
}
