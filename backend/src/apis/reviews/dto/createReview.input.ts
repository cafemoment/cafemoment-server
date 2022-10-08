import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  comment: string;

  @Field(() => String)
  userId: string;
}
