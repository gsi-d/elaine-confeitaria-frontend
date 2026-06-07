import { z } from "zod";

export const signupSchema = z.object({
  email: z.email("Informe um e-mail valido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  endereco: z.string().min(5, "Informe um endereco valido."),
  telefone: z.string().min(10, "Informe um telefone valido."),
  cpf: z.string().length(11, "O CPF deve conter 11 digitos."),
  dataNascimento: z.iso.date("Informe uma data de nascimento valida."),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
