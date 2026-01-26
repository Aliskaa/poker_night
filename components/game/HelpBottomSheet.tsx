import { Pause, Play, RotateCcw } from "@tamagui/lucide-icons";
import { Button, Card, H1, ScrollView, Separator, Sheet, Text, XStack, YStack } from "tamagui";
import { HAND_RANKINGS } from '@/constants/poker';    // <-- Import données
import { HandRow } from '@/components/poker/HandRow'; // <-- Import composant

export function HelpBottomSheet({ isOpen, onOpenChange, timerSeconds, isTimerRunning, onToggleTimer, onResetTimer }: { isOpen: boolean, onOpenChange: (open: boolean) => void, timerSeconds: number, isTimerRunning: boolean, onToggleTimer: () => void, onResetTimer: () => void }) {
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <Sheet modal open={isOpen} onOpenChange={onOpenChange} snapPoints={[85]} dismissOnSnapToBottom>
            <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
            <Sheet.Handle backgroundColor="rgba(255,255,255,0.2)" />
            <Sheet.Frame padding="$4" gap="$4" backgroundColor="#064e3b">

                {/* TIMER PREMIUM */}
                <Card bordered backgroundColor="rgba(0,0,0,0.3)" borderColor="rgba(255,255,255,0.1)" padding="$4">
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack>
                            <Text color="rgba(255,255,255,0.6)" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Prochaine Blinde</Text>
                            <H1 color={timerSeconds < 60 ? "$danger" : "$potGold"} fontSize="$8" fontWeight="900">
                                {formatTime(timerSeconds)}
                            </H1>
                        </YStack>
                        <XStack gap="$2">
                            <Button circular size="$5" backgroundColor="transparent" borderColor="rgba(255,255,255,0.2)" borderWidth={1} icon={<RotateCcw size={20} color="white" />} onPress={onResetTimer} />
                            <Button circular size="$5" backgroundColor={isTimerRunning ? "$danger" : "$success"} color="white" icon={isTimerRunning ? <Pause size={20} /> : <Play size={20} />} onPress={onToggleTimer} />
                        </XStack>
                    </XStack>
                </Card>

                <Separator borderColor="rgba(255,255,255,0.1)" />

                {/* AIDE MAINS (Réutilisée !) */}
                <YStack flex={1} gap="$3">
                    <Text color="rgba(255,255,255,0.6)" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Hiérarchie des mains</Text>
                    <ScrollView>
                        <YStack gap="$3" paddingBottom="$10">
                            {HAND_RANKINGS.map((hand) => (
                                <HandRow key={hand.rank} hand={hand} />
                            ))}
                        </YStack>
                    </ScrollView>
                </YStack>

            </Sheet.Frame>
        </Sheet>
    );
}