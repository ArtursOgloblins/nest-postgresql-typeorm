import { Injectable } from '@nestjs/common';
import { NewPostInputDataDto } from '../api/dto/input/new-post-input-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blogs } from '../../blogs/domain/blogs.entity';
import { Posts } from '../domain/posts.entity';
import { UpdatePostInputDataDto } from '../api/dto/input/update-post-by-blog-id.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  public async registerPost(inputData: NewPostInputDataDto) {
    try {
      const { title, shortDescription, content, blogId } = inputData;
      const blog = await this.blogsRepository.findOne({
        where: { id: blogId },
      });
      const result = await this.postsRepository
        .createQueryBuilder()
        .insert()
        .into('posts')
        .values([
          {
            blog: blog,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogName: blog.name,
          },
        ])
        .execute();
      return result.raw[0] as Posts;
    } catch (error) {
      console.log('Error in registerPost', error);
      throw error;
    }
  }

  public async updatePostByBlogId(newPostData: UpdatePostInputDataDto) {
    try {
      const { postId, title, shortDescription, content } = newPostData;
      await this.postsRepository
        .createQueryBuilder()
        .update(Posts)
        .set({
          title: title,
          shortDescription: shortDescription,
          content: content,
        })
        .where('id = :postId', { postId })
        .execute();
    } catch (error) {
      console.log('Error in updatePostByBlogId', error);
      throw error;
    }
  }

  async deletePostById(postId: number) {
    try {
      return await this.postsRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :postId', { postId })
        .execute();
    } catch (error) {
      console.log('Error in deletePostById', error);
      throw error;
    }
  }

  // async updatePostLikes(
  //   entityId: string,
  //   likesCount: number,
  //   dislikesCount: number,
  //   newestLikes: NewestLikes[],
  // ) {
  //   const dataToUpdate = {
  //     'extendedLikesInfo.likesCount': likesCount,
  //     'extendedLikesInfo.dislikesCount': dislikesCount,
  //     'extendedLikesInfo.newestLikes': newestLikes,
  //   };
  //
  //   return this.postModel.findOneAndUpdate(
  //     { _id: entityId },
  //     { $set: dataToUpdate },
  //     { new: true },
  //   );
  // }
}
