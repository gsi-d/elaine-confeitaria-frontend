import { Order } from "@/features/orders/types";
import { AuthUser } from "@/lib/auth/session";

function normalize(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim().toLowerCase();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function readNestedValue(record: Record<string, unknown>, key: string): unknown {
  const value = record[key];

  if (value && typeof value === "object") {
    return value;
  }

  return null;
}

function extractOwnershipMarkers(order: Order): { ids: Set<string>; emails: Set<string> } {
  const record = order as Record<string, unknown>;
  const nestedOwners = [
    readNestedValue(record, "usuario"),
    readNestedValue(record, "user"),
    readNestedValue(record, "cliente"),
  ].filter((value): value is Record<string, unknown> => Boolean(value));

  const ids = new Set<string>();
  const emails = new Set<string>();
  const idCandidates = [
    record.usuarioId,
    record.userId,
    record.clienteId,
    record.idUsuario,
    ...nestedOwners.map((owner) => owner.id),
  ];
  const emailCandidates = [
    record.usuarioEmail,
    record.userEmail,
    record.clienteEmail,
    record.email,
    ...nestedOwners.map((owner) => owner.email),
  ];

  for (const candidate of idCandidates) {
    const normalized = normalize(candidate);
    if (normalized) {
      ids.add(normalized);
    }
  }

  for (const candidate of emailCandidates) {
    const normalized = normalize(candidate);
    if (normalized) {
      emails.add(normalized);
    }
  }

  return { ids, emails };
}

export function filterOrdersForViewer(orders: Order[], user: AuthUser | null, isAdmin: boolean): Order[] {
  if (isAdmin) {
    return orders;
  }

  if (!user) {
    return [];
  }

  const userId = normalize(user.id);
  const userEmail = normalize(user.email);

  return orders.filter((order) => {
    const { ids, emails } = extractOwnershipMarkers(order);
    const hasOwnershipMetadata = ids.size > 0 || emails.size > 0;

    if (!hasOwnershipMetadata) {
      return false;
    }

    if (userId && ids.has(userId)) {
      return true;
    }

    if (userEmail && emails.has(userEmail)) {
      return true;
    }

    return false;
  });
}
