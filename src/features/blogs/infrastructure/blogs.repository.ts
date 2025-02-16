import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewBlogInputDataDto } from '../api/dto/input/new-blog-params.dto';
import { Blogs } from '../domain/blogs.entity';
import { NewBlogDto } from '../api/dto/input/new-blog.dto';
import { Users } from '../../users/domain/users.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
  ) {}

  public async registerBlog(inputData: NewBlogInputDataDto, user: Users) {
    try {
      const { name, description, websiteUrl, isMembership } = inputData;
      const result = await this.blogsRepository
        .createQueryBuilder()
        .insert()
        .into(Blogs)
        .values([
          {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            isMembership: isMembership,
            owner: user,
          },
        ])
        .execute();

      return result.raw[0] as Blogs;
    } catch (error) {
      console.log('Error in registerBlog', error);
      throw error;
    }
  }

  async updateBlog(blogId: number, newBlogData: NewBlogDto): Promise<void> {
    await this.blogsRepository
      .createQueryBuilder()
      .update(Blogs)
      .set({
        name: newBlogData.name,
        description: newBlogData.description,
        websiteUrl: newBlogData.websiteUrl,
      })
      .where('id = :blogId', { blogId })
      .execute();
  }

  public async deleteBlogById(blogId: number) {
    try {
      return this.blogsRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :blogId', { blogId })
        .execute();
    } catch (error) {
      console.log('Error in deleteBlogById', error);
      throw error;
    }
  }

  public async bindUserToBlog(blogId: number, userId: number): Promise<void> {
    try {
      await this.blogsRepository
        .createQueryBuilder()
        .update(Blogs)
        .set({ owner: { id: userId } })
        .where('id = blogId', { blogId })
        .execute();
    } catch (error) {
      console.log('Error in bindUserToBlog', error);
      throw error;
    }
  }
}
