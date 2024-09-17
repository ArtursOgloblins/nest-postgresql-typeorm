import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersSaTestManager } from '../../../../../test/base/utils/usersSaTestManager';
import { AuthTestManager } from '../../../../../test/base/utils/authTestManager';
import { BlogsTestManager } from '../../../../../test/base/utils/blogsTestManager';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';
import { AppModule } from '../../../../app.module';
import { RegisterUserCommand } from '../../../users/application/usecases/register-user.usecase';
import { RegisterUserCommandMock } from '../../../../../test/base/mock/register-user.usecase.mock';
import { applyAppSettings } from '../../../../settings/apply-app-settings';

jest.setTimeout(10000);

describe('super admin queries', () => {
  let app: INestApplication;
  let usersSaManager: UsersSaTestManager;
  let authTestManager: AuthTestManager;
  let blogsTestManager: BlogsTestManager;
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
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (error) {
      console.error('Ошибка в afterAll:', error);
    }
  });

  it('register new users', async () => {
    await authTestManager.registerUser(authTestManager.USER_ONE_INPUT_DATA);
    await authTestManager.registerUser(authTestManager.USER_TWO_INPUT_DATA);

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

  it('login users', async () => {
    const tokenOne = await authTestManager.loginUser(
      authTestManager.USER_ONE_CREDENTIALS,
    );
    const tokenTwo = await authTestManager.loginUser(
      authTestManager.USER_TWO_CREDENTIALS,
    );
    console.log('tokenOne', tokenOne);

    expect.setState({
      userOneToken: tokenOne,
      userTwoToken: tokenTwo,
    });
  });

  it('UserOne creates blog', async () => {
    const { userOneToken } = expect.getState();
    const response = await blogsTestManager.addBlog(
      userOneToken,
      blogsTestManager.BLOG_INPUT_DATA,
    );
    expect.setState({
      blogId: response.body.id,
    });
  });
});
