import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CafeReservation } from 'src/apis/cafeReservations/entities/cafeReservations.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PAYMENT_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
} // 실제 enum

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'POINT_TRANSACTION_STATUS_ENUM',
}); // graphql로 등록

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @CreateDateColumn()
  @Field(() => Date)
  paymentDate: Date;

  @Column()
  @Field(() => Int)
  paymentAmount: number;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM)
  status: string;

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => CafeReservation, { nullable: true })
  @Field(() => CafeReservation, { nullable: true })
  cafeReservation: CafeReservation;
}
