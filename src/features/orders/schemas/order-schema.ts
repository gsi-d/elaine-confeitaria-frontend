import { z } from "zod";

export const orderItemSchema = z.object({
  produtoId: z.coerce.number().int().positive("Produto invalido."),
  quantidade: z.coerce.number().int().positive("Quantidade deve ser maior que zero."),
});

export const orderSchema = z
  .object({
    id: z.number().optional(),
    nomeRecebedor: z.string().trim().optional(),
    endereco: z.string().trim().optional(),
    complemento: z.string().trim().optional(),
    referencia: z.string().trim().optional(),
    tipoEntrega: z.enum(["ENTREGA", "RETIRADA"]),
    horarioEntrega: z.string().trim().optional(),
    horarioRetirada: z.string().trim().optional(),
    observacoes: z.string().trim().optional(),
    desconto: z.coerce.number().min(0, "Desconto nao pode ser negativo."),
    status: z.string().optional(),
    itens: z.array(orderItemSchema).min(1, "Informe pelo menos um item."),
  })
  .superRefine((value, context) => {
    if (value.tipoEntrega === "ENTREGA") {
      if (!value.nomeRecebedor) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nomeRecebedor"],
          message: "Informe o nome de quem vai receber.",
        });
      }

      if (!value.endereco) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endereco"],
          message: "Informe o endereco para entrega.",
        });
      }

      if (!value.horarioEntrega) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["horarioEntrega"],
          message: "Informe o melhor horario de entrega.",
        });
      }
    }

    if (value.tipoEntrega === "RETIRADA" && !value.horarioRetirada) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["horarioRetirada"],
        message: "Informe o horario de retirada.",
      });
    }
  });

export type OrderFormInput = z.input<typeof orderSchema>;
export type OrderFormValues = z.output<typeof orderSchema>;
