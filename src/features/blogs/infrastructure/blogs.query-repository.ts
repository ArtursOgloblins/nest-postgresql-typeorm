import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Blogs } from '../domain/blogs.entity';
import { BlogQueryParamsDTO } from '../api/dto/input/blogs-query-params.dto';
import { PaginatedBlogsResponseDTO } from '../api/dto/output/paginated-blogs-response.dto';
import { BlogResponseDTO } from '../api/dto/output/blogs-response.dto';
import { Posts } from '../../posts/domain/posts.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
  ) {}

  public async findBlogs(
    params: BlogQueryParamsDTO,
  ): Promise<PaginatedBlogsResponseDTO> | null {
    try {
      const sortBy = params.sortBy || 'createdAt';
      const sortDirection = params.sortDirection || 'desc';
      const pageNumber = params.pageNumber || 1;
      const pageSize = params.pageSize || 10;
      const searchNameTerm = params.searchNameTerm || '';
      const validSortColumns = {
        createdAt: 'createdAt',
        name: 'name',
      };

      const validSortDirections = ['asc', 'desc'];
      const skipAmount = (pageNumber - 1) * pageSize;

      const sortByColumn = validSortColumns[sortBy] || 'createdAt';
      const sortOrder = validSortDirections.includes(sortDirection)
        ? sortDirection
        : 'desc';

      const [blogs, totalCount] = await this.blogsRepository.findAndCount({
        where: [{ name: ILike(`%${searchNameTerm}%`) }],
        order: { [sortByColumn]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
        take: pageSize,
        skip: skipAmount,
      });

      const mappedBlogs = blogs.map((blog) => new BlogResponseDTO(blog));

      return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: totalCount,
        items: mappedBlogs,
      };
    } catch (error) {
      console.log('Error in findBlogs', error);
      if (Array.isArray(error.message)) {
        error.message.forEach((m: string) => console.log(m));
      } else {
        console.log(error.message);
      }
      return null;
    }
  }

  public async findById(blogId: number) {
    try {
      return this.blogsRepository
        .createQueryBuilder('b')
        .where('b.id = :blogId', { blogId })
        .getOne();
    } catch (error) {
      console.log('Error in findById', error);
      throw error;
    }
  }

  public async findPostByBlogId(blogId: number, postId: number) {
    try {
      const post = await this.blogsRepository
        .createQueryBuilder('b')
        .leftJoinAndSelect(Posts, 'p', 'b.id = p.blogId')
        .where('b.id = :blogId', { blogId })
        .andWhere('p.id = :postId', { postId })
        .getOne();

      if (!post) {
        return null;
      }
      return post;
    } catch (error) {
      console.log('Error in findPostByBlogId', error);
      throw error;
    }
  }
}
