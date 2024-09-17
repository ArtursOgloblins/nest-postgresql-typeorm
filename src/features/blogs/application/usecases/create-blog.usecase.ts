import { NewBlogDto } from '../../api/dto/input/new-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogResponseDTO } from '../../api/dto/output/blogs-response.dto';
import { NewBlogInputDataDto } from '../../api/dto/input/new-blog-params.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';

export class CreateBlogCommand {
  constructor(
    public inputData: NewBlogDto,
    public user: AccessTokenPayloadDTO,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogResponseDTO> {
    const { inputData, user } = command;
    const isMembership = false;
    const userEntity = await this.usersQueryRepository.getUserById(
      +user.userId,
    );

    const newBlogModel: NewBlogInputDataDto = {
      ...inputData,
      isMembership,
    };

    const res = await this.blogsRepository.registerBlog(
      newBlogModel,
      userEntity,
    );
    const newBlog = await this.blogsQueryRepository.findById(res.id);

    return new BlogResponseDTO(newBlog);
  }
}
