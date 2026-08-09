import { FastifyRequest, FastifyReply } from "fastify";
import { getParams } from "../services/params.service";

function getUserId(request: FastifyRequest) {
  return (request as any).user.id as string;
}

export async function getParamsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getUserId(request);

  return reply.send(await getParams(userId));
}
