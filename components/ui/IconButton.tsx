import { Button, type ButtonProps } from "tamagui";
import type { ReactNode } from 'react';

interface IconButtonProps extends ButtonProps {
    icon?: ReactNode;
    label?: string;
    size?: 'small' | 'medium' | 'large';
}

export function IconButton({
    icon,
    label,
    size = 'medium',
    children,
    ...props
}: IconButtonProps) {
    const sizeConfig = {
        small: { buttonSize: '$3', padding: '$1.5' },
        medium: { buttonSize: '$4', padding: '$2' },
        large: { buttonSize: '$5', padding: '$3' },
    }[size];

    return (
        <Button
            size={sizeConfig.buttonSize}
            pressStyle={{ scale: 0.9 }}
            paddingHorizontal={sizeConfig.padding}
            paddingVertical={sizeConfig.padding}
            borderRadius="$4"
            gap="$2"
            alignItems="center"
            flexDirection="row"
            alignSelf="flex-start"
            {...props}
        >
            {icon}
            {label}
            {children}
        </Button>
    )
}