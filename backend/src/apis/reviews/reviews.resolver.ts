import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CreateReviewInput } from './dto/createReview.input';
import { UpdateReviewInput } from './dto/updateReview.input';
import { Review } from './entites/review.entity';
import { ReviewsService } from './reviews.service';

/**
 * ReviewsResolver Graphql API Resolver
 * @APIs
 * 'fetchReview'
 * 'fetchReviews'
 * 'createReview'
 * 'updateReview'
 * 'deleteReview'
 */
@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  /** 리뷰 하나 조회 */
  @Query(() => Review)
  fetchReview(
    @Args('reviewId') reviewId: string, //
  ) {
    this.reviewsService.findOne({ reviewId });
  }

  /** 모든 리뷰 조회 */
  @Query(() => [Review])
  fetchReviews() {
    return this.reviewsService.findAll();
  }

  /** 리뷰 생성 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Context() context: IContext, //
    @Args('createReviewInput') createReviewInput: CreateReviewInput, //
  ) {
    return this.reviewsService.create({ createReviewInput });
  }

  /** 리뷰 수정 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput, //
    @Context() context: IContext, //
  ) {
    return this.reviewsService.update({ context, updateReviewInput });
  }

  /** 리뷰 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteReview(
    @Context() context: IContext, //
    @Args('reviewId') reviewId: string,
  ) {
    return this.reviewsService.delete({ context, reviewId });
  }
}
