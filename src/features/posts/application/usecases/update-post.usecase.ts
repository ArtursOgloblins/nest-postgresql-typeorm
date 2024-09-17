import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdatePostInputDataDto } from '../../api/dto/input/update-post-by-blog-id.dto';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';

export class UpdatePostCommand {
  constructor(
    public newPostData: UpdatePostInputDataDto,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { newPostData, user } = command;
    const userId = +user.userId;
    const blogId = newPostData.blogId;
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    if (userId !== blog.owner.id) {
      throw new ForbiddenException(`This is not your blog.`);
    }
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
