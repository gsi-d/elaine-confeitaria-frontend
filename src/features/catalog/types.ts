export type CatalogProduct = {
  id: string;
  produtoId: number;
  nome: string;
  descricao: string;
  precoUnitario?: number;
  categoria: string;
  destaque?: string;
  tempoEntrega: string;
  cor: string;
  tamanho?: string;
  imagemUrl?: string;
  imagemAlt?: string;
};

type ApiProductRecord = Record<string, unknown>;
type ApiAttachmentRecord = Record<string, unknown>;

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const normalized = value.trim().replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function inferMimeType(attachment: ApiAttachmentRecord): string {
  const explicitMime =
    toStringValue(attachment.contentType) ??
    toStringValue(attachment.mimeType) ??
    toStringValue(attachment.tipoConteudo) ??
    toStringValue(attachment.mediaType);

  if (explicitMime) {
    return explicitMime;
  }

  const fileName =
    toStringValue(attachment.nomeArquivo) ??
    toStringValue(attachment.fileName) ??
    toStringValue(attachment.nome);

  if (!fileName) {
    return "image/png";
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/png";
  }
}

function toBase64DataUrl(value: string, mimeType: string): string {
  if (value.startsWith("data:")) {
    return value;
  }

  return `data:${mimeType};base64,${value}`;
}

function extractImageUrlFromAttachment(attachment: unknown): string | undefined {
  if (!attachment) {
    return undefined;
  }

  if (typeof attachment === "string") {
    return toBase64DataUrl(attachment.trim(), "image/png");
  }

  if (Array.isArray(attachment)) {
    for (const item of attachment) {
      const resolved = extractImageUrlFromAttachment(item);
      if (resolved) {
        return resolved;
      }
    }

    return undefined;
  }

  if (typeof attachment !== "object") {
    return undefined;
  }

  const record = attachment as ApiAttachmentRecord;
  const rawBase64 =
    toStringValue(record.base64) ??
    toStringValue(record.bytes) ??
    toStringValue(record.conteudo) ??
    toStringValue(record.conteudoBase64) ??
    toStringValue(record.arquivo) ??
    toStringValue(record.data);

  if (!rawBase64) {
    return undefined;
  }

  return toBase64DataUrl(rawBase64, inferMimeType(record));
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fallbackGradients = [
  "linear-gradient(135deg, #f7c6cf 0%, #f5e7da 100%)",
  "linear-gradient(135deg, #f3d8ef 0%, #f6eadf 100%)",
  "linear-gradient(135deg, #f9d9e5 0%, #eadff7 100%)",
  "linear-gradient(135deg, #f8e6d8 0%, #f7d7e4 100%)",
  "linear-gradient(135deg, #f4dce9 0%, #f1e5cf 100%)",
  "linear-gradient(135deg, #ecdaf6 0%, #f8e7dd 100%)",
];

function inferCategory(product: ApiProductRecord): string {
  const rawCategory =
    toStringValue(product.categoria) ??
    toStringValue(product.category) ??
    toStringValue(product.tipo) ??
    "Catalogo";

  return rawCategory
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function inferDescription(product: ApiProductRecord): string {
  return (
    toStringValue(product.descricao) ??
    toStringValue(product.description) ??
    toStringValue(product.descricaoCurta) ??
    "Produto disponivel para encomenda."
  );
}

function inferLeadTime(product: ApiProductRecord): string {
  return (
    toStringValue(product.tempoEntrega) ??
    toStringValue(product.tempo_preparo) ??
    toStringValue(product.tempoPreparo) ??
    "Consulte disponibilidade"
  );
}

function inferHighlight(product: ApiProductRecord): string | undefined {
  return (
    toStringValue(product.destaque) ??
    toStringValue(product.tag) ??
    toStringValue(product.badge) ??
    undefined
  );
}

export function mapApiProduct(product: unknown, index: number): CatalogProduct | null {
  if (!product || typeof product !== "object") {
    return null;
  }

  const record = product as ApiProductRecord;
  const produtoId =
    toNumber(record.produtoId) ??
    toNumber(record.id) ??
    toNumber(record.codigo) ??
    toNumber(record.productId);
  const nome =
    toStringValue(record.nome) ??
    toStringValue(record.name) ??
    toStringValue(record.titulo) ??
    toStringValue(record.title);
  const precoUnitario =
    toNumber(record.precoUnitario) ??
    toNumber(record.preco_unitario) ??
    toNumber(record.preco) ??
    toNumber(record.valor) ??
    toNumber(record.price);

  if (produtoId === null || nome === null) {
    return null;
  }

  return {
    id: slugify(`${produtoId}-${nome}`),
    produtoId,
    nome,
    descricao: inferDescription(record),
    precoUnitario: precoUnitario ?? undefined,
    categoria: inferCategory(record),
    destaque: inferHighlight(record),
    tempoEntrega: inferLeadTime(record),
    cor: fallbackGradients[index % fallbackGradients.length],
    tamanho: toStringValue(record.tamanho) ?? toStringValue(record.size) ?? undefined,
    imagemUrl:
      extractImageUrlFromAttachment(record.anexo) ??
      extractImageUrlFromAttachment(record.anexos) ??
      toStringValue(record.imagemUrl) ??
      toStringValue(record.imageUrl) ??
      undefined,
    imagemAlt: toStringValue(record.imagemAlt) ?? toStringValue(record.imageAlt) ?? nome,
  };
}
