import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdatePostInputDataDto } from '../../api/dto/input/update-post-by-blog-id.dto';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostCommand {
  constructor(public newPostData: UpdatePostInputDataDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { newPostData } = command;
    const post = await this.blogsQueryRepository.findPostByBlogId(
      newPostData.blogId,
      newPostData.postId,
    );
    if (!post) {
      throw new NotFoundException(`Post not found for this blog`);
    }

    await this.postsRepository.updatePostByBlogId(newPostData);
  }
}
