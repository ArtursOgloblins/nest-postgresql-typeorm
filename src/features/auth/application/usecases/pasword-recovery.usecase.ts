import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { EmailService } from '../../../../base/email/email.service';
import { NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';

export class UserPasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(UserPasswordRecoveryCommand)
export class UserPasswordRecoveryUseCase
  implements ICommandHandler<UserPasswordRecoveryCommand>
{
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: UserPasswordRecoveryCommand) {
    const { email } = command;

    const user =
      await this.usersQueryRepository.getUserDataForPasswordRecovery(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordRecoveryInputData = {
      userId: user.id,
      confirmationCode: randomUUID(),
      expirationDate: new Date(),
    };

    if (!user.passwordRecovery.confirmationCode) {
      await this.usersRepository.registerPasswordRecovery(
        passwordRecoveryInputData,
      );
    } else {
      await this.usersRepository.updatePasswordRecovery(
        passwordRecoveryInputData,
      );
    }

    await this.emailService.sendPasswordRecoveryCode(
      passwordRecoveryInputData.confirmationCode,
      email,
    );
  }
}
