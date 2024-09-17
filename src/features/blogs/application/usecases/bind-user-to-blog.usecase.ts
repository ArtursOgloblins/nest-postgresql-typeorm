import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';

export class BindUserToBlogCommand {
  constructor(
    public readonly blogId: number,
    public readonly userId: number,
  ) {}
}

@CommandHandler(BindUserToBlogCommand)
export class BindUserToBlogUseCase
  implements ICommandHandler<BindUserToBlogCommand>
{
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: BindUserToBlogCommand) {
    const { blogId, userId } = command;
    const user = await this.usersQueryRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return await this.blogsRepository.bindUserToBlog(blogId, userId);
  }
}
