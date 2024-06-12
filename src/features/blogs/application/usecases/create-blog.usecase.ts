import { NewBlogDto } from '../../api/dto/input/new-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogResponseDTO } from '../../api/dto/output/blogs-response.dto';
import { NewBlogInputDataDto } from '../../api/dto/input/new-blog-params.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';

export class CreateBlogCommand {
  constructor(public inputData: NewBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogResponseDTO> {
    const isMembership = false;

    const newBlogModel: NewBlogInputDataDto = {
      ...command.inputData,
      isMembership,
    };

    const res = await this.blogsRepository.registerBlog(newBlogModel);
    const newBlog = await this.blogsQueryRepository.findById(res.id);

    return new BlogResponseDTO(newBlog);
  }
}
