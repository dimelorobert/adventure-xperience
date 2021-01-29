import { verify } from "jsonwebtoken";
const { SECRET_KEY } = process.env;

export async function onlyUsersAuthenticated(request, response, next) {
  const { authorization } = request.headers;

  // we check if reequest has an authorization in headers
  if (!authorization) {
    return response.status(401).send({
      message: "Debes estar registrado para tener acceso a esta sección",
    });
  }

  // we check if user token is admin or not
  try {
    const { is_admin } = verify(authorization, SECRET_KEY);

    if(is_admin === 0 || is_admin === 1)
    // else user get access
    next();
  } catch (error) {
    response.status(401).send({
      message: "La sesión ha expirado, vuelve a iniciar sesión",
    });
  }
}


export async function onlyAdmins(request, response, next) {
  const { authorization } = request.headers;

  // we check if reequest has an authorization in headers
  if (!authorization) {
    return response.status(401).send({
      message: "Debes estar registrado para tener acceso a esta sección",
    });
  }

  // we check if user token is admin or not
  try {
    const { is_admin } = verify(authorization, SECRET_KEY);

    if (is_admin !== 1) {
      return response.status(403).send({
        message: "No tienes permisos de administrador",
      });
    }
    // else user get access
    next();
  } catch (error) {
    response.status(401).send({
      message: "La sesión ha expirado, vuelve a iniciar sesión",
    });
  }
}
