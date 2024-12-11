import { TwoFactors } from "./twoFactors";

export interface SignInResponse {
  token: string;
  twoFactors: TwoFactors[] | null;
}