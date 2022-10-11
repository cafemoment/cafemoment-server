import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CafeReservationsService } from './cafeReservations.service';
import { CreateReservationInput } from './dto/createReservation.input';
import { CafeReservation } from './entities/cafeReservations.entity';

/**
 * CafeReservation GraphQL API Resolver
 * @APIs
 * 'fetchCafeReservation'
 * 'fetchCafeReservationNumber',
 * 'fetchMyCafeReservation'
 * 'createCafeReservation'
 */
@Resolver()
export class CafeReservationsResolver {
  constructor(
    private readonly cafeReservationsService: CafeReservationsService, //
  ) {}

  /** 카페에 예약한 유저 예약 내역 조회 */
  @Query(() => CafeReservation)
  fetchCafeReservation(
    @Args('cafeReservationId') cafeReservationId: string, //
  ) {
    return this.cafeReservationsService.find({ cafeReservationId });
  }

  /** 유저 예약내역 개수 조회 */
  @Query(() => Number)
  fetchCafeReservationNumber(
    @Args('userId') userId: string, //
  ) {
    return this.cafeReservationsService.findbyUser({ userId });
  }

  /** 유저 예약내역 조회 */
  @Query(() => [CafeReservation])
  fetchMyCafeReservation(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number,
  ) {
    return this.cafeReservationsService.findUser({ page, userId });
  }

  /** 카페 예약하기 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeReservation)
  createCafeReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
    @Context() context: IContext,
  ) {
    return this.cafeReservationsService.create({
      createReservationInput,
      context,
    });
  }

  /** 카페 예약 취소하기 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  cancelCafeReservation(
    @Args('cafeReservationId') cafeReservationId: string, //
    @Context() context: IContext,
  ) {
    return this.cafeReservationsService.cancel({
      context,
      cafeReservationId,
    });
  }
}
