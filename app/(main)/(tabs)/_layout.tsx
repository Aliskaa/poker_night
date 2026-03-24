import { Tabs } from 'expo-router';
import { Home, Users, Trophy, User } from '@tamagui/lucide-icons';
import { Platform } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 66 : 60;
const TAB_BAR_BOTTOM_PADDING = Platform.OS === 'web' ? 10 : 8;

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: '#0b0f19', // $night900
                    borderTopColor: 'rgba(0, 0, 0, 0.3)', // $overlay3
                    borderTopWidth: 1,
                    height: TAB_BAR_HEIGHT,
                    paddingTop: 4,
                    paddingBottom: TAB_BAR_BOTTOM_PADDING,
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