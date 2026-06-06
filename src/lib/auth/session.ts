type JwtPayload = Record<string, unknown>;

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
