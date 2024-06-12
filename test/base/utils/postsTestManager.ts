import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { NewPostByBlogIdDto } from '../../../src/features/posts/api/dto/input/new-post-by-blog-id.dto';

interface Credentials {
  login: string;
  password: string;
}

export class PostsTestManager {
  constructor(protected readonly app: INestApplication) {}

  POST_INPUT_DATA: NewPostByBlogIdDto = {
    title: 'New Post',
    shortDescription: 'Some description',
    content: 'content content content',
  };

  UPDATE_POST_DATA: NewPostByBlogIdDto = {
    title: 'Updated post ',
    shortDescription: 'updated description',
    content: 'Updated content content',
  };

  CREDENTIALS: Credentials = {
    login: 'admin',
    password: 'qwerty',
  };

  async addPost(blogId: number, createModel: NewPostByBlogIdDto) {
    const response = await request(this.app.getHttpServer())
      .post(`/sa/blogs/${blogId}/posts`)
      .auth(this.CREDENTIALS.login, this.CREDENTIALS.password)
      .send(createModel);

    if (response.status !== 201) {
      console.error(response.body);
    }
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('id', expect.any(String));
    expect(response.body).toHaveProperty('title', createModel.title);
    expect(response.body).toHaveProperty(
      'shortDescription',
      createModel.shortDescription,
    );
    expect(response.body).toHaveProperty('content', createModel.content);
    expect(response.body).toHaveProperty('blogId', expect.any(String));
    expect(response.body).toHaveProperty('blogName', expect.any(String));
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('blogName', expect.any(String));

    expect(response.body.extendedLikesInfo).toHaveProperty('likesCount', 0);
    expect(response.body.extendedLikesInfo).toHaveProperty('dislikesCount', 0);
    expect(response.body.extendedLikesInfo).toHaveProperty('myStatus', 'None');
    expect(response.body.extendedLikesInfo).toHaveProperty('newestLikes', []);

    return response;
  }

  async getPostsByBlogId(blogId: number) {
    const response = await request(this.app.getHttpServer())
      .get(`/sa/blogs/${blogId}/posts`)
      .auth(this.CREDENTIALS.login, this.CREDENTIALS.password);

    if (response.status !== 200) {
      console.error(response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pagesCount', 1);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('pageSize', 10);
    expect(response.body).toHaveProperty('totalCount', 2);
    expect(response.body).toHaveProperty('items');
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items).toEqual(
      expect.arrayContaining([expect.anything(), expect.anything()]),
    );
  }

  async updatePostByBlogId(
    blogId: number,
    postId: number,
    updateModel: NewPostByBlogIdDto,
  ) {
    const response = await request(this.app.getHttpServer())
      .put(`/sa/blogs/${blogId}/posts/${postId}`)
      .auth(this.CREDENTIALS.login, this.CREDENTIALS.password)
      .send(updateModel);

    if (response.status !== 204) {
    }

    expect(response.status).toBe(204);
    return response;
  }

  async getAllPosts(jwt: string) {
    const response = await request(this.app.getHttpServer())
      .get(`/posts/`)
      .set('Authorization', `Bearer ${jwt}`)
      .query({ pageNumber: 1, pageSize: 10 });

    if (response.status !== 200) {
      console.error(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pagesCount', 1);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('pageSize', 10);
    expect(response.body).toHaveProperty('totalCount', 2);
    expect(response.body).toHaveProperty('items');
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items).toEqual(
      expect.arrayContaining([expect.anything(), expect.anything()]),
    );
  }

  async deletePost(blogId: number, postId: number) {
    const response = await request(this.app.getHttpServer())
      .delete(`/sa/blogs/${blogId}/posts/${postId}`)
      .auth(this.CREDENTIALS.login, this.CREDENTIALS.password);

    if (response.status !== 204) {
      console.error(response.body);
    }

    expect(response.status).toBe(204);
    return response;
  }
}
