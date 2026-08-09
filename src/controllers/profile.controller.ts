import { FastifyRequest, FastifyReply } from "fastify";
import User from "../schema/user.schema";
import { EditProfileRequest } from "../dtos/auth.dto";
import { editUserProfile, changeUserAvatar } from "../services/auth.service";

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const { id } = (request as any).user;

  const user = await User.findById(id);

  if (!user) {
    return reply.status(404).send({ error: "Usuario no encontrado" });
  }

  return reply.send({
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

export async function editProfile(
  request: FastifyRequest<EditProfileRequest>,
  reply: FastifyReply,
) {
  const { id } = (request as any).user;
  const { firstName, lastName } = request.body.data;

  const { user } = await editUserProfile(id, firstName, lastName);

  return reply.send({
    message: "Perfil actualizado exitosamente",
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

export async function changeAvatar(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = (request as any).user;
  const file = await request.file({ limits: { fileSize: 5 * 1024 * 1024 } });

  const buffer = file ? await file.toBuffer() : undefined;
  const mimeType = file?.mimetype;

  const { user } = await changeUserAvatar(id, buffer, mimeType);

  return reply.send({
    message: "Avatar actualizado exitosamente",
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