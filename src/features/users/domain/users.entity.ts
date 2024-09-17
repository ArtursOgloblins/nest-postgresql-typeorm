import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersConfirmation } from './users-confirmation.entity';
import { PasswordRecovery } from '../../auth/domain/auth.password-recovery.entity';
import { RefreshToken } from '../../auth/domain/auth.refresh-token.entity';
import { Comments } from '../../comments/domain/commnets.entity';
import { Likes } from '../../likes/domain/likes.entity';
import { Posts } from '../../posts/domain/posts.entity';
import { Blogs } from '../../blogs/domain/blogs.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  public id: number;

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

  @OneToMany(() => Blogs, (blog) => blog.owner)
  public blogs: Blogs[];

  @OneToMany(() => Posts, (post) => post.user)
  public posts: Posts[];

  @OneToMany(() => Comments, (comment) => comment.user)
  public comments: Comments[];

  @OneToMany(() => Likes, (like) => like.user)
  public likes: Likes[];
}
