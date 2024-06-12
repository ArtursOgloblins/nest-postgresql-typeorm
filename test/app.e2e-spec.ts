import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { aDescribe, skipSettings } from './test-settings';
import { RegisterUserCommand } from '../src/features/users/application/usecases/register-user.usecase';
import { RegisterUserCommandMock } from './base/mock/register-user.usecase.mock';
import { applyAppSettings } from '../src/settings/apply-app-settings';
import { UsersSaTestManager } from './base/utils/usersSaTestManager';
import { UsersQueryRepository } from '../src/features/users/infrastructure/users.query-repository';
import { UserQueryParamsDTO } from '../src/features/users/api/dto/input/users-queryParams.dto';
import { AuthTestManager } from './base/utils/authTestManager';
import { BlogsTestManager } from './base/utils/blogsTestManager';
import { PostsTestManager } from './base/utils/postsTestManager';

jest.setTimeout(10000);

aDescribe(skipSettings.for('authTest'))('AppController (e2e)', () => {
  let app: INestApplication;
  let usersSaManager: UsersSaTestManager;
  let authTestManager: AuthTestManager;
  let blogsTestManager: BlogsTestManager;
  let postsTestManager: PostsTestManager;
  let usersQueryRepository: UsersQueryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RegisterUserCommand)
      .useClass(RegisterUserCommandMock)
      .compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);
    await app.init();
    console.log('HTTP Server:', app.getHttpServer());

    await request(app.getHttpServer()).delete(`/testing/all-data`);

    usersQueryRepository =
      moduleFixture.get<UsersQueryRepository>(UsersQueryRepository);
    usersSaManager = new UsersSaTestManager(app);
    authTestManager = new AuthTestManager(app, usersQueryRepository);
    blogsTestManager = new BlogsTestManager(app);
    postsTestManager = new PostsTestManager(app);
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (error) {
      console.error('Ошибка в afterAll:', error);
    }
  });

  it('Super Admin registering user', async () => {
    const response = await usersSaManager.registerUser(
      usersSaManager.USER_INPUT_DATA,
    );
    expect.setState({
      userId: response.body.id,
    });
  });

  it('Get all users', async () => {
    const queryParams: UserQueryParamsDTO = usersSaManager.QUERYPARAMS;
    const response = await usersSaManager.getAllUsers(queryParams);
    expect(response.status).toBe(200);
  });

  it('Delete user by id', async () => {
    const { userId } = expect.getState();
    await usersSaManager.deleteUserById(userId);
  });

  it('register new users', async () => {
    await authTestManager.registerUser(authTestManager.USER_ONE_INPUT_DATA);
    await authTestManager.registerUser(authTestManager.USER_TWO_INPUT_DATA);

    const userOne = await usersQueryRepository.findByLoginOrEmail(
      authTestManager.USER_ONE_INPUT_DATA.email,
    );

    expect.setState({
      userOneData: userOne,
    });
  });

  it('resend confirmation code for user one', async () => {
    const { userOneData } = expect.getState();
    await authTestManager.resendConfirmationCode(userOneData.email);

    const userOne = await usersQueryRepository.findByLoginOrEmail(
      authTestManager.USER_ONE_INPUT_DATA.email,
    );

    const userTwo = await usersQueryRepository.findByLoginOrEmail(
      authTestManager.USER_TWO_INPUT_DATA.email,
    );

    expect.setState({
      userOneData: userOne,
      userTwoData: userTwo,
    });
  });

  it('confirm users', async () => {
    const { userOneData, userTwoData } = expect.getState();
    await authTestManager.confirmRegistration(
      userOneData.confirmation.confirmationCode,
    );
    await authTestManager.confirmRegistration(
      userTwoData.confirmation.confirmationCode,
    );
  });

  it('Password-recovery for userOne', async () => {
    const { userOneData } = expect.getState();
    const recoveryData = await authTestManager.sendPasswordRecoveryRequest(
      userOneData.email,
    );
    expect.setState({
      passwordRecoveryCode: recoveryData,
    });
  });

  it('Change password for userOne', async () => {
    const { passwordRecoveryCode } = expect.getState();
    const newPassword = 'newPassword';
    await authTestManager.changeUserPassword(passwordRecoveryCode, newPassword);
  });

  it('login users', async () => {
    const tokenOne = await authTestManager.loginUser({
      ...authTestManager.USER_ONE_CREDENTIALS,
      password: 'newPassword',
    });
    const tokenTwo = await authTestManager.loginUser(
      authTestManager.USER_TWO_CREDENTIALS,
    );
    console.log('tokenOne', tokenOne);

    expect.setState({
      userOneToken: tokenOne,
      userTwoToken: tokenTwo,
    });
  });

  it('Get info about user one', async () => {
    const { userOneToken } = expect.getState();
    await authTestManager.getCurrentUserInfo(userOneToken);
  });

  // refresh token

  it('UserOne creates blog', async () => {
    const response = await blogsTestManager.addBlog(
      blogsTestManager.BLOG_INPUT_DATA,
    );
    expect.setState({
      blogId: response.body.id,
    });
  });

  it('UserOne updates blog', async () => {
    const { blogId } = expect.getState();
    return await blogsTestManager.updateBlog(
      blogId,
      blogsTestManager.UPDATE_BLOG_DATA,
    );
  });

  it('UserOne deletes blog', async () => {
    const { blogId } = expect.getState();
    return await blogsTestManager.deleteBlog(blogId);
  });

  it('UserOne creates 2 blogs', async () => {
    const blogOne = await blogsTestManager.addBlog(
      blogsTestManager.BLOG_INPUT_DATA,
    );

    const blogTwo = await blogsTestManager.addBlog(
      blogsTestManager.BLOG_INPUT_DATA,
    );

    expect.setState({
      blogOneId: blogOne.body.id,
      blogTwoId: blogTwo.body.id,
    });
  });

  // Get blogs with pagination

  it('UserOne creates 2 posts by blog id', async () => {
    const { blogOneId } = expect.getState();
    const postOne = await postsTestManager.addPost(
      blogOneId,
      postsTestManager.POST_INPUT_DATA,
    );

    const postTwo = await postsTestManager.addPost(
      blogOneId,
      postsTestManager.POST_INPUT_DATA,
    );

    expect.setState({
      postOneId: postOne.body.id,
      postTwoId: postTwo.body.id,
    });
  });

  it('Get post by blog id', async () => {
    const { blogOneId } = expect.getState();
    await postsTestManager.getPostsByBlogId(blogOneId);
  });

  it('User One updates post by blog id', async () => {
    const { blogOneId, postOneId } = expect.getState();
    await postsTestManager.updatePostByBlogId(
      blogOneId,
      postOneId,
      postsTestManager.UPDATE_POST_DATA,
    );
  });

  it('get all posts GET -> "/posts"', async () => {
    const { userOneToken } = expect.getState();
    await postsTestManager.getAllPosts(userOneToken);
  });

  it('Delete post by blogId by userOne', async () => {
    const { blogOneId, postTwoId } = expect.getState();
    return await postsTestManager.deletePost(blogOneId, postTwoId);
  });
});
