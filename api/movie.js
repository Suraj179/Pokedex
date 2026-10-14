import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // 1. Define the asynchronous fetch function
  const getJsonData = async () => {
    try {
      const response = await fetch('https://reactnative.dev'); // Your web link here
      const json = await response.json(); // Transform the raw response into JSON
      setData(json.movies); // Set data to state (adapting to your JSON layout)
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // 2. Trigger the fetch once when the component mounts
  useEffect(() => {
    getJsonData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>
              {item.name}
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  itemText: { fontSize: 18, marginBottom: 12 },
});