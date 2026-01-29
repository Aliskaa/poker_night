import { Tabs } from 'expo-router';
import { Home, Users, Trophy, User } from '@tamagui/lucide-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: '#0b0f19', // $night900
                    borderTopColor: 'rgba(0, 0, 0, 0.3)', // $overlay3
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#fbbf24', // $primary
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)', // $text40
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