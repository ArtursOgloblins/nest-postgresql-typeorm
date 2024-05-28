import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';

@Injectable()
export class AuthService {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async validateUser(loginOrEmail: string, pass: string): Promise<any> {
    const user =
      await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const { id, password, confirmation, login, email } = user;

    if (id && (await bcrypt.compare(pass, password))) {
      if (confirmation.isConfirmed) {
        return { id, login, email };
      }
    }
    return null;
  }
}
