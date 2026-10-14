import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GameScreen from '../screens/GameScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import PokedexScreen from '../screens/PokedexScreen';
import { List, UserRoundGroup, Gamepad2 } from 'lucide-react-native'

const Tab = createBottomTabNavigator();
export default function nav(){
    return(
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Pokedex" component={PokedexScreen} options={{
                    tabBarIcon: ({color,size})=> <List color={color} size={size} />
                }}/>
                <Tab.Screen name="MyTeam" component={MyTeamScreen} options={{
                    tabBarIcon: ({color,size})=> <UserRoundGroup color={color} size={size} />
                }}/>
                <Tab.Screen name="Game" component={GameScreen} options={{
                    tabBarIcon: ({color,size})=> <Gamepad2 color={color} size={size} />
                }}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}