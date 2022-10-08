import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthsService } from './auths.service';
import { IContext } from 'src/commons/type/context';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';

/**
 * Authorization GraphQL API Resolver
 * @APIs
 * `loginUser`,
 * `logoutUser`,
 * `restoreAccessToken`,
 * `sendTokenToSMS`,
 * `checkSMSTokenValid`
 */
@Resolver()
export class AuthResolver {
  constructor(
    private readonly authsService: AuthsService, //
    private readonly usersService: UsersService,
  ) {}

  /** 로그인 */
  @Mutation(() => String)
  async loginUser(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    return await this.authsService.getUserLogin({ email, password, context });
  }

  /** 로그아웃 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  logoutUser(
    @Context() context: IContext, //
  ) {
    return this.authsService.getLogout({ context });
  }

  /** AccessToken 재발급 */
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }

  /** 핸드폰 문자로 인증 번호 전송 */
  @Mutation(() => String)
  sendTokenToSMS(
    @Args('phoneNumber') phoneNumber: string, //
  ) {
    return this.usersService.sendTokenToSMS({ phoneNumber });
  }

  /** 핸드폰 인증 번호 검증 */
  @Mutation(() => Boolean)
  checkSMSTokenValid(
    @Args('phoneNumber') phoneNumber: string, //
    @Args('SMSToken') SMSToken: string,
  ) {
    return this.authsService.checkSMSTokenValid({ phoneNumber, SMSToken });
  }
}
