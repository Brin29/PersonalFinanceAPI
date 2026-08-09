import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/token.utils";
import {
  getSignedCookie,
  ACCESS_TOKEN_COOKIE,
  VERIFICATION_TOKEN_COOKIE,
} from "../utils/cookie.utils";

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
    return reply.status(401).send({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (request as any).user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: "Token inválido o expirado" });
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
    return reply.status(401).send({
      error: "Token requerido",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (request as any).verification = decoded;
  } catch {
    return reply.status(401).send({
      error: "Token inválido o expirado",
    });
  }
}
