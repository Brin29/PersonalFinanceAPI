import User from "../schema/user.schema";
import { uploadAvatar } from "../utils/cloudinary.utils";

export async function getUserById(id: string) {
  const user = await User.findById(id);
  if (!user) throw { status: 404, message: "Usuario no encontrado" };
  return user;
}

export async function editUserProfile(
  userId: string,
  firstName?: string,
  lastName?: string,
) {
  if (!firstName && !lastName)
    throw {
      status: 400,
      message: "Debe proporcionar al menos un campo para actualizar",
    };

  const updateData: Record<string, string> = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

  if (!user) throw { status: 400, message: "Usuario no encontrado" };

  return { user };
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_SIZE_MB = 5;

export async function changeUserAvatar(
  userId: string,
  buffer?: Buffer,
  mimeType?: string,
) {
  if (!buffer || buffer.byteLength === 0)
    throw { status: 400, message: "Debe proporcionar una imagen" };

  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType))
    throw {
      status: 400,
      message: `Formato no permitido. Formatos aceptados: ${ALLOWED_MIME_TYPES.join(", ")}`,
    };

  const sizeMB = buffer.byteLength / (1024 * 1024);
  if (sizeMB > MAX_SIZE_MB)
    throw {
      status: 400,
      message: `La imagen no puede superar los ${MAX_SIZE_MB}MB`,
    };

  const { url } = await uploadAvatar(buffer, userId);

  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: url },
    { new: true },
  );

  if (!user) throw { status: 404, message: "Usuario no encontrado" };

  return { user };
}