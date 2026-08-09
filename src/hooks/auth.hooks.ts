import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/token.utils";
import {
  getSignedCookie,
  ACCESS_TOKEN_COOKIE,
  VERIFICATION_TOKEN_COOKIE,
} from "../utils/cookie.utils";
import { ERROR_CODES } from "../errors/responseCodes";

function extractBearerToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token =
    getSignedCookie(request, ACCESS_TOKEN_COOKIE) ??
    extractBearerToken(request);

  if (!token) {
    return reply.status(ERROR_CODES.TOKEN_REQUIRED.status).send({
      code: ERROR_CODES.TOKEN_REQUIRED.code,
      message: ERROR_CODES.TOKEN_REQUIRED.message,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (request as any).user = decoded;
  } catch (error) {
    return reply.status(ERROR_CODES.INVALID_TOKEN.status).send({
      code: ERROR_CODES.INVALID_TOKEN.code,
      message: ERROR_CODES.INVALID_TOKEN.message,
    });
  }
}

export async function verifyVerificationToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token =
    getSignedCookie(request, VERIFICATION_TOKEN_COOKIE) ??
    extractBearerToken(request);

  if (!token) {
    return reply.status(ERROR_CODES.TOKEN_REQUIRED.status).send({
      code: ERROR_CODES.TOKEN_REQUIRED.code,
      message: ERROR_CODES.TOKEN_REQUIRED.message,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (request as any).verification = decoded;
  } catch {
    return reply.status(ERROR_CODES.INVALID_TOKEN.status).send({
      code: ERROR_CODES.INVALID_TOKEN.code,
      message: ERROR_CODES.INVALID_TOKEN.message,
    });
  }
}
