import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class PasswordRecovery {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public confirmationCode: string;

  @Column({ default: true })
  public isValid: boolean;

  @Column()
  public expirationDate: Date;

  @OneToOne(() => Users, (user) => user.passwordRecovery)
  @JoinColumn()
  public user: Users;
}
