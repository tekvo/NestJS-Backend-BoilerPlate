import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Provider } from "src/constant/enum";

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  Provider.Google,
) {
  constructor(configService: ConfigService) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>("GOOGLE_OAUTH_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_OAUTH_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_OAUTH_REDIRECT_URL"),
      accessType: "offline",
      prompt: "consent",
      scope: [  
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/plus.login",
        "profile",
      ],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "consent",
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { id, name, emails, photos } = profile;
      const providerUser = {
        provider: Provider.Google,
        email: emails[0].value,
        name: name.givenName,
        lastName: name.familyName,
        providerId: id,
        profile: profile,
        picture: photos[0].value,
        accessToken,
        refreshToken,
      };

      done(null, providerUser);
    } catch (error) {
      // If an error occurs during validation, signal failure by calling done with the error
      done(error, false);
    }
  }
}
