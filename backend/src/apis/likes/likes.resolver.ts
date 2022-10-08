import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { FreeBoard } from '../freeboards/entities/freeBoard.entity';
import { Like } from './entities/like.entity';
import { LikesService } from './likes.service';

/**
 * FavoriteCafesResolver GraphQL API Resolver
 * @APIs
 * 'toggleFavoriteCafes'
 * 'fetchUserFavoriteCafe'
 * 'fetchFavoriteCafeNumber'
 * 'fetchFavoriteCafeUser'
 */
@Resolver()
export class LikesResolver {
  constructor(
    private readonly likesService: LikesService, //
  ) {}

  /** 카페 좋아요 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleCafeBoardLike(
    @Context() context: IContext,
    @Args('cafeBoardId') cafeBoardId: string,
  ) {
    const userId = context.req.user.id;
    return this.likesService.cafeBoardlike({ userId, cafeBoardId });
  }

  /** 게시글 좋아요 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleFreeBoardLike(
    @Context() context: IContext,
    @Args('freeBoardId') freeBoardId: string,
  ) {
    const userId = context.req.user.id;
    return this.likesService.freeBoardlike({ userId, freeBoardId });
  }

  /** 유저가 찜한 카페 조회 */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Like])
  fetchUserCafeBoardLike(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number,
  ) {
    return this.likesService.findUserLike({ userId, page });
  }

  /** 유저가 찜한 카페 개수 조회 */
  @Query(() => Number)
  fetchCafeBoardNumber(
    @Args('userId') userId: string, //
  ) {
    return this.likesService.findByUserId({ userId });
  }

  /** 찜한 카페 조회 */
  @Query(() => [Like])
  fetchCafeBoardLike(
    @Args('cafeBoardId') cafeBoardId: string, //
  ) {
    return this.likesService.findCafeBoardAll({ cafeBoardId });
  }

  /** 좋아요한 게시글 조회 */
  @Query(() => [FreeBoard])
  fetchFreeBoardLike(
    @Args('freeBoardId') freeBoardId: string, //
  ) {
    return this.likesService.findFreeBoardAll({ freeBoardId });
  }
}
