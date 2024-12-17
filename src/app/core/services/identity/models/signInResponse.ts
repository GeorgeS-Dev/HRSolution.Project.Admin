import { TwoFactors } from "./twoFactors";

export interface SignInResponse {
  accessToken: string;
  expires: Date;
  twoFactors: TwoFactors[] | null;
}