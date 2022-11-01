import { Field, ObjectType } from '@nestjs/graphql';

ObjectType();
export class UserOutput {
  @Field(() => String)
  id: string;
}
