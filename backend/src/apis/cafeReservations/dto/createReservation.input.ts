import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field(() => String, { nullable: true })
  orderRequest: string;

  @Field(() => Int)
  reservedPeople: number;

  @Field(() => Date)
  reservationDate: Date;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => String)
  cafeBoardId: string;

  @Field(() => String)
  userId: string;
}
