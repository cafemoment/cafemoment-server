import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { Comment } from './entites/comment.entity';

/**
 * Comment GrqphQL API Resolver
 * @APIs
 * 'createComment',
 * 'updateComment',
 * 'deleteComment',
 * 'fetchComments'
 */
@Resolver()
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}

  /** 댓글 작성 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @Context() context: IContext,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    const user = context.req.user.email;
    return this.commentService.create({ user, createCommentInput });
  }

  /** 댓글 수정 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  updateComment(
    @Context() context: IContext,
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    const user = context.req.user.email;
    return this.commentService.update({
      commentId,
      user,
      updateCommentInput,
    });
  }

  /** 댓글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentId') commentId: string, //
    @Context() context: IContext,
  ) {
    return this.commentService.deleteComment({ context, commentId });
  }

  /** 게시물에 달린 댓글 모두 조회 */
  @Query(() => [Comment])
  async fetchComments(
    @Args('boardId') boardId: string, //
  ) {
    return await this.commentService.findAll({ boardId });
  }
}
