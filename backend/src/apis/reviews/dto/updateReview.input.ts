import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput {
  @Field(() => String)
  comment: string;

  @Field(() => String)
  reviewId: string;
}
