# CheckPoint Games - Loja Virtual de Jogos Digitais

Loja virtual completa para venda de keys de jogos digitais com integração ao Mercado Pago.

## Arquitetura

### Frontend
- **Framework**: React 18 + TypeScript
- **Roteamento**: Wouter
- **Estilização**: Tailwind CSS + Shadcn UI
- **State Management**: React Context API (Auth + Cart)
- **Requisições**: Axios com interceptors Bearer Token
- **Queries**: TanStack Query (React Query)

### Backend
- **API Principal**: Java Spring Boot (porta 8080)
- **Servidor Frontend**: Express + Vite (porta 5000)
- **Autenticação**: Bearer Token (JWT)
- **Pagamentos**: Mercado Pago Checkout Pro

## Estrutura do Projeto

```
client/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes Shadcn
│   │   ├── admin/         # Componentes admin (Sidebar, Layout)
│   │   ├── Header.tsx
│   │   ├── GameCard.tsx
│   │   ├── Filters.tsx
│   │   └── CartDrawer.tsx
│   ├── contexts/          # Context API
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── lib/               # Utilities
│   │   ├── api.ts         # Axios client com interceptors
│   │   ├── queryClient.ts # React Query setup
│   │   └── utils.ts
│   ├── pages/             # Páginas
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── GameDetail.tsx
│   │   ├── Checkout.tsx
│   │   ├── Orders.tsx
│   │   ├── PaymentCallback.tsx
│   │   └── admin/         # Páginas admin
│   │       ├── Dashboard.tsx
│   │       ├── Games.tsx
│   │       ├── Orders.tsx
│   │       ├── Keys.tsx
│   │       └── Users.tsx
│   └── App.tsx            # Router principal
shared/
└── schema.ts              # TypeScript schemas compartilhados
```

## Funcionalidades

### Interface Cliente
- ✅ Catálogo de jogos com grid responsivo
- ✅ Filtros por categoria e faixa de preço (slider)
- ✅ Busca por nome de jogo
- ✅ Carrinho de compras (drawer lateral)
- ✅ Checkout com redirecionamento para Mercado Pago
- ✅ Autenticação (Login/Registro)
- ✅ Histórico de pedidos com chaves dos jogos
- ✅ Página de detalhes do jogo
- ✅ Callback de pagamento do Mercado Pago

### Painel Administrativo
- ✅ Dashboard com métricas e estatísticas
- ✅ Gestão de Jogos (CRUD completo)
  - Adicionar, editar, excluir jogos
  - Aplicar descontos
  - Ativar/bloquear jogos
- ✅ Gestão de Pedidos
  - Visualizar todos os pedidos
  - Filtrar por status (pendente/finalizado/cancelado)
  - Atualizar status manualmente
- ✅ Gestão de Chaves
  - Adicionar chaves em lote
  - Filtrar por jogo e status
  - Visualizar estatísticas (ativas/usadas/canceladas)
- ✅ Gestão de Usuários
  - Visualizar todos os usuários
  - Bloquear/desbloquear usuários
  - Ver estatísticas de usuários

## API Endpoints (Backend Java)

### Públicos (sem autenticação)
```
POST   /api/v1/users/createUser       - Criar conta
POST   /api/v1/users/updatePassword   - Atualizar senha
POST   /api/v1/auth/login             - Login
GET    /api/v1/games/showGames        - Listar todos os jogos
GET    /api/v1/games/showActivityGames - Listar jogos ativos
GET    /api/v1/games/showGamesById/:id - Detalhes do jogo
```

### Protegidos (requerem Bearer Token)
```
POST   /api/v1/orders/create          - Criar pedido
GET    /api/v1/orders/user            - Pedidos do usuário

# Admin apenas
POST   /api/v1/games/create           - Criar jogo
PUT    /api/v1/games/update/:id       - Atualizar jogo
DELETE /api/v1/games/delete/:id       - Deletar jogo
PUT    /api/v1/games/updateStatus/:id - Atualizar status

GET    /api/v1/orders/all             - Todos os pedidos
PUT    /api/v1/orders/updateStatus/:id - Atualizar status

POST   /api/v1/keys/create            - Adicionar chaves
GET    /api/v1/keys/all               - Listar todas as chaves

GET    /api/v1/users/all              - Listar usuários
PUT    /api/v1/users/updateStatus/:id - Bloquear/desbloquear
```

## Status Codes

### Jogos e Usuários
- `0` = Ativo
- `1` = Bloqueado

### Chaves de Jogos
- `0` = Ativa (disponível)
- `1` = Usada (vendida)
- `2` = Cancelada

### Pedidos
- `0` = Pendente
- `1` = Finalizado
- `2` = Cancelado

## Configuração

### Variáveis de Ambiente
```
VITE_API_URL=http://localhost:8080
```

### Requisitos Backend Java
- Habilitar CORS para http://localhost:5000
- Configurar Bearer Token JWT
- Configurar credenciais do Mercado Pago
- Configurar BACKURLS no PaymentService.java:
  - Success: http://localhost:5000/payment/callback?status=approved
  - Failure: http://localhost:5000/payment/callback?status=failure
  - Pending: http://localhost:5000/payment/callback?status=pending

## Como Usar

### Desenvolvimento
1. Certifique-se que o backend Java está rodando na porta 8080
2. Inicie o frontend: o workflow "Start application" roda `npm run dev`
3. Acesse http://localhost:5000

### Criar Conta Admin
1. Registre-se normalmente pela interface
2. No backend Java, atualize o campo `isAdmin = true` para o usuário no banco de dados
3. Faça login novamente e acesse /admin

### Fluxo de Compra
1. Cliente navega pelo catálogo
2. Adiciona jogos ao carrinho
3. Finaliza compra (requer login)
4. Redirecionado para Mercado Pago
5. Após pagamento, recebe chaves por email
6. Visualiza pedido em "Meus Pedidos"

## Design

- **Cores Primárias**: Roxo/Azul gaming (#7C3AED)
- **Tipografia**: Inter (corpo) + Rajdhani (headings)
- **Componentes**: Shadcn UI
- **Responsivo**: Mobile-first
- **Dark Mode**: Suportado

## Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- TanStack Query
- Wouter
- Axios
- React Hook Form
- Zod
- Lucide Icons

## Suporte

Para problemas com:
- **Frontend**: Verificar console do navegador
- **Backend**: Verificar logs do servidor Java
- **Pagamentos**: Verificar dashboard do Mercado Pago
