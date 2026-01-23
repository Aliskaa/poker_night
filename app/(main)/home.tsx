import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Card, H3, H4, Avatar, Spinner } from 'tamagui';
import { Plus, Users, TrendingUp, ChevronRight, PlayCircle } from '@tamagui/lucide-icons';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useGameLogic } from '../../hooks/useGameLogic'; // <-- Import du Hook

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  
  const { createGame } = useGameLogic(); 
  
  // État de chargement pour le bouton (évite de cliquer 2 fois)
  const [isCreating, setIsCreating] = useState(false);

  // Mock data pour la V1 (sera remplacé plus tard par une vraie requête Firebase des parties "PLAYING")
  const activeGame = null; 

  // --- LA FONCTION MAGIQUE ---
  const handleCreateGame = async () => {
    setIsCreating(true);
    
    // 1. Création dans Firebase avec un buy-in de 5€ par défaut
    const newGameId = await createGame(5); 
    
    setIsCreating(false);

    // 2. Redirection vers la nouvelle table
    if (newGameId) {
      router.push(`/(main)/game/${newGameId}`);
    } else {
      alert("Impossible de créer la partie, vérifie ta connexion.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#121212' }}>
      <YStack padding="$4" space="$4">
        
        {/* Header Section */}
        <XStack alignItems="center" space="$3">
          <Avatar circular size="$5">
            <Avatar.Image src={user?.imageUrl} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
          <YStack>
            <Text color="$gray11" fontSize="$3">Bienvenue,</Text>
            <H3 color="$color">{user?.firstName || user?.username || "Joueur"}</H3>
          </YStack>
        </XStack>

        {/* Action Principale : Créer Table */}
        <Card bordered elevate size="$4" backgroundColor="$blue3">
          <Card.Header padded>
            <H4>Nouvelle Soirée Poker</H4>
            <Text theme="alt2">Lance une table et invite tes potes.</Text>
          </Card.Header>
          <Card.Footer padded>
            <Button 
              icon={isCreating ? <Spinner color="white" /> : <Plus size={18} />} 
              backgroundColor="$blue10" 
              color="white"
              disabled={isCreating}
              onPress={handleCreateGame}
            >
              {isCreating ? "Création en cours..." : "Créer une table"}
            </Button>
          </Card.Footer>
        </Card>

        {/* Section: Partie en cours (Exemple visuel) */}
        {activeGame ? (
          <YStack space="$2">
            <Text color="$gray11" fontWeight="bold" textTransform="uppercase" fontSize="$2">En Direct</Text>
            <Card bordered padding="$3" theme="green">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text fontWeight="bold" fontSize="$5">Table du Vendredi</Text>
                  <Text color="$gray11">Pot: 45€ • 5 Joueurs</Text>
                </YStack>
                <Button 
                  circular 
                  icon={<PlayCircle size={24} />} 
                  onPress={() => router.push(`/(main)/game/123`)}
                />
              </XStack>
            </Card>
          </YStack>
        ) : null}

        {/* Section: Stats Rapides */}
        <Text color="$gray11" fontWeight="bold" textTransform="uppercase" fontSize="$2" marginTop="$2">Ma Bankroll</Text>
        <XStack space="$3">
          <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong">
            <TrendingUp size={20} color="#4ade80" style={{ marginBottom: 8 }} />
            <Text color="$gray11" fontSize="$2">Profit Net</Text>
            <Text color="#4ade80" fontSize="$6" fontWeight="bold">+120€</Text>
          </Card>
          
          <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong">
            <Users size={20} color="#60a5fa" style={{ marginBottom: 8 }} />
            <Text color="$gray11" fontSize="$2">Parties Jouées</Text>
            <Text color="$color" fontSize="$6" fontWeight="bold">8</Text>
          </Card>
        </XStack>

        {/* Menu Navigation Rapide */}
        <YStack space="$2" marginTop="$2">
           <MenuItem icon={<Users />} title="Mes Groupes" subtitle="Gérer les potes et invités" />
           <MenuItem icon={<TrendingUp />} title="Classement Général" subtitle="Qui est le patron ?" />
        </YStack>

      </YStack>
    </ScrollView>
  );
}

// Composant local pour le menu
const MenuItem = ({ icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
  <XStack 
    backgroundColor="$backgroundStrong" 
    padding="$3" 
    borderRadius="$4" 
    alignItems="center" 
    space="$3"
    pressStyle={{ opacity: 0.8 }}
    onPress={() => console.log('Naviguer vers', title)}
  >
    <YStack backgroundColor="$gray4" padding="$2" borderRadius="$3">
      {React.cloneElement(icon, { size: 20, color: 'white' })}
    </YStack>
    <YStack flex={1}>
      <Text color="$color" fontWeight="bold">{title}</Text>
      <Text color="$gray10" fontSize="$2">{subtitle}</Text>
    </YStack>
    <ChevronRight size={20} color="gray" />
  </XStack>
);