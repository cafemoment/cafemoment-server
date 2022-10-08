import { Field, ObjectType } from '@nestjs/graphql';
import { CafeBoard } from 'src/apis/cafeBoards/entities/cafeBoard.entity';
import { Comment } from 'src/apis/comments/entites/comment.entity';
import { Image } from 'src/apis/images/entities/image.entity';
import { Like } from 'src/apis/likes/entities/like.entity';
import { Tag } from 'src/apis/tags/entities/tag.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class FreeBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  likeCount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  addressDetail: string;

  @JoinTable()
  @ManyToMany(() => Tag, (tags) => tags.freeBoard, { nullable: true })
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.freeBoard, {
    nullable: true,
  })
  @Field(() => [Like], { nullable: true })
  like: Like[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeBoard, { nullable: true })
  @Field(() => CafeBoard, { nullable: true })
  cafeBoard: CafeBoard;

  @JoinTable()
  @OneToMany(() => Image, (image) => image.freeBoard, {
    nullable: true,
    cascade: true,
  })
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @JoinTable()
  @OneToMany(() => Comment, (comment) => comment.freeBoard, {
    nullable: true,
    cascade: true,
  })
  @Field(() => [Comment], { nullable: true })
  comment: Comment[];
}
