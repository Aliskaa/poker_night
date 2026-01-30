import { YStack, XStack, type YStackProps } from 'tamagui'
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'

const AnimatedYStack = Animated.createAnimatedComponent(YStack)
const AnimatedXStack = Animated.createAnimatedComponent(XStack)

interface AnimatedContainerProps extends YStackProps {
  variant?: 'fade' | 'slide' | 'zoom'
  delay?: number
  children: React.ReactNode
}

/**
 * Container avec animation d'entrée/sortie
 */
export function AnimatedContainer({ 
  variant = 'fade',
  delay = 0,
  children,
  ...props 
}: AnimatedContainerProps) {
  const animations = {
    fade: {
      entering: FadeIn.delay(delay).duration(300),
      exiting: FadeOut.duration(200),
    },
    slide: {
      entering: SlideInRight.delay(delay).duration(400),
      exiting: SlideOutLeft.duration(300),
    },
    zoom: {
      entering: ZoomIn.delay(delay).duration(300),
      exiting: ZoomOut.duration(200),
    },
  }[variant]

  return (
    <AnimatedYStack
      entering={animations.entering}
      exiting={animations.exiting}
      {...props}
    >
      {children}
    </AnimatedYStack>
  )
}

/**
 * Wrapper pour animer une liste d'items
 */
interface AnimatedListProps {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  staggerDelay?: number
}

export function AnimatedList({ 
  items, 
  renderItem,
  staggerDelay = 50,
}: AnimatedListProps) {
  return (
    <>
      {items.map((item, index) => (
        <AnimatedContainer
          key={item.id || index}
          variant="slide"
          delay={index * staggerDelay}
        >
          {renderItem(item, index)}
        </AnimatedContainer>
      ))}
    </>
  )
}
