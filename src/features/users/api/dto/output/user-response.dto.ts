import { Users } from '../../../domain/users.entity';

class BanInfo {
  isBanned: boolean;
  banDate: string | null;
  banReason: string | null;
}

export class UserResponseDTO {
  public id: string;
  public login: string;
  public email: string;
  public createdAt: Date;
  public banInfo: BanInfo;

  public constructor(user: Users) {
    this.id = user.id.toString();
    this.login = user.login;
    this.email = user.email;
    this.createdAt = user.createdAt;

    const isActiveBan = user.bans.find((ban) => ban.isActiveBan);
    this.banInfo = {
      isBanned: !!isActiveBan,
      banDate: isActiveBan ? isActiveBan.bannedAt.toISOString() : null,
      banReason: isActiveBan ? isActiveBan.banReason : null,
    };
  }
}
