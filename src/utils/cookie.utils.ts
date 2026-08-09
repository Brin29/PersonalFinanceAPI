import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../env";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const VERIFICATION_TOKEN_COOKIE = "verification_token";

const ACCESS_TOKEN_MAX_AGE = 15 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

const isProduction = env.NODE_ENV === "production";

function cookieOptions(maxAge: number) {
  return {
    path: "/",
    httpOnly: true,
    domain: "https://personal-finance-tracker-sepia-rho.vercel.app",
    signed: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    maxAge,
  };
}

export function setAuthCookies(
  reply: FastifyReply,
  tokens: { access_token: string; refresh_token: string },
) {
  reply.setCookie(
    ACCESS_TOKEN_COOKIE,
    tokens.access_token,
    cookieOptions(ACCESS_TOKEN_MAX_AGE),
  );
  reply.setCookie(
    REFRESH_TOKEN_COOKIE,
    tokens.refresh_token,
    cookieOptions(REFRESH_TOKEN_MAX_AGE),
  );
}

export function clearAuthCookies(reply: FastifyReply) {
  reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
  reply.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });
}

export function setVerificationCookie(reply: FastifyReply, token: string) {
  reply.setCookie(
    VERIFICATION_TOKEN_COOKIE,
    token,
    cookieOptions(ACCESS_TOKEN_MAX_AGE),
  );
}

export function getSignedCookie(
  request: FastifyRequest,
  name: string,
): string | null {
  const cookieValue = request.cookies?.[name];
  if (!cookieValue) return null;

  const unsigned = request.unsignCookie(cookieValue);
  if (!unsigned.valid) return null;

  return unsigned.value;
}
