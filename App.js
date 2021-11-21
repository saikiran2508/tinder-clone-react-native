// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet,Button, Text, View } from 'react-native';
import tw from 'tailwind-rn';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreAllLogs();
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';

console.disableYellowBox = true; 
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

