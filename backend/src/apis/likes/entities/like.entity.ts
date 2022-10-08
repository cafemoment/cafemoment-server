import { Field, ObjectType } from '@nestjs/graphql';
import { CafeBoard } from 'src/apis/cafeBoards/entities/cafeBoard.entity';
import { FreeBoard } from 'src/apis/freeboards/entities/freeBoard.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isLike: boolean;

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

  @JoinTable()
  @ManyToOne(() => CafeBoard, { nullable: true })
  @Field(() => CafeBoard, { nullable: true })
  cafeBoard: CafeBoard;

  @ManyToOne(() => FreeBoard, { nullable: true })
  @Field(() => FreeBoard, { nullable: true })
  freeBoard: FreeBoard;
}
