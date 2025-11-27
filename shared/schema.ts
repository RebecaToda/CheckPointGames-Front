import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  isAdmin: z.boolean().default(false),
  status: z.number(),
  age: z.number().optional(),
  number: z.string().optional(),
  profileImage: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  number: z.string().min(8, "Telefone é obrigatório"),
});

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const gameSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discount: z.number().default(0),
  inventory: z.number().default(0),
  finalPrice: z.number(),
  category: z.string(),
  coverImage: z.string(),
  screenshots: z.array(z.string()).optional(),
  platform: z.array(z.string()).optional(),
  status: z.number(),
});

export const createGameSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().positive("Preço deve ser maior que zero"),
  discount: z.number().min(0).max(100).default(0),
  inventory: z
    .number()
    .int()
    .min(0, "Estoque não pode ser negativo")
    .default(0),
  category: z.string().min(1, "Categoria é obrigatória"),
  coverImage: z.string().url("URL da imagem inválida"),
  screenshots: z.array(z.string().url()).optional(),
  platform: z.array(z.string()).optional(),
});

export const updateGameSchema = createGameSchema.partial();

export type Game = z.infer<typeof gameSchema>;
export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;

export const gameKeySchema = z.object({
  id: z.number(),
  gameId: z.number(),
  gameTitle: z.string().optional(),
  key: z.string(),
  status: z.number(),
  createdAt: z.string().optional(),
});

export const createGameKeySchema = z.object({
  gameId: z.number(),
  keys: z.array(z.string().min(1, "Chave não pode estar vazia")),
});

export type GameKey = z.infer<typeof gameKeySchema>;
export type CreateGameKeyInput = z.infer<typeof createGameKeySchema>;

export const orderItemSchema = z.object({
  gameId: z.number(),
  gameTitle: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const orderSchema = z.object({
  id: z.number(),
  userId: z.number().optional(),
  costumer: userSchema.optional(),
  userName: z.string().optional(),
  items: z.array(orderItemSchema),
  total: z.number(),
  status: z.number(),
  paymentLink: z.string().optional(),
  createdAt: z.string(),
  keys: z.array(gameKeySchema).optional(),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        gameId: z.number(),
        quantity: z.number().positive(),
      })
    )
    .min(1, "Pedido deve ter pelo menos um item"),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export interface CartItem {
  game: Game;
  quantity: number;
}

export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  message?: string;
  timestamp?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateOrderResponse {
  status: number;
  paymentLink: string;
  orderId: number;
  timestamp: string;
  message: string;
}

export interface GameFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "az" | "za" | "price_asc" | "price_desc";
}
