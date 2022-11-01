import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  password: string;

  @Field(() => String)
  nickName: string;
}
