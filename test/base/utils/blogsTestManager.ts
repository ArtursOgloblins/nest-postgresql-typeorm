import * as request from 'supertest';
import { NewBlogDto } from '../../../src/features/blogs/api/dto/input/new-blog.dto';
import { INestApplication } from '@nestjs/common';

interface Credentials {
  login: string;
  password: string;
}

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}

  BLOG_INPUT_DATA: NewBlogDto = {
    name: 'New Blog3',
    description: 'description234',
    websiteUrl: 'https://newblog.com',
  };

  UPDATE_BLOG_DATA: NewBlogDto = {
    name: 'UpdatedBlog',
    description: 'desc3',
    websiteUrl: 'https://mongodb.com',
  };

  CREDENTIALS: Credentials = {
    login: 'admin',
    password: 'qwerty',
  };

  async addBlog(jwt: string, createModel: NewBlogDto) {
    const response = await request(this.app.getHttpServer())
      .post('/blogger/blogs')
      .set('Authorization', `Bearer ${jwt}`)
      .send(createModel);

    if (response.status !== 201) {
      console.error(
        `Failed to create blog: Status ${response.status} - Body:`,
        response.body,
      );
      throw new Error('Blog creation failed');
    }
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', expect.any(String));
    expect(response.body).toHaveProperty('name', createModel.name);
    expect(response.body).toHaveProperty(
      'description',
      createModel.description,
    );
    expect(response.body).toHaveProperty('websiteUrl', createModel.websiteUrl);
    expect(response.body).toHaveProperty('isMembership', expect.any(Boolean));
    expect(response.body).toHaveProperty('createdAt');
    return response;
  }

  async updateBlog(blogId: string, updateModel: NewBlogDto) {
    const response = await request(this.app.getHttpServer())
      .put(`/sa/blogs/${blogId}`)
      .auth(this.CREDENTIALS.login, this.CREDENTIALS.password)
      .send(updateModel);

    if (response.status !== 204) {
      console.error(response.body);
    }

    expect(response.status).toBe(204);
    return response;
  }

  async deleteBlog(blogId: string) {
    const response = await request(this.app.getHttpServer())
      .delete(`/sa/blogs/${blogId}`)
      .auth(this.CREDENTIALS.login, this.CREDENTIALS.password);

    if (response.status !== 204) {
      console.error(response.body);
    }

    expect(response.status).toBe(204);
    return response;
  }
}
