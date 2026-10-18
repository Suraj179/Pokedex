
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import GameScreen from '../screens/GameScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import PokedexScreen from '../screens/PokedexScreen';

import {
    List,
    UsersRound,
    Gamepad2,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RED = '#DC2626';
const GRAY = '#94A3B8';

function HeaderLogo() {
    return (
        <View style={styles.header}>
            <Image
                source={require('../assets/headericon.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Suraj's Pokedex</Text>
        </View>
    );
}

function MainTabs() {
    return (<Tab.Navigator

        screenOptions={{
            headerStyle: {
                backgroundColor: RED,
                height: 105,
            },
            headerTintColor: '#FFFFFF',
            headerTitleAlign: 'center',
            headerTitle: () => <HeaderLogo />,

            // Bottom navigation colors
            tabBarActiveTintColor: '#f6ff00',
            tabBarInactiveTintColor: '#ffffff',

            tabBarStyle: {
                backgroundColor: RED,
                height: 68,
                paddingTop: 8,
                paddingBottom: 8,
                borderTopColor: '#B91C1C',
                borderTopWidth: 1,
                elevation: 8,
            },

            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '700',
            },
        }}


    >
        <Tab.Screen
            name="Pokedex"
            component={PokedexScreen}
            options={{
                title: "Suraj's Pokédex",
                tabBarLabel: 'Pokédex',
                tabBarIcon: ({ color, size, focused }) => (
                    <List
                        color={color}
                        size={size}
                        strokeWidth={focused ? 2.8 : 2}
                    />
                ),
            }}
        />

        <Tab.Screen
            name="MyTeam"
            component={MyTeamScreen}
            options={{
                title: "Suraj's Pokédex",
                tabBarLabel: 'My Team',
                tabBarIcon: ({ color, size, focused }) => (
                    <UsersRound
                        color={color}
                        size={size}
                        strokeWidth={focused ? 2.8 : 2}
                    />
                ),
            }}
        />

        <Tab.Screen
            name="Game"
            component={GameScreen}
            options={{
                title: "Suraj's Pokédex",
                tabBarLabel: 'Game',
                tabBarIcon: ({ color, size, focused }) => (
                    <Gamepad2
                        color={color}
                        size={size}
                        strokeWidth={focused ? 2.8 : 2}
                    />
                ),
            }}
        />
    </Tab.Navigator>
    );
}

export default function Nav() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: RED },
          headerTintColor: '#FFFFFF',
          headerTitleAlign: 'center',
          headerTitle: () => <HeaderLogo />,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={{ title: "Suraj's Pokédex" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    logo: {
        width: 36,
        height: 36,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: '800',
    },
});
