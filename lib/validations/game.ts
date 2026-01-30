import { z } from 'zod';

export const GameConfigSchema = z.object({
  defaultBuyIn: z
    .number()
    .min(1, 'Le buy-in doit être au minimum de 1€')
    .max(10000, 'Le buy-in doit être inférieur à 10 000€'),
  
  defaultTimeBlindDuration: z
    .number()
    .min(1, 'La durée des blindes doit être au minimum de 1 minute')
    .max(120, 'La durée des blindes doit être inférieure à 120 minutes'),
  
  lateRegLimit: z
    .number()
    .min(0, 'La late registration ne peut pas être négative')
    .max(300, 'La late registration doit être inférieure à 5 heures'),
  
  payoutModel: z.enum(['50_30_20', 'winner_takes_all']),
});

export const PlayerSchema = z.object({
  id: z.string().min(1, 'ID du joueur requis'),
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom doit contenir moins de 50 caractères'),
  isGuest: z.boolean(),
  buyInCount: z.number().min(0),
  totalInvested: z.number().min(0),
  status: z.enum(['ACTIVE', 'ELIMINATED']),
  avatarUrl: z.string().optional(),
});

export const RebuySchema = z.object({
  playerId: z.string().min(1, 'ID du joueur requis'),
  amount: z.number().min(1).optional(),
});

export const EliminatePlayerSchema = z.object({
  playerId: z.string().min(1, 'ID du joueur requis'),
});

export const AddGuestSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom doit contenir moins de 50 caractères'),
  amount: z.number().min(1),
});

// Types inférés
export type GameConfig = z.infer<typeof GameConfigSchema>;
export type RebuyInput = z.infer<typeof RebuySchema>;
export type EliminatePlayerInput = z.infer<typeof EliminatePlayerSchema>;
export type AddGuestInput = z.infer<typeof AddGuestSchema>;
