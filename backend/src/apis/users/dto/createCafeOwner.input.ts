import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCafeOwnerInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  nickName: string;

  @Field(() => String, { nullable: true })
  cafeName: string;
}
