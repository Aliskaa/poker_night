import { Button, ButtonProps } from "tamagui";

interface IconButtonProps extends ButtonProps { }

export function IconButton({
    ...props
}: IconButtonProps) {
    return (
        <Button
            {...props}
            size="$6"
            pressStyle={{ scale: 0.9 }}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$4"
            gap="$1.5"
            alignItems="center"
            flexDirection="row"
            alignSelf="flex-start"
        />
    )
}