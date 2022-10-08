import {
  Controller,
  Get,
  Req,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthsService } from './auths.service';
import { IOAuthUser } from 'src/commons/type/context';

/**
 * Authorization Restful API Controller
 * @APIs 'loginGoogle', 'loginNaver', 'loginKakao'
 */
@Controller()
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    await this.authsService.getSocialLogin({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    await this.authsService.getSocialLogin({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    await this.authsService.getSocialLogin({ req, res });
  }
}
