import { Home, Plus, Trophy, User, Users } from '@tamagui/lucide-icons';
import { Tabs, useRouter } from 'expo-router';
import { View } from 'tamagui';

export default function TabLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {{
                    backgroundColor: '$night900',
                    borderTopColor: '$borderColor',
                    height: 60,
                    paddingBottom: 8,
                }},
                tabBarActiveTintColor: '$primary',
                tabBarInactiveTintColor: '$colorMuted',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="groups"
                options={{
                    title: 'Mes Clubs',
                    tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="play"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fbbf24', // $potGold
                                height: 56,
                                width: 56,
                                borderRadius: 28,
                                marginBottom: 20, // Fait remonter le bouton au-dessus de la barre
                                shadowColor: '#fbbf24',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 5, // Ombre sur Android
                                borderWidth: 4,
                                borderColor: '#0b0f19' // Couleur du fond pour simuler une découpe
                            }}>
                            <Plus size={30} color="#1c1917" />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push('/(main)/create-game');
                    },
                }}
            />

            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: 'Classement',
                    tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}