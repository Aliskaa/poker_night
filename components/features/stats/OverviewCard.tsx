import React from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { TrendingUp, TrendingDown, DollarSign, Award, Target, Percent } from '@tamagui/lucide-icons';
import { Card } from '@/components/primitives/Cards';

// ═══════════════════════════════════════════════════════════════════
// 📊 OVERVIEW CARD - Carte de statistiques récapitulative
// ═══════════════════════════════════════════════════════════════════

type StatData = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
};

type OverviewCardProps = {
  title: string;
  stats: StatData[];
  variant?: 'default' | 'compact';
};

export const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  stats,
  variant = 'default',
}) => {
  const getColorScheme = (scheme?: StatData['colorScheme']) => {
    switch (scheme) {
      case 'success':
        return { bg: '$successBg', color: '$success' };
      case 'warning':
        return { bg: '$warningBg', color: '$warning' };
      case 'danger':
        return { bg: '$dangerBg', color: '$danger' };
      case 'info':
        return { bg: '$infoBg', color: '$info' };
      default:
        return { bg: '$goldBg', color: '$primary' };
    }
  };

  const getTrendIcon = (direction: StatData['trend']['direction']) => {
    if (direction === 'up') return <TrendingUp size={12} color="$success" />;
    if (direction === 'down') return <TrendingDown size={12} color="$danger" />;
    return null;
  };

  if (variant === 'compact') {
    return (
      <Card variant="glass" padding="md">
        <YStack gap="$3">
          <Text fontSize="$4" fontWeight="700" color="$colorPrimary">
            {title}
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            {stats.map((stat, idx) => (
              <YStack key={idx} flex={1} minWidth="45%" gap="$1">
                <Text fontSize="$2" color="$colorMuted">
                  {stat.label}
                </Text>
                <Text fontSize="$4" fontWeight="900" color="$colorPrimary">
                  {stat.value}
                </Text>
              </YStack>
            ))}
          </XStack>
        </YStack>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="lg">
      <YStack gap="$4">
        <Text fontSize="$5" fontWeight="900" color="$colorPrimary">
          {title}
        </Text>

        <YStack gap="$3">
          {stats.map((stat, idx) => {
            const colors = getColorScheme(stat.colorScheme);
            return (
              <XStack
                key={idx}
                padding="$3"
                backgroundColor="$surface2"
                borderRadius="$4"
                alignItems="center"
                justifyContent="space-between"
              >
                {/* Icon + Label */}
                <XStack gap="$3" alignItems="center" flex={1}>
                  <View
                    width={40}
                    height={40}
                    borderRadius="$4"
                    backgroundColor={colors.bg}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {stat.icon}
                  </View>

                  <YStack flex={1}>
                    <Text fontSize="$3" color="$colorSecondary">
                      {stat.label}
                    </Text>
                    {stat.trend && (
                      <XStack gap="$1" alignItems="center">
                        {getTrendIcon(stat.trend.direction)}
                        <Text
                          fontSize="$2"
                          color={
                            stat.trend.direction === 'up'
                              ? '$success'
                              : stat.trend.direction === 'down'
                              ? '$danger'
                              : '$colorMuted'
                          }
                        >
                          {stat.trend.value}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </XStack>

                {/* Value */}
                <Text fontSize="$5" fontWeight="900" color={colors.color}>
                  {stat.value}
                </Text>
              </XStack>
            );
          })}
        </YStack>
      </YStack>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PRESET STAT CARDS
// ═══════════════════════════════════════════════════════════════════

type PerformanceStatsProps = {
  totalProfit: number;
  totalGames: number;
  winRate: number;
  roi: number;
  avgPosition: number;
  variant?: 'default' | 'compact';
};

export const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  totalProfit,
  totalGames,
  winRate,
  roi,
  avgPosition,
  variant,
}) => {
  const stats: StatData[] = [
    {
      label: 'Profit Total',
      value: `${totalProfit >= 0 ? '+' : ''}${totalProfit}€`,
      icon: <DollarSign size={20} color="$primary" />,
      colorScheme: totalProfit >= 0 ? 'success' : 'danger',
      trend: {
        direction: totalProfit >= 0 ? 'up' : 'down',
        value: `${Math.abs(roi)}% ROI`,
      },
    },
    {
      label: 'Parties Jouées',
      value: totalGames,
      icon: <Target size={20} color="$info" />,
      colorScheme: 'info',
    },
    {
      label: 'Taux de Victoire',
      value: `${winRate}%`,
      icon: <Award size={20} color="$success" />,
      colorScheme: 'success',
    },
    {
      label: 'Position Moyenne',
      value: avgPosition.toFixed(1),
      icon: <Percent size={20} color="$warning" />,
      colorScheme: 'warning',
    },
  ];

  return (
    <OverviewCard title="Performances" stats={stats} variant={variant} />
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <OverviewCard 
//   title="Vue d'ensemble"
//   stats={[
//     { label: 'Profit', value: '+450€', icon: <DollarSign />, colorScheme: 'success' },
//     { label: 'Parties', value: 24, icon: <Target /> }
//   ]}
// />
//
// <PerformanceStats 
//   totalProfit={450}
//   totalGames={24}
//   winRate={42}
//   roi={25}
//   avgPosition={2.8}
// />
