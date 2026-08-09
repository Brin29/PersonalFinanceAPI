import { FastifyRequest, FastifyReply } from "fastify";
import { getParams } from "../services/params.service";
import { SUCCESS_CODES } from "../errors/responseCodes";

function getUserId(request: FastifyRequest) {
  return (request as any).user.id as string;
}

export async function getParamsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getUserId(request);

  const params = await getParams(userId);

  return reply.send({
    code: SUCCESS_CODES.PARAMS_RETRIEVED.code,
    message: SUCCESS_CODES.PARAMS_RETRIEVED.message,
    ...params,
  });
}
