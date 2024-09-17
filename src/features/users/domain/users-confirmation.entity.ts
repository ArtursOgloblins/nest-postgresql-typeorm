import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Blogs } from '../../blogs/domain/blogs.entity';

@Entity()
export class UsersConfirmation {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public confirmationCode: string;

  @Column({ default: false })
  public isConfirmed: boolean;

  @Column()
  public expirationDate: Date;

  @OneToOne(() => Users, (user) => user.confirmation)
  @JoinColumn()
  public user: Users;
}
