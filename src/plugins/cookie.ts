import fp from "fastify-plugin";
import cookie from "@fastify/cookie";
import { env } from "../env";

export default fp(async (fastify) => {
  await fastify.register(cookie, {
    secret: env.COOKIE_SECRET,
  });
});
