export const PAYOUT_MODELS = {
  '50_30_20': {
    payout: { first: 0.5, second: 0.3, third: 0.2 },
    title: '50% - 30% - 20%',
    description: 'Le premier reçoit 50% du pot, le deuxième 30% et le troisième 20%.'
  },
  'winner_takes_all': {
    payout: { first: 1, second: 0, third: 0 },
    title: 'Gagnant prend tout',
    description: 'Le gagnant prend tout le pot.'
  },
};