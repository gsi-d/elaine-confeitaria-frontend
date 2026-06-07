export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatStatusLabel(value?: string) {
  if (!value) {
    return "-";
  }

  return value.replaceAll("_", " ");
}

export function formatDeliveryTypeLabel(value?: string) {
  if (value === "ENTREGA") {
    return "Entrega";
  }

  if (value === "RETIRADA") {
    return "Retirada";
  }

  return value ?? "-";
}

export function formatDeliveryEstimate(minMinutes?: number, maxMinutes?: number) {
  if (
    typeof minMinutes !== "number" ||
    typeof maxMinutes !== "number" ||
    !Number.isFinite(minMinutes) ||
    !Number.isFinite(maxMinutes)
  ) {
    return "Consulte disponibilidade";
  }

  if (minMinutes === maxMinutes) {
    return `${minMinutes} min`;
  }

  return `${minMinutes}-${maxMinutes} min`;
}

export function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}
