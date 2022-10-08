import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFreeBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  zipcode: string;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => [String], { nullable: true })
  image: string[];

  @Field(() => String, { nullable: true })
  cafeBoard: string;
}
