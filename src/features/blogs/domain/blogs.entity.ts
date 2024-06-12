import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../../posts/domain/posts.entity';

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public description: string;

  @Column({ type: 'varchar' })
  public websiteUrl: string;

  @Column({ default: false })
  public isMembership: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Posts, (post) => post.blog)
  public post: Posts[];
}
