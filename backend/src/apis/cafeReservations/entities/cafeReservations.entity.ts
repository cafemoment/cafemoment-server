import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CafeBoard } from 'src/apis/cafeBoards/entities/cafeBoard.entity';
import { User } from 'src/apis/users/entites/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class CafeReservation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  orderRequest: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  reservedPeople: number;

  @Column()
  @Field(() => Date)
  reservationDate: Date;

  @Column()
  @Field(() => String)
  startTime: string;

  @Column()
  @Field(() => Int)
  deposit: number;

  @Column()
  @Field(() => String)
  endTime: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  reservationStatus: boolean;

  @ManyToOne(() => CafeBoard)
  @Field(() => CafeBoard)
  cafeBoard: CafeBoard;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
