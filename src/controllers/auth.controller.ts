import { FastifyRequest, FastifyReply } from "fastify";
import User from "../schema/user.schema";
import {
  RegisterRequest,
  LoginRequest,
  CodeGenerateRequest,
  VerifyCodeRequestType,
  CheckEmailRequest,
  MagicLinkGenerateRequest,
  VerifyMagicTokenRequest,
} from "../dtos/auth.dto";

import {
  loginUser,
  registerUser,
  refreshUserToken,
  loginWithGoogle,
  loginWithGithub,
  deleteUserAccount,
} from "../services/auth.service";
import {
  generateMagicLink,
  verifyMagicLink,
} from "../services/magicLink.service";
import {
  generateCode,
  verificationCode,
} from "../services/verificationCode.service";

import {
  setAuthCookies,
  clearAuthCookies,
  setVerificationCookie,
  getSignedCookie,
  REFRESH_TOKEN_COOKIE,
} from "../utils/cookie.utils";

import { parseOAuthState } from "../utils/oauthState.utils";

import { env } from "../env";

function oauthSuccessRedirect(request: FastifyRequest): string {
  const query = request.query as Record<string, string | undefined>;
  const from = parseOAuthState(query.state);
  if (!from || from === "/") return `${env.FRONTEND_URL}/oauth-success`;
  const url = new URL("/oauth-success", env.FRONTEND_URL);
  url.searchParams.set("from", from);
  return url.toString();
}

export async function register(
  request: FastifyRequest<RegisterRequest>,
  reply: FastifyReply,
) {
  const verification = (request as any).verification;
  const { firstName, lastName, password } = request.body.data as any;

  const userData = {
    firstName,
    lastName,
    email: verification.email,
    password,
  };

  const { tokens, user } = await registerUser(userData);

  setAuthCookies(reply, tokens);

  return reply.status(201).send({
    message: "Usuario registrado exitosamente",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
}

export async function GithubCallBack(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token } = await (
    request.server as any
  ).githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

  const githubResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const githubUser = await githubResponse.json();

  // const emailsResponse = await fetch("https://api.github.com/user/emails", {
  //   headers: {
  //     Authorization: `Bearer ${token.access_token}`,
  //   },
  // });

  const { tokens } = await loginWithGithub(githubUser);

  setAuthCookies(reply, tokens);

  return reply.redirect(oauthSuccessRedirect(request));
}

export async function GoogleCallBack(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token } = await (
    request.server as any
  ).googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    },
  );

  const googleUser = await response.json();

  const { tokens } = await loginWithGoogle(googleUser);

  setAuthCookies(reply, tokens);

  return reply.redirect(oauthSuccessRedirect(request));
}

export async function login(
  request: FastifyRequest<LoginRequest>,
  reply: FastifyReply,
) {
  const { email, password } = request.body.data;
  const { tokens, user } = await loginUser(email, password);

  setAuthCookies(reply, tokens);

  return reply.send({
    message: "Inicio de sesión exitoso",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      provider: user.provider,
      email: user.email,
      role: user.role,
    },
  });
}

export async function logout(_: unknown, reply: FastifyReply) {
  clearAuthCookies(reply);

  return reply.send({
    message: "Sesión cerrada exitosamente",
  });
}

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = (request as any).user;

  await deleteUserAccount(id);

  clearAuthCookies(reply);

  return reply.send({
    message: "Cuenta eliminada exitosamente",
  });
}

export async function checkEmail(
  request: FastifyRequest<CheckEmailRequest>,
  reply: FastifyReply,
) {
  const { email } = request.body.data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return reply.status(200).send({
      exists: true,
    });
  } else {
    return reply.status(200).send({
      exists: false,
    });
  }
}

export async function magicLinkGenerate(
  request: FastifyRequest<MagicLinkGenerateRequest>,
  reply: FastifyReply,
) {
  const { email } = request.body.data;
  await generateMagicLink(email);

  return reply.status(200).send({
    message: "Se ha enviado un enlace de acceso a su correo electrónico",
  });
}

export async function codeGenerate(
  request: FastifyRequest<CodeGenerateRequest>,
  reply: FastifyReply,
) {
  const { email } = request.body.data;
  const { code } = await generateCode(email);

  return reply.status(200).send({
    code: code,
    message: "Codigo enviado exitosamente",
  });
}

export async function verifyCode(
  request: FastifyRequest<VerifyCodeRequestType>,
  reply: FastifyReply,
) {
  const { email, code } = request.body.data;
  const { verificationToken } = await verificationCode(email, code);

  setVerificationCookie(reply, verificationToken);

  return reply.status(200).send({
    message: "Código verificado exitosamente",
  });
}

export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = request.body as any;
  const refresh_token =
    getSignedCookie(request, REFRESH_TOKEN_COOKIE) ??
    body?.data?.refresh_token;

  if (!refresh_token) {
    return reply.status(401).send({ error: "Refresh token no proporcionado" });
  }

  const { tokens, user } = await refreshUserToken(refresh_token);

  setAuthCookies(reply, tokens);

  return reply.send({
    message: "Token renovado exitosamente",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
}

export async function verifyMagicToken(
  request: FastifyRequest<VerifyMagicTokenRequest>,
  reply: FastifyReply,
) {
  const { magic_token } = request.body.data;
  const { tokens, user } = await verifyMagicLink(magic_token);

  setAuthCookies(reply, tokens);

  return reply.send({
    message: "Login exitoso",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
}
