import { randomBytes } from "node:crypto";
import fp from "fastify-plugin";
import oauthPlugin from "@fastify/oauth2";
import { env } from "../env";
import { buildOAuthState } from "../utils/oauthState.utils";

export default fp(async (fastify) => {
  fastify.register(oauthPlugin, {
    name: "githubOAuth2",

    credentials: {
      client: {
        id: env.GITHUB_CLIENT_ID!,
        secret: env.GITHUB_CLIENT_SECRET!,
      },

      auth: {
        authorizeHost: "https://github.com",
        authorizePath: "/login/oauth/authorize",

        tokenHost: "https://github.com",
        tokenPath: "/login/oauth/access_token",
      },
    },

    startRedirectPath: "/auth/github",

    callbackUri: env.GITHUB_CALLBACK_URL!,

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
