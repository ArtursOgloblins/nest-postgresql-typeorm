import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';

@Injectable()
export class AuthService {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async validateUser(loginOrEmail: string, pass: string): Promise<any> {
    console.log('validateUser called with:', loginOrEmail);
    const user =
      await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }

    const { id, password, confirmation, login, email, bans } = user;
    const isPasswordValid = await bcrypt.compare(pass, password);

    const activeBan = bans?.find((ban) => ban.isActiveBan);
    if (activeBan) {
      console.log('User is banned for reason:', activeBan.banReason);
      throw new UnauthorizedException('User is banned');
    }

    if (id && isPasswordValid) {
      if (confirmation.isConfirmed) {
        return { id, login, email };
      }
    }
    return null;
  }
}
