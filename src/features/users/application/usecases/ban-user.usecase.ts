import { BanUserDto } from '../../api/dto/input/ban-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { NotFoundException } from '@nestjs/common';

export class BanUserCommand {
  constructor(
    public userId: number,
    public banUserData: BanUserDto,
  ) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: BanUserCommand) {
    const { userId, banUserData } = command;
    const user = await this.usersQueryRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (banUserData.isBanned === true) {
      await this.usersRepository.banUser(user, banUserData);
    } else {
      const activeBan = user.bans.find((ban) => ban.isActiveBan);
      if (activeBan) {
        await this.usersRepository.unBanUser(activeBan);
      }
    }
  }
}
