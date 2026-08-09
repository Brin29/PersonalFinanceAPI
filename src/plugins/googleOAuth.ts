import { randomBytes } from "node:crypto";
import fastifyOauth2, { type FastifyOAuth2Options } from "@fastify/oauth2";
import type { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { env } from "../env";
import { buildOAuthState } from "../utils/oauthState.utils";

export default fp(async (fastify) => {
  fastify.register(fastifyOauth2 as FastifyPluginCallback<FastifyOAuth2Options>, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/auth/google",
    callbackUri: `${env.REDIRECT_URL}`,
    generateStateFunction: (request) => {
      const query = request.query as Record<string, string | undefined>;
      return buildOAuthState(query.from, randomBytes);
    },
    checkStateFunction: async (request) => {
      const query = request.query as Record<string, string | undefined>;
      const state = query.state;
      const stateCookie = request.cookies["oauth2-redirect-state"];
      return !!stateCookie && state === stateCookie;
    },
  });
});
