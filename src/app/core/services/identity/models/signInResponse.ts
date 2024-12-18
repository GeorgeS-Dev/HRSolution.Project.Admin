import { TwoFactors } from "./twoFactors";

export interface SignInResponse {
  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
  twoFactors?: TwoFactors[] | null;
}