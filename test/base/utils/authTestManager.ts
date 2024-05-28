import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RegisterUserDTO } from '../../../src/features/users/api/dto/input/register-user.dto';
import { ConfirmationCodeDto } from '../../../src/features/auth/api/dto/input/confirmation-code.dto';

export class AuthTestManager {
  constructor(protected readonly app: INestApplication) {}

  USER_ONE_INPUT_DATA: RegisterUserDTO = {
    login: 'JohnDoe',
    password: 'password123',
    email: 'john@doe.com',
  };

  USER_TWO_INPUT_DATA: RegisterUserDTO = {
    login: 'JaneDoe',
    password: 'password123',
    email: 'jane@doe.com',
  };

  USER_ONE_CREDENTIALS = {
    loginOrEmail: 'JohnDoe',
    password: 'password123',
  };

  USER_TWO_CREDENTIALS = {
    loginOrEmail: 'JaneDoe',
    password: 'password123',
  };

  async registerUser(createModel: RegisterUserDTO) {
    const response = await request(this.app.getHttpServer())
      .post('/auth/registration')
      .send(createModel);

    if (response.status !== 204) {
      console.error(response.body);
    }
    expect(response.status).toBe(204);
    return response;
  }

  async confirmRegistration(confirmationCode: ConfirmationCodeDto) {
    const response = await request(this.app.getHttpServer())
      .post(`/auth/registration-confirmation`)
      .send({ code: confirmationCode });
    if (response.status !== 204) {
      console.error(response.body);
    }
    expect(response.status).toBe(204);
    return response;
  }

  // async loginUser(credentials: any) {
  //   const response = await request(this.app.getHttpServer())
  //     .post(`/auth/login`)
  //     .send(credentials);
  //   if (response.status !== 200) {
  //     console.error(response.body);
  //   }
  //   expect(response.status).toBe(200);
  //   return response.body.accessToken;
  // }
}
