import { YStack, XStack, Text, type YStackProps } from 'tamagui'
import { View } from 'react-native'
import { useMemo } from 'react'
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

interface BankrollChartProps extends Omit<YStackProps, 'children'> {
  data: { date: Date; profit: number; cumulativeProfit: number }[]
  height?: number
}

export function BankrollChart({ data, height = 200, ...props }: BankrollChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null

    const values = data.map((d) => d.cumulativeProfit)
    const maxValue = Math.max(...values, 0)
    const minValue = Math.min(...values, 0)
    const range = maxValue - minValue || 1

    return {
      values,
      maxValue,
      minValue,
      range,
      points: data.map((d, i) => ({
        x: (i / (data.length - 1 || 1)) * 100,
        y: ((maxValue - d.cumulativeProfit) / range) * 100,
        value: d.cumulativeProfit,
        date: d.date,
      })),
    }
  }, [data])

  if (!chartData || data.length === 0) {
    return (
      <YStack
        backgroundColor="$glass2"
        borderColor="$glass4"
        borderWidth={1}
        borderRadius="$6"
        padding="$4"
        height={height}
        justifyContent="center"
        alignItems="center"
        {...props}
      >
        <Text color="$colorTertiary" fontSize="$3">
          Aucune donnée disponible
        </Text>
      </YStack>
    )
  }

  const pathData = chartData.points
    .map((point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`
      return `L ${point.x} ${point.y}`
    })
    .join(' ')

  const isProfit = chartData.values[chartData.values.length - 1] >= 0

  return (
    <YStack
      backgroundColor="$glass2"
      borderColor="$glass4"
      borderWidth={1}
      borderRadius="$6"
      padding="$4"
      gap="$3"
      {...props}
    >
      {/* Titre */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text color="$colorPrimary" fontSize="$4" fontWeight="700">
          Évolution de la bankroll
        </Text>
        <Text
          color={isProfit ? '$success' : '$danger'}
          fontSize="$5"
          fontWeight="900"
          fontFamily="$mono"
        >
          {isProfit ? '+' : ''}
          {chartData.values[chartData.values.length - 1].toFixed(0)}€
        </Text>
      </XStack>

      {/* Graphique SVG simple */}
      <View style={{ height, width: '100%', position: 'relative' }}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {/* Ligne zéro */}
          {chartData.minValue < 0 && chartData.maxValue > 0 && (
             <Line
              x1="0"
              y1={((chartData.maxValue) / chartData.range) * 100}
              x2="100"
              y2={((chartData.maxValue) / chartData.range) * 100}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.3"
              strokeDasharray="2,2"
            />
          )}

          {/* Gradient de remplissage */}
          <Defs>
            <LinearGradient id="bankrollGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={isProfit ? '#10b981' : '#ef4444'}
                stopOpacity="0.3"
              />
              <Stop
                offset="100%"
                stopColor={isProfit ? '#10b981' : '#ef4444'}
                stopOpacity="0"
              />
            </LinearGradient>
          </Defs>

          {/* Zone remplie */}
          <Path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#bankrollGradient)"
          />

          {/* Ligne */}
          <Path
            d={pathData}
            fill="none"
            stroke={isProfit ? '#10b981' : '#ef4444'}
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {chartData.points.map((point, i) => (
            <Circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="1"
              fill={isProfit ? '#10b981' : '#ef4444'}
            />
          ))}
        </Svg>
      </View>

      {/* Légende */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text color="$colorTertiary" fontSize="$2">
          {data.length} partie{data.length > 1 ? 's' : ''}
        </Text>
        <XStack gap="$3">
          <XStack gap="$1" alignItems="center">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#10b981',
              }}
            />
            <Text color="$colorTertiary" fontSize="$2">
              Max: {chartData.maxValue.toFixed(0)}€
            </Text>
          </XStack>
          {chartData.minValue < 0 && (
            <XStack gap="$1" alignItems="center">
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#ef4444',
                }}
              />
              <Text color="$colorTertiary" fontSize="$2">
                Min: {chartData.minValue.toFixed(0)}€
              </Text>
            </XStack>
          )}
        </XStack>
      </XStack>
    </YStack>
  )
}
