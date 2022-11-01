import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(process.env.ACCESS_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    // accessToken 꺼내기
    const accessToken =
      'accessToken:' + req.headers.authorization.split(' ')[1];
    // Redis에서 AccessToken 있는지 확인하기
    const redisAccessToken = await this.cacheManager.get(accessToken);
    if (redisAccessToken) {
      throw new UnauthorizedException('만료된 엑세스 토큰입니다.');
    }

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
