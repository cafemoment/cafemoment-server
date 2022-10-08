import { Field, ObjectType } from '@nestjs/graphql';
import { CafeBoard } from 'src/apis/cafeBoards/entities/cafeBoard.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FreeBoard } from '../../freeboards/entities/freeBoard.entity';

@Entity()
@ObjectType()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => FreeBoard, (freeBoard) => freeBoard.tags)
  @Field(() => [FreeBoard])
  freeBoard: FreeBoard[];

  @ManyToMany(() => CafeBoard, (cafeBoard) => cafeBoard.tags)
  @Field(() => [CafeBoard])
  cafeBoard: CafeBoard[];
}
