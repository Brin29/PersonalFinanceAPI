export interface ErrorDefinition {
  status: number;
  code: string;
  message: string;
  description: string;
}

export interface SuccessDefinition {
  status: number;
  code: string;
  message: string;
  description: string;
}

export const ERROR_CODES = {
  INTERNAL_ERROR: {
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Error interno del servidor",
    description:
      "Ocurrió un error inesperado en el servidor que no pudo ser clasificado.",
  },
  VALIDATION_ERROR: {
    status: 400,
    code: "VALIDATION_ERROR",
    message: "Error de validación de los datos enviados",
    description:
      "Los datos enviados en la petición no cumplen con el esquema esperado.",
  },
  RATE_LIMIT_EXCEEDED: {
    status: 429,
    code: "RATE_LIMIT_EXCEEDED",
    message: "Demasiadas solicitudes. Intenta de nuevo más tarde",
    description:
      "El usuario superó el límite de solicitudes permitidas en un período de tiempo.",
  },
  USER_NOTFOUND: {
    status: 404,
    code: "USER_NOTFOUND",
    message: "Usuario no encontrado",
    description: "El usuario solicitado no existe o fue eliminado.",
  },
  INVALID_CREDENTIALS: {
    status: 401,
    code: "INVALID_CREDENTIALS",
    message: "Credenciales inválidas",
    description: "El correo o la contraseña proporcionados son incorrectos.",
  },
  TOKEN_REQUIRED: {
    status: 401,
    code: "TOKEN_REQUIRED",
    message: "Token no proporcionado",
    description: "La petición no incluye un token de acceso.",
  },
  INVALID_TOKEN: {
    status: 401,
    code: "INVALID_TOKEN",
    message: "Token inválido o expirado",
    description: "El token de acceso es inválido o ha expirado.",
  },
  REFRESH_TOKEN_REQUIRED: {
    status: 401,
    code: "REFRESH_TOKEN_REQUIRED",
    message: "Refresh token no proporcionado",
    description: "La petición no incluye un refresh token.",
  },
  INVALID_REFRESH_TOKEN: {
    status: 401,
    code: "INVALID_REFRESH_TOKEN",
    message: "Refresh token inválido o expirado",
    description: "El refresh token es inválido o ha expirado.",
  },
  EMAIL_ALREADY_REGISTERED: {
    status: 400,
    code: "EMAIL_ALREADY_REGISTERED",
    message: "El correo electrónico ya está registrado",
    description:
      "Ya existe una cuenta asociada al correo electrónico proporcionado.",
  },
  CODE_INVALID_OR_EXPIRED: {
    status: 400,
    code: "CODE_INVALID_OR_EXPIRED",
    message: "Código inválido o expirado",
    description:
      "El código de verificación no existe, ya fue usado o ha expirado.",
  },
  CODE_INVALID: {
    status: 400,
    code: "CODE_INVALID",
    message: "Código inválido",
    description: "El código de verificación proporcionado es incorrecto.",
  },
  CODE_TOO_MANY_ATTEMPTS: {
    status: 429,
    code: "CODE_TOO_MANY_ATTEMPTS",
    message: "Demasiados intentos. Solicita un nuevo código",
    description:
      "Se superó el límite de intentos del código de verificación.",
  },
  MAGIC_TOKEN_INVALID_OR_EXPIRED: {
    status: 401,
    code: "MAGIC_TOKEN_INVALID_OR_EXPIRED",
    message: "Token inválido o expirado",
    description: "El enlace mágico es inválido o ha expirado.",
  },
  NO_FIELDS_TO_UPDATE: {
    status: 400,
    code: "NO_FIELDS_TO_UPDATE",
    message: "Debe proporcionar al menos un campo para actualizar",
    description: "La solicitud de actualización no incluye ningún campo.",
  },
  IMAGE_REQUIRED: {
    status: 400,
    code: "IMAGE_REQUIRED",
    message: "Debe proporcionar una imagen",
    description: "El avatar requiere un archivo de imagen.",
  },
  INVALID_IMAGE_FORMAT: {
    status: 400,
    code: "INVALID_IMAGE_FORMAT",
    message: "Formato de imagen no permitido",
    description:
      "El formato del archivo no está entre los aceptados (jpeg, png, webp, gif).",
  },
  IMAGE_TOO_LARGE: {
    status: 400,
    code: "IMAGE_TOO_LARGE",
    message: "La imagen supera el tamaño máximo permitido (5MB)",
    description: "El archivo de imagen excede el tamaño máximo permitido.",
  },
  INVALID_ID: {
    status: 400,
    code: "INVALID_ID",
    message: "ID inválido",
    description: "El identificador proporcionado no es un ObjectId válido.",
  },
  INVALID_CATEGORY_TYPE: {
    status: 400,
    code: "INVALID_CATEGORY_TYPE",
    message: "Tipo de categoría inválido",
    description: "El tipo debe ser 'income' o 'expense'.",
  },
  CATEGORY_NAME_REQUIRED: {
    status: 400,
    code: "CATEGORY_NAME_REQUIRED",
    message: "Debe proporcionar un nombre para actualizar",
    description: "El nombre de la categoría es obligatorio.",
  },
  CATEGORY_NAME_TAKEN: {
    status: 400,
    code: "CATEGORY_NAME_TAKEN",
    message: "Ya existe una categoría con este nombre",
    description:
      "El nombre de la categoría ya está en uso por otra categoría del usuario.",
  },
  CATEGORY_NOTFOUND: {
    status: 404,
    code: "CATEGORY_NOTFOUND",
    message: "Categoría no encontrada",
    description: "La categoría solicitada no existe.",
  },
  CATEGORY_NOT_EDITABLE: {
    status: 404,
    code: "CATEGORY_NOT_EDITABLE",
    message: "Categoría no encontrada o no se puede editar",
    description:
      "La categoría no existe, no pertenece al usuario o no puede ser editada.",
  },
  CATEGORY_NOT_DELETABLE: {
    status: 404,
    code: "CATEGORY_NOT_DELETABLE",
    message: "Categoría no encontrada o no se puede eliminar",
    description:
      "La categoría no existe, no pertenece al usuario o no puede ser eliminada.",
  },
  INVALID_CATEGORY: {
    status: 400,
    code: "INVALID_CATEGORY",
    message: "Categoría inválida o no pertenece al usuario",
    description:
      "La categoría de la transacción no existe o no pertenece al usuario.",
  },
  TRANSACTION_NOTFOUND: {
    status: 404,
    code: "TRANSACTION_NOTFOUND",
    message: "Transacción no encontrada",
    description:
      "La transacción solicitada no existe o no pertenece al usuario.",
  },
  INVALID_PERIOD: {
    status: 400,
    code: "INVALID_PERIOD",
    message: "Período inválido",
    description: "El período debe ser 7d, 30d, 3m o 6m.",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export const SUCCESS_CODES = {
  USER_REGISTERED: {
    status: 201,
    code: "USER_REGISTERED",
    message: "Usuario registrado exitosamente",
    description: "La cuenta del usuario fue creada correctamente.",
  },
  LOGIN_SUCCESS: {
    status: 200,
    code: "LOGIN_SUCCESS",
    message: "Inicio de sesión exitoso",
    description: "El usuario inició sesión correctamente.",
  },
  LOGOUT_SUCCESS: {
    status: 200,
    code: "LOGOUT_SUCCESS",
    message: "Sesión cerrada exitosamente",
    description: "La sesión del usuario fue cerrada correctamente.",
  },
  ACCOUNT_DELETED: {
    status: 200,
    code: "ACCOUNT_DELETED",
    message: "Cuenta eliminada exitosamente",
    description: "La cuenta del usuario fue eliminada junto con sus datos.",
  },
  EMAIL_CHECKED: {
    status: 200,
    code: "EMAIL_CHECKED",
    message: "Consulta de correo completada",
    description: "Se verificó si el correo electrónico existe en el sistema.",
  },
  MAGIC_LINK_SENT: {
    status: 200,
    code: "MAGIC_LINK_SENT",
    message: "Se ha enviado un enlace de acceso a su correo electrónico",
    description: "El enlace mágico fue generado y enviado por correo.",
  },
  CODE_SENT: {
    status: 200,
    code: "CODE_SENT",
    message: "Código enviado exitosamente",
    description: "El código de verificación fue generado y enviado por correo.",
  },
  CODE_VERIFIED: {
    status: 200,
    code: "CODE_VERIFIED",
    message: "Código verificado exitosamente",
    description: "El código de verificación fue validado correctamente.",
  },
  TOKEN_REFRESHED: {
    status: 200,
    code: "TOKEN_REFRESHED",
    message: "Token renovado exitosamente",
    description: "El access token fue renovado correctamente.",
  },
  MAGIC_LOGIN_SUCCESS: {
    status: 200,
    code: "MAGIC_LOGIN_SUCCESS",
    message: "Login exitoso",
    description: "El usuario inició sesión mediante enlace mágico.",
  },
  CATEGORIES_LISTED: {
    status: 200,
    code: "CATEGORIES_LISTED",
    message: "Categorías obtenidas exitosamente",
    description: "Las categorías fueron listadas correctamente.",
  },
  CATEGORY_CREATED: {
    status: 201,
    code: "CATEGORY_CREATED",
    message: "Categoría creada exitosamente",
    description: "La categoría fue creada correctamente.",
  },
  CATEGORY_UPDATED: {
    status: 200,
    code: "CATEGORY_UPDATED",
    message: "Categoría actualizada exitosamente",
    description: "La categoría fue actualizada correctamente.",
  },
  CATEGORY_DELETED: {
    status: 200,
    code: "CATEGORY_DELETED",
    message: "Categoría eliminada exitosamente",
    description: "La categoría fue eliminada u ocultada correctamente.",
  },
  TRANSACTION_CREATED: {
    status: 201,
    code: "TRANSACTION_CREATED",
    message: "Transacción creada exitosamente",
    description: "La transacción fue creada correctamente.",
  },
  TRANSACTION_UPDATED: {
    status: 200,
    code: "TRANSACTION_UPDATED",
    message: "Transacción actualizada exitosamente",
    description: "La transacción fue actualizada correctamente.",
  },
  TRANSACTION_DELETED: {
    status: 200,
    code: "TRANSACTION_DELETED",
    message: "Transacción eliminada exitosamente",
    description: "La transacción fue eliminada correctamente.",
  },
  TRANSACTIONS_LISTED: {
    status: 200,
    code: "TRANSACTIONS_LISTED",
    message: "Transacciones obtenidas exitosamente",
    description: "Las transacciones fueron listadas correctamente.",
  },
  SUMMARY_GENERATED: {
    status: 200,
    code: "SUMMARY_GENERATED",
    message: "Resumen generado exitosamente",
    description: "El resumen financiero fue generado correctamente.",
  },
  PROFILE_FETCHED: {
    status: 200,
    code: "PROFILE_FETCHED",
    message: "Perfil obtenido exitosamente",
    description: "El perfil del usuario fue obtenido correctamente.",
  },
  PROFILE_UPDATED: {
    status: 200,
    code: "PROFILE_UPDATED",
    message: "Perfil actualizado exitosamente",
    description: "El perfil del usuario fue actualizado correctamente.",
  },
  AVATAR_UPDATED: {
    status: 200,
    code: "AVATAR_UPDATED",
    message: "Avatar actualizado exitosamente",
    description: "El avatar del usuario fue actualizado correctamente.",
  },
  PARAMS_RETRIEVED: {
    status: 200,
    code: "PARAMS_RETRIEVED",
    message: "Parámetros obtenidos exitosamente",
    description: "Los parámetros del sistema fueron obtenidos correctamente.",
  },
} as const;

export type SuccessCode = keyof typeof SUCCESS_CODES;

export const errorResponseSchema = {
  type: "object",
  properties: {
    code: {
      type: "string",
      description: "Código de error personalizado para el frontend",
    },
    message: {
      type: "string",
      description: "Descripción del error",
    },
  },
};
