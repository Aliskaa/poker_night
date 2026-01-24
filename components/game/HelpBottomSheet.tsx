import { Pause, Play, RotateCcw } from "@tamagui/lucide-icons";
import { Button, Card, H1, ScrollView, Separator, Sheet, Text, XStack, YStack } from "tamagui";

export function HelpBottomSheet({ isOpen, onOpenChange, timerSeconds, isTimerRunning, onToggleTimer, onResetTimer }: { isOpen: boolean, onOpenChange: (open: boolean) => void, timerSeconds: number, isTimerRunning: boolean, onToggleTimer: () => void, onResetTimer: () => void }) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <Sheet modal open={isOpen} onOpenChange={onOpenChange} snapPoints={[85]} dismissOnSnapToBottom>
            <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
            <Sheet.Handle />
            <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">

                {/* TIMER PREMIUM */}
                <Card bordered backgroundColor="$backgroundStrong" borderColor="$borderColor" padding="$4">
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack>
                            <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Prochaine Blinde</Text>
                            <H1 color={timerSeconds < 60 ? "$danger" : "$potGold"} fontSize="$8" fontWeight="900">
                                {formatTime(timerSeconds)}
                            </H1>
                        </YStack>
                        <XStack gap="$2">
                            <Button circular size="$5" backgroundColor="$background" borderColor="$borderColor" borderWidth={1} icon={<RotateCcw size={20} color="$colorMuted" />} onPress={onResetTimer} />
                            <Button circular size="$5" backgroundColor={isTimerRunning ? "$danger" : "$success"} color="white" icon={isTimerRunning ? <Pause size={20} /> : <Play size={20} />} onPress={onToggleTimer} />
                        </XStack>
                    </XStack>
                </Card>

                <Separator borderColor="$borderColor" />

                {/* AIDE MAINS */}
                <YStack flex={1} gap="$3">
                    <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Hiérarchie des mains</Text>
                    <ScrollView>
                        <YStack gap="$2" paddingBottom="$10">
                            <HandRow rank="1" name="Quinte Flush Royale" description="10, J, Q, K, A de même couleur" />
                            <HandRow rank="2" name="Quinte Flush" description="5 cartes consécutives de même couleur" />
                            <HandRow rank="3" name="Carré" description="4 cartes de même valeur" />
                            <HandRow rank="4" name="Full" description="Un Brelan + Une Paire" />
                            <HandRow rank="5" name="Couleur (Flush)" description="5 cartes de même couleur" />
                            <HandRow rank="6" name="Quinte (Suite)" description="5 cartes consécutives" />
                            <HandRow rank="7" name="Brelan" description="3 cartes de même valeur" />
                            <HandRow rank="8" name="Double Paire" description="Deux paires différentes" />
                            <HandRow rank="9" name="Paire" description="2 cartes de même valeur" />
                            <HandRow rank="10" name="Hauteur" description="La carte la plus haute" />
                        </YStack>
                    </ScrollView>
                </YStack>

            </Sheet.Frame>
        </Sheet>
    );
}

function HandRow({ rank, name, description }: { rank: string, name: string, description: string }) {
    return (
        <Card bordered backgroundColor="$backgroundStrong" borderColor="$borderColor">
            <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
                <Text color="$potGold" fontWeight="900" fontSize="$6" width={32} textAlign="center">#{rank}</Text>
                <YStack flex={1}>
                    <Text color="$color" fontWeight="bold" fontSize="$4">{name}</Text>
                    <Text color="$colorMuted" fontSize="$2">{description}</Text>
                </YStack>
            </Card.Header>
        </Card>
    );
}