import React, { useState } from 'react';
import { YStack, XStack, Text, Button as TamaguiButton } from 'tamagui';
import { Share2, Copy, Check, QrCode } from '@tamagui/lucide-icons';
import { Share, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { Card } from '@/components/primitives/Cards';
import { Button } from '@/components/primitives/Button';

// ═══════════════════════════════════════════════════════════════════
// 📱 QR CODE SHARE - Partage de partie via QR Code ou lien
// ═══════════════════════════════════════════════════════════════════

type QRCodeShareProps = {
  gameId: string;
  gameUrl: string;
  gameName?: string;
  buyIn?: number;
  onShare?: () => void;
  variant?: 'full' | 'compact';
};

export const QRCodeShare: React.FC<QRCodeShareProps> = ({
  gameId,
  gameUrl,
  gameName = 'Partie de poker',
  buyIn,
  onShare,
  variant = 'full',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(gameUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const message = [
        `♠️ Rejoins la partie: ${gameName}`,
        buyIn ? `Buy-in: ${buyIn}€` : '',
        '',
        gameUrl,
      ]
        .filter(Boolean)
        .join('\n');

      await Share.share({
        message,
        url: Platform.OS === 'ios' ? gameUrl : undefined,
      });

      onShare?.();
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  if (variant === 'compact') {
    return (
      <Card variant="glass" padding="md">
        <YStack gap="$3" alignItems="center">
          <Text fontSize="$3" fontWeight="600" color="$colorSecondary">
            Partager la partie
          </Text>

          <XStack gap="$2">
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check size={16} /> : <Copy size={16} />}
              onPress={handleCopyLink}
            >
              {copied ? 'Copié !' : 'Copier'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<Share2 size={16} />}
              onPress={handleShare}
            >
              Partager
            </Button>
          </XStack>
        </YStack>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="lg">
      <YStack gap="$4" alignItems="center">
        {/* Header */}
        <YStack gap="$1" alignItems="center">
          <XStack alignItems="center" gap="$2">
            <QrCode size={24} color="$primary" />
            <Text fontSize="$5" fontWeight="900" color="$colorPrimary">
              Inviter des joueurs
            </Text>
          </XStack>
          <Text fontSize="$3" color="$colorSecondary" textAlign="center">
            Scannez le QR code ou partagez le lien
          </Text>
        </YStack>

        {/* QR Code */}
        <YStack
          padding="$4"
          backgroundColor="$white"
          borderRadius="$5"
          alignItems="center"
          justifyContent="center"
        >
          <QRCode
            value={gameUrl}
            size={200}
            backgroundColor="white"
            color="black"
          />
        </YStack>

        {/* Game Info */}
        {(gameName || buyIn) && (
          <YStack
            padding="$3"
            backgroundColor="$surface2"
            borderRadius="$4"
            width="100%"
            gap="$1"
          >
            {gameName && (
              <Text fontSize="$4" fontWeight="700" color="$colorPrimary">
                {gameName}
              </Text>
            )}
            {buyIn && (
              <Text fontSize="$3" color="$colorSecondary">
                Buy-in: {buyIn}€
              </Text>
            )}
          </YStack>
        )}

        {/* Actions */}
        <YStack gap="$2" width="100%">
          <Button
            variant="secondary"
            icon={copied ? <Check size={20} /> : <Copy size={20} />}
            onPress={handleCopyLink}
          >
            {copied ? 'Lien copié !' : 'Copier le lien'}
          </Button>

          <Button
            variant="primary"
            icon={<Share2 size={20} />}
            onPress={handleShare}
          >
            Partager
          </Button>
        </YStack>

        {/* Link preview */}
        <XStack
          padding="$2"
          backgroundColor="$surface3"
          borderRadius="$3"
          width="100%"
        >
          <Text
            fontSize="$2"
            color="$colorMuted"
            numberOfLines={1}
            flex={1}
          >
            {gameUrl}
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════
// QR CODE SCANNER (pour rejoindre une partie)
// ═══════════════════════════════════════════════════════════════════
import { Camera } from 'expo-camera';

type QRCodeScannerProps = {
  onScan: (gameId: string) => void;
  onClose: () => void;
};

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onClose,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Extraire gameId de l'URL
    const gameIdMatch = data.match(/game\/([^?]+)/);
    if (gameIdMatch) {
      onScan(gameIdMatch[1]);
    }
  };

  if (hasPermission === null) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Text>Demande de permission caméra...</Text>
      </YStack>
    );
  }

  if (hasPermission === false) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" padding="$4">
        <Text fontSize="$5" color="$danger" textAlign="center">
          Accès à la caméra refusé
        </Text>
        <Button variant="primary" onPress={onClose}>
          Fermer
        </Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      <Camera
        style={{ flex: 1 }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <YStack flex={1} padding="$4" justifyContent="space-between">
          <YStack alignItems="center" gap="$2" paddingTop="$6">
            <Text fontSize="$5" fontWeight="900" color="$white">
              Scanner un QR Code
            </Text>
            <Text fontSize="$3" color="$white" opacity={0.8}>
              Placez le QR code dans le cadre
            </Text>
          </YStack>

          <YStack alignItems="center" gap="$4" paddingBottom="$6">
            {scanned && (
              <Button
                variant="primary"
                onPress={() => setScanned(false)}
              >
                Scanner à nouveau
              </Button>
            )}
            
            <Button variant="ghost" onPress={onClose}>
              Annuler
            </Button>
          </YStack>
        </YStack>
      </Camera>
    </YStack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <QRCodeShare 
//   gameId="abc123" 
//   gameUrl="https://pokernight.app/game/abc123"
//   gameName="Soirée Poker"
//   buyIn={20}
// />
//
// <QRCodeShare 
//   gameId="abc123" 
//   gameUrl="https://pokernight.app/game/abc123"
//   variant="compact"
// />
//
// <QRCodeScanner 
//   onScan={(gameId) => router.push(`/game/${gameId}`)}
//   onClose={() => setShowScanner(false)}
// />
