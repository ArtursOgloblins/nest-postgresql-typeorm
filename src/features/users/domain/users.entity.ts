import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersConfirmation } from './users-confirmation.entity';
import { PasswordRecovery } from '../../auth/domain/auth.password-recovery.entity';
import { RefreshToken } from '../../auth/domain/auth.refresh-token.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public login: string;

  @Column({ type: 'varchar' })
  public email: string;

  @Column({ type: 'varchar' })
  public password: string;

  @Column({ default: false })
  public isDeleted: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @OneToOne(() => UsersConfirmation, (confirmation) => confirmation.user)
  public confirmation: UsersConfirmation;

  @OneToOne(() => PasswordRecovery, (passwordRecovery) => passwordRecovery.user)
  public passwordRecovery: PasswordRecovery;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  public refreshToken: RefreshToken[];
}
