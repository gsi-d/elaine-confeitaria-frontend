# Elaine Confeitaria Frontend

Aplicação frontend da Elaine Confeitaria construída com `Next.js`, `React`, `TypeScript` e `MUI`. O projeto atende dois contextos principais:

- clientes, que navegam no catálogo, montam o carrinho e acompanham seus pedidos;
- administradores, que acompanham a operação, consultam pedidos e ajustam a configuração de entrega.

## Stack

- `Next.js` com App Router
- `React 19`
- `TypeScript`
- `MUI` e `MUI X Data Grid`
- `TanStack Query`
- `React Hook Form` + `Zod`
- `Axios`
- `Vitest` + Testing Library

## Principais fluxos implementados

- autenticação por `JWT`, com token em cookie e sessão do usuário em `localStorage`;
- catálogo de produtos consumido da API, com suporte a imagem por `imagemUrl`/`imageUrl` e fallback para `anexo`/`anexos`;
- carrinho persistido em `localStorage`, com escopo separado para visitante e usuário autenticado;
- checkout com criação de pedido via API;
- pedidos feitos sem login armazenados localmente para consulta posterior no fluxo de visitante;
- área `Meus pedidos` para cliente autenticado ou visitante com pedidos locais;
- área administrativa com listagem, edição, remoção e atualização de status de pedidos;
- configuração de entrega com prazo mínimo, prazo máximo e mensagem livre;
- cards de resumo na home administrativa baseados em dados reais carregados da API.

## Rotas atuais

### Públicas

- `/` redireciona para `/home`
- `/login`
- `/cadastro`
- `/home`
- `/catalogo`
- `/carrinho`
- `/meus-pedidos`

### Administrativas ou contextuais

- `/pedidos`
- `/operacao`
- `/configuracoes`

Observações:

- o menu lateral adapta os links conforme autenticação, perfil administrativo e existência de pedidos locais;
- o middleware atualmente só redireciona usuários autenticados que tentam acessar `/login` ou `/cadastro`;
- o controle mais fino de visibilidade hoje acontece no cliente, via contexto de autenticação e composição do menu.

## Regras de comportamento relevantes

### Autenticação e sessão

- o login usa `POST /auth/login`;
- o cadastro usa `POST /usuarios`;
- o token é enviado no header `Authorization: Bearer <token>` em todas as chamadas autenticadas;
- o `AuthProvider` restaura a sessão no cliente após a hidratação para evitar mismatch entre SSR e browser.

### Pedidos

- a listagem principal usa `GET /pedidos`;
- criação, edição, remoção e atualização de status usam a mesma base `/pedidos`;
- a tela `Meus pedidos` aplica filtro de posse no frontend para usuário comum, usando campos como `usuarioId`, `userId`, `clienteId`, `usuarioEmail`, `userEmail` ou objetos aninhados equivalentes;
- se a API não devolver metadados de vínculo do pedido com o usuário, pedidos sem dono explícito ficam ocultos em `Meus pedidos`;
- pedidos de visitante continuam sendo gravados em `localStorage` e só aparecem para o fluxo não autenticado.

### Catálogo e imagens

- o catálogo usa `GET /produtos`;
- a imagem do produto prioriza `imagemUrl` ou `imageUrl`;
- se a URL não existir, a aplicação tenta montar a imagem a partir de `anexo` ou `anexos` em base64.

### Entrega

- a configuração de entrega usa `GET /configuracao-entrega` e `PUT /configuracao-entrega`;
- prazo estimado e mensagem livre aparecem em catálogo, home, carrinho e configurações.

## Estrutura resumida

```text
src/
  app/
    (dashboard)/
      home/
      catalogo/
      carrinho/
      meus-pedidos/
      pedidos/
      operacao/
      configuracoes/
    cadastro/
    login/
  components/
  config/
  features/
    auth/
    cart/
    catalog/
    delivery-config/
    orders/
  lib/
  providers/
```

## Configuração

1. Instale as dependências.
2. Configure a URL da API.
3. Inicie o servidor de desenvolvimento.

Exemplo de variável obrigatória:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Observação:

- se a variável não for definida, o frontend usa `http://localhost:3000` como fallback interno.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
```

## Testes existentes

O projeto já possui cobertura automatizada para partes críticas do comportamento atual, incluindo:

- formatação utilitária;
- schemas de autenticação e pedido;
- prioridade de imagem de produto com fallback para anexo;
- restauração de sessão no contexto de autenticação;
- filtragem de visibilidade de pedidos por usuário;
- contagem de pedidos ativos.

## Dependências da API

Para o frontend funcionar corretamente, o backend precisa expor ao menos:

- `POST /auth/login`
- `POST /usuarios`
- `GET /produtos`
- `GET /pedidos`
- `POST /pedidos`
- `PUT /pedidos/:id`
- `PATCH /pedidos/:id/status`
- `DELETE /pedidos/:id`
- `GET /configuracao-entrega`
- `PUT /configuracao-entrega`

## Limitações atuais

- a separação definitiva entre pedidos do usuário e pedidos de terceiros deve ser garantida no backend; o frontend hoje aplica uma contenção adicional na tela `Meus pedidos`;
- parte dos indicadores administrativos do banner da home ainda usa valores estáticos de apresentação, enquanto o card `Pedidos ativos` já usa contagem real da API.
