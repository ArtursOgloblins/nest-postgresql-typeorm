import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blogs } from '../../blogs/domain/blogs.entity';
import { Posts } from '../domain/posts.entity';
import { PostsResponseDTO } from '../api/dto/output/posts-response.dto';
import { PostsQueryParamsDTO } from '../api/dto/input/posts-query-params.dto';
import { Repository } from 'typeorm';
import { EntityType, Likes } from '../../likes/domain/likes.entity';
import { LikeStatuses } from '../../likes/api/dto/like-status.enum';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
  ) {}

  private getQueryParams(params: PostsQueryParamsDTO) {
    const sortBy = params.sortBy || 'createdAt';
    const sortDirection = params.sortDirection || 'desc';
    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || 10;

    const validSortColumns = {
      createdAt: 'createdAt',
      blogName: 'blogName',
    };

    const validSortDirections = ['asc', 'desc'];
    const skipAmount = (pageNumber - 1) * pageSize;

    const sortByColumn = validSortColumns[sortBy] || 'createdAt';
    const sortOrder = validSortDirections.includes(sortDirection)
      ? sortDirection
      : 'desc';

    return { sortByColumn, sortOrder, pageNumber, pageSize, skipAmount };
  }

  async getPostsByBlogId(
    blogId: number,
    params: PostsQueryParamsDTO,
    userId: number,
  ) {
    try {
      const { sortByColumn, sortOrder, pageNumber, pageSize, skipAmount } =
        this.getQueryParams(params);

      const queryBuilder = this.postsRepository
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.blog', 'blog')
        .leftJoinAndSelect('posts.user', 'user')
        .leftJoin(
          'likes',
          'like',
          'like.entityType = :entityType AND like.entityId = posts.id',
          { entityType: EntityType.POST },
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :likeStatus THEN 1 ELSE 0 END)',
          'likesCount',
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikesCount',
        )
        .where('posts.blogId = :blogId', { blogId })
        .setParameters({
          likeStatus: LikeStatuses.Like,
          dislikeStatus: LikeStatuses.Dislike,
        })
        .groupBy('posts.id, blog.id, user.id')
        .orderBy(
          `posts.${sortByColumn}`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        )
        .take(pageSize)
        .skip(skipAmount);

      const [posts, totalCount] = await queryBuilder.getManyAndCount();
      const rawResults = await queryBuilder.getRawMany();

      const postsData = await Promise.all(
        posts.map(async (post, index) => {
          const raw = rawResults[index];
          const myLikeStatus = await this.likesRepository.findOne({
            where: {
              entityType: EntityType.POST,
              entityId: post.id,
              user: { id: userId },
            },
          });

          const newestLikesQuery = await this.likesRepository
            .createQueryBuilder('like')
            .leftJoinAndSelect('like.user', 'user')
            .where('like.entityType = :entityType', {
              entityType: EntityType.POST,
            })
            .andWhere('like.entityId = :entityId', { entityId: post.id })
            .andWhere('status = :status', { status: LikeStatuses.Like })
            .orderBy('like.createdAt', 'DESC')
            .limit(3)
            .getMany();

          const newestLikes = newestLikesQuery.map((like) => ({
            addedAt: like.createdAt.toISOString(),
            userId: like.user.id.toString(),
            login: like.user.login,
          }));

          return new PostsResponseDTO(
            post,
            parseInt(raw.likesCount, 10) || 0,
            parseInt(raw.dislikesCount, 10) || 0,
            myLikeStatus ? myLikeStatus.status : LikeStatuses.None,
            newestLikes,
          );
        }),
      );

      return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: totalCount,
        items: postsData,
      };
    } catch (error) {
      console.log('Error in getPostsByBlogId', error);
      throw error;
    }
  }

  async getAllPosts(params: PostsQueryParamsDTO, userId: number) {
    try {
      const { sortByColumn, sortOrder, pageNumber, pageSize, skipAmount } =
        this.getQueryParams(params);

      const queryBuilder = this.postsRepository
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.blog', 'blog')
        .leftJoinAndSelect('posts.user', 'user')
        .leftJoin(
          'likes',
          'like',
          'like.entityType = :entityType AND like.entityId = posts.id',
          { entityType: EntityType.POST },
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :likeStatus THEN 1 ELSE 0 END)',
          'likesCount',
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikesCount',
        )
        .setParameters({
          likeStatus: LikeStatuses.Like,
          dislikeStatus: LikeStatuses.Dislike,
        })
        .groupBy('posts.id, blog.id, user.id')
        .orderBy(
          `posts.${sortByColumn}`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        )
        .take(pageSize)
        .skip(skipAmount);

      const [posts, totalCount] = await queryBuilder.getManyAndCount();
      const rawResults = await queryBuilder.getRawMany();

      const postsData = await Promise.all(
        posts.map(async (post, index) => {
          const raw = rawResults[index];
          const myLikeStatus = await this.likesRepository.findOne({
            where: {
              entityType: EntityType.POST,
              entityId: post.id,
              user: { id: userId },
            },
          });

          const newestLikesQuery = await this.likesRepository
            .createQueryBuilder('like')
            .leftJoinAndSelect('like.user', 'user')
            .where('like.entityType = :entityType', {
              entityType: EntityType.POST,
            })
            .andWhere('like.entityId = :entityId', { entityId: post.id })
            .andWhere('status = :status', { status: LikeStatuses.Like })
            .orderBy('like.createdAt', 'DESC')
            .limit(3)
            .getMany();

          const newestLikes = newestLikesQuery.map((like) => ({
            addedAt: like.createdAt.toISOString(),
            userId: like.user.id.toString(),
            login: like.user.login,
          }));

          return new PostsResponseDTO(
            post,
            parseInt(raw.likesCount, 10) || 0,
            parseInt(raw.dislikesCount, 10) || 0,
            myLikeStatus ? myLikeStatus.status : LikeStatuses.None,
            newestLikes,
          );
        }),
      );

      return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: totalCount,
        items: postsData,
      };
    } catch (error) {
      console.log('Error in getAllPosts', error);
      throw error;
    }
  }

  public async findById(
    postId: number,
    userId: number,
  ): Promise<PostsResponseDTO | null> {
    try {
      const queryBuilder = this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoin(
          'likes',
          'like',
          'like.entityType = :entityType AND like.entityId = post.id',
          { entityType: EntityType.POST },
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :likeStatus THEN 1 ELSE 0 END)',
          'likesCount',
        )
        .addSelect(
          'SUM(CASE WHEN like.status = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikesCount',
        )
        .where('post.id = :postId', { postId })
        .setParameters({
          likeStatus: LikeStatuses.Like,
          dislikeStatus: LikeStatuses.Dislike,
        })
        .groupBy('post.id, blog.id, user.id');

      const result = await queryBuilder.getRawAndEntities();
      const post = result.entities[0];
      const raw = result.raw[0];

      if (!post) {
        return null;
      }

      const myLikeStatus = await this.likesRepository.findOne({
        where: {
          entityType: EntityType.POST,
          entityId: postId,
          user: { id: userId },
        },
      });

      const newestLikesQuery = await this.likesRepository
        .createQueryBuilder('like')
        .leftJoinAndSelect('like.user', 'user')
        .where('like.entityType = :entityType', { entityType: EntityType.POST })
        .andWhere('like.entityId = :entityId', { entityId: postId })
        .andWhere('status = :status', { status: LikeStatuses.Like })
        .orderBy('like.createdAt', 'DESC')
        .limit(3)
        .getMany();

      const newestLikes = newestLikesQuery.map((like) => ({
        addedAt: like.createdAt.toISOString(),
        userId: like.user.id.toString(),
        login: like.user.login,
      }));

      const res = {
        postData: post,
        likesCount: parseInt(raw.likesCount, 10) || 0,
        dislikesCount: parseInt(raw.dislikesCount, 10) || 0,
        myLikeStatus: myLikeStatus ? myLikeStatus.status : LikeStatuses.None,
        newestLikes: newestLikes,
      };

      return new PostsResponseDTO(
        res.postData,
        res.likesCount,
        res.dislikesCount,
        res.myLikeStatus,
        res.newestLikes,
      );
    } catch (error) {
      console.log('Error in findById posts query repo', error);
      throw error;
    }
  }

  public async findPost(postId: number) {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('p')
        .where('p.id = :postId', { postId })
        .getOne();
      if (!post) {
        return null;
      }
      return post;
    } catch (error) {
      console.log('Error in findPost', error);
      throw error;
    }
  }
}
