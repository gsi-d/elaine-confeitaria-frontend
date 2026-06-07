type JwtPayload = Record<string, unknown>;
export type AuthUser = {
  id?: string;
  nome?: string;
  email?: string;
  perfil?: string;
};

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  return atob(padded);
}

function parseJwtPayload(token: string): JwtPayload | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function resolveUserFromToken(token?: string): AuthUser | null {
  if (!token) {
    return null;
  }

  const payload = parseJwtPayload(token);

  if (!payload) {
    return null;
  }

  const id =
    payload.userId ??
    payload.usuarioId ??
    payload.id ??
    payload.sub;
  const nome =
    payload.nome ??
    payload.name ??
    payload.usuarioNome ??
    payload.userName;
  const email =
    payload.email ??
    payload.usuarioEmail ??
    payload.preferred_username;
  const perfil =
    payload.perfil ??
    payload.role ??
    payload.tipoUsuario ??
    payload.userType;

  return {
    id: typeof id === "string" || typeof id === "number" ? String(id) : undefined,
    nome: typeof nome === "string" ? nome : undefined,
    email: typeof email === "string" ? email : undefined,
    perfil: typeof perfil === "string" ? perfil.replaceAll("_", " ") : undefined,
  };
}

function includesAdminKeyword(value: unknown): boolean {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    return normalized.includes("admin") || normalized.includes("administrador");
  }

  if (Array.isArray(value)) {
    return value.some((item) => includesAdminKeyword(item));
  }

  return false;
}

export function resolveIsAdminFromToken(token?: string): boolean {
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);

  if (!payload) {
    return false;
  }

  return [
    payload.role,
    payload.roles,
    payload.perfil,
    payload.perfis,
    payload.userType,
    payload.tipoUsuario,
    payload.permissions,
  ].some((value) => includesAdminKeyword(value));
}
