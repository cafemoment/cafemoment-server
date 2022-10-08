import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from 'src/apis/reviews/entites/review.entity';
import { CafeReservation } from 'src/apis/cafeReservations/entities/cafeReservations.entity';
import { Like } from 'src/apis/likes/entities/like.entity';
import { Image } from 'src/apis/images/entities/image.entity';
import { Tag } from 'src/apis/tags/entities/tag.entity';

@Entity()
@ObjectType()
export class CafeBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phone: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  startTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  endTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  homepage: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  deposit: number;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  remarks: string;

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  CafeLikeCount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @JoinTable()
  @ManyToMany(() => Tag, (tags) => tags.cafeBoard, {
    nullable: true,
  })
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];

  @OneToMany(() => Review, (review) => review.cafeBoard, { nullable: true })
  @Field(() => [Review], { nullable: true })
  reviews: Review[];

  @JoinTable()
  @OneToMany(() => Like, (like) => like.cafeBoard, {
    nullable: true,
  })
  @Field(() => [Like], { nullable: true })
  like: Like[];

  @JoinTable()
  @OneToMany(() => Image, (image) => image.cafeBoard, {
    nullable: true,
    cascade: true,
  })
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @JoinTable()
  @OneToMany(
    () => CafeReservation,
    (cafeReservation) => cafeReservation.cafeBoard,
    {
      nullable: true,
    },
  )
  @Field(() => [CafeReservation], { nullable: true })
  cafeReservation: CafeReservation[];
}
