
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Nav from './components/Nav.js';
import { TeamProvider } from './context/TeamContext';

export default function App() {
  return (
    <TeamProvider>
      <View style={styles.container}>
        <Nav />
        <StatusBar style="auto" />
      </View>
    </TeamProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
