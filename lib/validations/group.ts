import { z } from 'zod';

export const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom du groupe doit contenir au moins 2 caractères')
    .max(100, 'Le nom du groupe doit contenir moins de 100 caractères'),
});

export const JoinGroupSchema = z.object({
  inviteCode: z
    .string()
    .min(3, 'Le code d\'invitation doit contenir au moins 3 caractères')
    .max(20, 'Le code d\'invitation est invalide'),
});

export const AddGuestToGroupSchema = z.object({
  guestName: z
    .string()
    .min(2, 'Le nom de l\'invité doit contenir au moins 2 caractères')
    .max(50, 'Le nom de l\'invité doit contenir moins de 50 caractères'),
});

// Types inférés
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export type JoinGroupInput = z.infer<typeof JoinGroupSchema>;
export type AddGuestToGroupInput = z.infer<typeof AddGuestToGroupSchema>;
