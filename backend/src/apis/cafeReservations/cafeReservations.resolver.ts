import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeReservation)
  createCafeReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ) {
    return this.cafeReservationsService.create({
      createReservationInput,
    });
  }
}
