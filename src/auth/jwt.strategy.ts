import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: false,
      // secretOrKey: process.env.PUBLIC_KEY,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: false,
        jwksRequestsPerMinute: 200,
        jwksUri: process.env.JWKS_URI,
      }),
      algorithms: ['RS256'],
      //audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER,
    });
  }

  async validate(payload, done) {
    //  console.log(payload);
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      name: payload.given_name,
      lastname: payload.family_name,
    };
  }
}
