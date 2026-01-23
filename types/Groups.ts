import { Guest } from "./Player"

export type Group = {
  id: string
  name: string
  ownerId: string
  createdAt: number
  inviteCode: string

  // Les membres inscrits (ceux qui ont un compte Clerk)
  // Tableau d'IDs pour faciliter les règles de sécurité Firestore
  members: string[]

  // Les "Shadow Profiles" (Invités spécifiques à ce groupe)
  // On les stocke ici pour qu'ils soient persistants d'une partie à l'autre dans ce groupe.
  guests: Guest[]
}