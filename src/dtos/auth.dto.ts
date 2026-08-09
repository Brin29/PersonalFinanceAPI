import { RegisterModel } from "../types/auth.request";
import { LoginModel } from "../types/auth.request";
import { CodeModel } from "../types/auth.request";
import { VerifyCodeRequest } from "../types/auth.request";
import { MagicLinkRequest } from "../types/auth.request";
import { Request } from "../types/request";

export interface RegisterRequest {
  Body: Request<RegisterModel>;
}

// export interface GoogleCallBack{
//   Body: Request<>
// }

export interface LoginRequest {
  Body: Request<LoginModel>;
}

export interface CodeGenerateRequest {
  Body: Request<CodeModel>;
}

export interface VerifyCodeRequestType {
  Body: Request<VerifyCodeRequest>;
}

export interface CheckEmailRequest {
  Body: Request<{ email: string }>;
}

export interface MagicLinkGenerateRequest {
  Body: Request<{ email: string }>;
}

export interface VerifyMagicTokenRequest {
  Body: Request<MagicLinkRequest>;
}

export interface RefreshTokenRequest {
  Body: Request<{ refresh_token: string }>;
}

export interface EditProfileRequest {
  Body: Request<{ firstName?: string; lastName?: string, avatarUrl?: string }>;
}

// GetProfile has no body, so no type needed (or we could define empty)