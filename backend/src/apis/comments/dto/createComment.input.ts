import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { nullable: true })
  comment: string;

  @Field(() => String)
  boardId: string;
}
