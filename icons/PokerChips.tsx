import { Circle, Svg, SvgProps } from 'react-native-svg';

export const PokerTokenIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="4" />
  </Svg>
);