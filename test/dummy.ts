import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-settings';
import { UsersQueryRepository } from '../src/features/users/infrastructure/users.query-repository';
import { aDescribe } from './base/utils/aDescribe';
import { RegisterUserCommand } from '../src/features/users/application/usecases/register-user.usecase';
import { skipSettings } from './test-settings';
import { RegisterUserCommandMock } from './base/mock/register-user.usecase.mock';
import request from 'supertest';
import { UsersSaTestManager } from './base/utils/usersSaTestManager';

aDescribe(skipSettings.for('authTest'))('AppController (e2e)', () => {
  let app: INestApplication;
  let usersSaManager: UsersSaTestManager;
  let usersQueryRepository: UsersQueryRepository;

  beforeAll(async () => {
    try {
      console.log('Начало beforeAll');
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(RegisterUserCommand)
        .useClass(RegisterUserCommandMock)
        .compile();

      app = moduleFixture.createNestApplication();
      applyAppSettings(app);
      await app.init();

      console.log('Удаление всех данных');
      const deleteResponse = await request(app.getHttpServer()).delete(
        `/testing/all-data`,
      );
      console.log('Ответ на удаление:', deleteResponse.status);

      usersSaManager = new UsersSaTestManager(app);
      usersQueryRepository =
        moduleFixture.get<UsersQueryRepository>(UsersQueryRepository);
      console.log('Завершение настройки beforeAll');
    } catch (error) {
      console.error('Ошибка в beforeAll:', error);
    }
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (error) {
      console.error('Ошибка в afterAll:', error);
    }
  });

  it('Суперадмин запрашивает пользователя', async () => {
    console.log('Начало теста: Суперадмин запрашивает пользователя');
    try {
      const response = await usersSaManager.registerUser(
        usersSaManager.USER_INPUT_DATA,
      );
      console.log('Ответ теста:', response.body);
    } catch (error) {
      console.error('Ошибка в тесте:', error);
    }
  });
});
