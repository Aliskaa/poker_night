import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { LineChart } from 'react-native-gifted-charts';
import { Card } from '@/components/primitives/Cards';

// ═══════════════════════════════════════════════════════════════════
// 📈 PROFIT CHART - Graphique d'évolution du profit
// ═══════════════════════════════════════════════════════════════════

type ProfitDataPoint = {
  date: string;
  profit: number;
  label?: string;
};

type ProfitChartProps = {
  data: ProfitDataPoint[];
  period?: '7d' | '30d' | '90d' | 'all';
  onPeriodChange?: (period: ProfitChartProps['period']) => void;
};

export const ProfitChart: React.FC<ProfitChartProps> = ({
  data,
  period = '30d',
  onPeriodChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState(period);

  // Préparer les données pour le graphique
  const chartData = data.map((point) => ({
    value: point.profit,
    label: point.label || point.date,
    dataPointText: `${point.profit >= 0 ? '+' : ''}${point.profit}€`,
  }));

  // Calculer les statistiques
  const totalProfit = data.reduce((sum, point) => sum + point.profit, 0);
  const maxProfit = Math.max(...data.map((p) => p.profit));
  const minProfit = Math.min(...data.map((p) => p.profit));
  const avgProfit = totalProfit / data.length;

  const handlePeriodChange = (newPeriod: ProfitChartProps['period']) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const periodLabels = {
    '7d': '7 jours',
    '30d': '30 jours',
    '90d': '90 jours',
    all: 'Tout',
  };

  return (
    <Card variant="glass" padding="lg">
      <YStack gap="$4">
        {/* Header */}
        <YStack gap="$2">
          <Text fontSize="$5" fontWeight="900" color="$colorPrimary">
            Évolution du Profit
          </Text>
          
          {/* Period Selector */}
          <XStack gap="$2">
            {Object.keys(periodLabels).map((p) => {
              const isSelected = p === selectedPeriod;
              return (
                <XStack
                  key={p}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  backgroundColor={isSelected ? '$goldBg' : '$surface2'}
                  borderRadius="$3"
                  onPress={() => handlePeriodChange(p as ProfitChartProps['period'])}
                  cursor="pointer"
                >
                  <Text
                    fontSize="$2"
                    fontWeight={isSelected ? '700' : '500'}
                    color={isSelected ? '$primary' : '$colorMuted'}
                  >
                    {periodLabels[p]}
                  </Text>
                </XStack>
              );
            })}
          </XStack>
        </YStack>

        {/* Stats Summary */}
        <XStack gap="$3" flexWrap="wrap">
          <YStack flex={1} minWidth="30%" gap="$1">
            <Text fontSize="$2" color="$colorMuted">
              Total
            </Text>
            <Text
              fontSize="$4"
              fontWeight="900"
              color={totalProfit >= 0 ? '$success' : '$danger'}
            >
              {totalProfit >= 0 ? '+' : ''}{totalProfit}€
            </Text>
          </YStack>

          <YStack flex={1} minWidth="30%" gap="$1">
            <Text fontSize="$2" color="$colorMuted">
              Maximum
            </Text>
            <Text fontSize="$4" fontWeight="700" color="$success">
              +{maxProfit}€
            </Text>
          </YStack>

          <YStack flex={1} minWidth="30%" gap="$1">
            <Text fontSize="$2" color="$colorMuted">
              Moyenne
            </Text>
            <Text fontSize="$4" fontWeight="700" color="$colorSecondary">
              {avgProfit >= 0 ? '+' : ''}{Math.round(avgProfit)}€
            </Text>
          </YStack>
        </XStack>

        {/* Chart */}
        <YStack paddingVertical="$3">
          <LineChart
            data={chartData}
            width={300}
            height={200}
            spacing={40}
            color="$primary"
            thickness={3}
            startFillColor="rgba(251, 191, 36, 0.3)"
            endFillColor="rgba(251, 191, 36, 0.05)"
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={0}
            noOfSections={5}
            yAxisColor="$borderColor"
            xAxisColor="$borderColor"
            yAxisTextStyle={{ color: '$colorMuted', fontSize: 12 }}
            xAxisLabelTextStyle={{ color: '$colorMuted', fontSize: 10 }}
            areaChart
            curved
            showDataPointOnPress
            showStripOnPress
            stripColor="rgba(255, 255, 255, 0.1)"
            stripHeight={200}
            dataPointsColor="$primary"
            dataPointsRadius={4}
            textColor="$colorPrimary"
            textFontSize={12}
            textShiftY={-10}
            hideDataPoints={data.length > 20}
          />
        </YStack>
      </YStack>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SIMPLE LINE CHART (alternative sans dépendance)
// ═══════════════════════════════════════════════════════════════════
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

export const SimpleProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  const width = 300;
  const height = 200;
  const padding = 40;

  const maxProfit = Math.max(...data.map((p) => p.profit));
  const minProfit = Math.min(...data.map((p) => p.profit), 0);
  const range = maxProfit - minProfit;

  // Générer les points du graphique
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((point.profit - minProfit) / range) * (height - padding * 2);
    return { x, y, profit: point.profit };
  });

  // Créer le path SVG
  const pathData = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  return (
    <Card variant="glass" padding="lg">
      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="900" color="$colorPrimary">
          Évolution du Profit
        </Text>

        <Svg width={width} height={height}>
          {/* Ligne zéro */}
          <Line
            x1={padding}
            y1={height - padding - ((0 - minProfit) / range) * (height - padding * 2)}
            x2={width - padding}
            y2={height - padding - ((0 - minProfit) / range) * (height - padding * 2)}
            stroke="#444"
            strokeWidth={1}
            strokeDasharray="5,5"
          />

          {/* Path principal */}
          <Path
            d={pathData}
            stroke="#fbbf24"
            strokeWidth={3}
            fill="none"
          />

          {/* Points de données */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={point.profit >= 0 ? '#10b981' : '#ef4444'}
            />
          ))}
        </Svg>
      </YStack>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// const profitData = [
//   { date: '2024-01-01', profit: 50 },
//   { date: '2024-01-02', profit: -20 },
//   { date: '2024-01-03', profit: 150 },
// ];
//
// <ProfitChart 
//   data={profitData} 
//   period="30d"
//   onPeriodChange={(period) => console.log(period)}
// />
//
// <SimpleProfitChart data={profitData} />
