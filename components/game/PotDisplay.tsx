import { YStack, XStack, Text, type YStackProps } from 'tamagui'
import { Trophy, TrendingUp } from '@tamagui/lucide-icons'
import { ChipStack } from '../ui/ChipStack'
import { PAYOUT_MODELS } from '@/constants/game'
import type { GameConfig } from '@/types/Game'

interface PotDisplayProps extends Omit<YStackProps, 'children'> {
  totalPot: number
  playerCount: number
  payoutModel: keyof typeof PAYOUT_MODELS
  defaultBuyIn?: number
  showPayoutPreview?: boolean
}

export function PotDisplay({
  totalPot,
  playerCount,
  payoutModel,
  defaultBuyIn,
  showPayoutPreview = true,
  ...props
}: PotDisplayProps) {
  const model = PAYOUT_MODELS[payoutModel]
  
  // Calculer la distribution du pot
  const calculatePayouts = () => {
    if (!model || totalPot === 0) return []
    
    const payouts: { rank: number; amount: number; percentage: number }[] = []
    
    // Convertir payout object en array
    const distribution = [
      { rank: 1, percentage: model.payout.first },
      { rank: 2, percentage: model.payout.second },
      { rank: 3, percentage: model.payout.third },
    ].filter(p => p.percentage > 0)
    
    distribution.forEach(({ rank, percentage }) => {
      const amount = Math.floor(totalPot * percentage)
      payouts.push({
        rank,
        amount,
        percentage: percentage * 100,
      })
    })
    
    return payouts.sort((a, b) => a.rank - b.rank)
  }
  
  const payouts = showPayoutPreview ? calculatePayouts() : []

  return (
    <YStack
      backgroundColor="$goldBg"
      borderColor="$primary"
      borderWidth={2}
      borderRadius="$7"
      padding="$4"
      gap="$3"
      alignItems="center"
      elevation={8}
      shadowColor="$primary"
      shadowOpacity={0.3}
      shadowRadius={16}
      {...props}
    >
      {/* Label */}
      <XStack gap="$2" alignItems="center">
        <Trophy size={16} color="$primary" />
        <Text 
          color="$primary" 
          fontSize="$3" 
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing={1}
        >
          Prize Pool
        </Text>
      </XStack>
      
      {/* Montant principal */}
      <ChipStack 
        amount={totalPot} 
        variant="pot" 
        size="lg"
        showIcon={false}
      />
      
      {/* Info joueurs */}
      <Text color="$primary" fontSize="$2" opacity={0.8}>
        {playerCount} joueur{playerCount > 1 ? 's' : ''} • {model.title}
      </Text>
      
      {/* Preview distribution */}
      {showPayoutPreview && payouts.length > 0 && totalPot > 0 && (
        <YStack 
          backgroundColor="rgba(0,0,0,0.2)"
          borderRadius="$5"
          padding="$3"
          width="100%"
          gap="$2"
        >
          <XStack gap="$2" alignItems="center" marginBottom="$1">
            <TrendingUp size={12} color="$primary" />
            <Text 
              color="$primary" 
              fontSize="$2" 
              fontWeight="600"
              opacity={0.9}
            >
              Distribution
            </Text>
          </XStack>
          
          {payouts.map((payout) => (
            <XStack 
              key={payout.rank}
              justifyContent="space-between" 
              alignItems="center"
            >
              <XStack gap="$2" alignItems="center">
                <YStack
                  width={24}
                  height={24}
                  borderRadius="$round"
                  backgroundColor={payout.rank === 1 ? '$primary' : '$glass3'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text 
                    color={payout.rank === 1 ? '$night900' : '$colorSecondary'}
                    fontSize="$2"
                    fontWeight="700"
                  >
                    {payout.rank}
                  </Text>
                </YStack>
                <Text color="$primary" fontSize="$3" opacity={0.8}>
                  {payout.percentage}%
                </Text>
              </XStack>
              
              <Text 
                fontFamily="$mono"
                fontSize="$4"
                fontWeight="700"
                color="$primary"
              >
                {payout.amount}€
              </Text>
            </XStack>
          ))}
        </YStack>
      )}
    </YStack>
  )
}

// Version compacte pour header ou sidebar
export function PotDisplayCompact({
  totalPot,
  playerCount,
  ...props
}: Pick<PotDisplayProps, 'totalPot' | 'playerCount'> & YStackProps) {
  return (
    <YStack
      backgroundColor="$goldBg"
      borderColor="$primary"
      borderWidth={1}
      borderRadius="$6"
      padding="$3"
      gap="$1"
      alignItems="center"
      {...props}
    >
      <Text 
        color="$primary" 
        fontSize="$2" 
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        Pot
      </Text>
      <ChipStack 
        amount={totalPot} 
        variant="pot" 
        size="sm"
        showIcon={false}
      />
      <Text color="$primary" fontSize="$1" opacity={0.7}>
        {playerCount} joueur{playerCount > 1 ? 's' : ''}
      </Text>
    </YStack>
  )
}
