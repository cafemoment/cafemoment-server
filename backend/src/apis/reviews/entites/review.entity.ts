import { Field, ObjectType } from '@nestjs/graphql';
import { CafeBoard } from 'src/apis/cafeBoards/entities/cafeBoard.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  comment: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  ownerComment: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeBoard)
  @Field(() => CafeBoard)
  cafeBoard: CafeBoard;
}
