import { Field, InputType, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreateCafeBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  zipcode: string;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  startTime: string;

  @Field(() => String, { nullable: true })
  endTime: string;

  @Field(() => String, { nullable: true })
  homepage: string;

  @Field(() => Int, { nullable: true })
  deposit: number;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  remarks: string;

  @Field(() => [String], { nullable: true })
  image: string[];

  @Field(() => [String], { nullable: true })
  tags: string[];
}
