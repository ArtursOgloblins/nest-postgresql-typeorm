import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blogs } from '../../blogs/domain/blogs.entity';
import { Comments } from '../../comments/domain/commnets.entity';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public shortDescription: string;

  @Column({ type: 'varchar' })
  public content: string;

  @Column({ type: 'varchar' })
  public blogName: string;

  @Column({ type: 'varchar' })
  public title: string;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Comments, (comment) => comment.post)
  public comments: Comments[];

  @ManyToOne(() => Blogs, (blog) => blog.post)
  @JoinColumn({ name: 'blogId' })
  @Index()
  public blog: Blogs;

  @ManyToOne(() => Users, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  @Index()
  public user: Users;
}
