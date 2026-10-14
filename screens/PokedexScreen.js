import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getPokemonList } from '../api/getPokemonList';
import PokemonBar from '../components/PokemonBar'
import LoadIcon from '../components/LoadIcon'

export default function PokedexScreen() {
  const [isLoading, setLoading] = useState(true);
  const [isFetchingMore, setFetchingMore] = useState(false)
  const [data, setData] = useState([]);
  const [offset, setOffSet] = useState(0)
  const LIMIT = 20;

  async function loadPokemon(offset, limit=LIMIT) {
    if (offset === 0){
      setLoading(true);
    } else{
      setFetchingMore(true)
    }

    try {
      const pokemonList = await getPokemonList(offset, limit)

      // console.log(pokemonList)
      setData((prevList) => [...prevList, ...pokemonList])
      setOffSet((prevOffset) => prevOffset + LIMIT)
    } catch (error) {
      console.error('Error fetching data: ', error)
    } finally {
      setLoading(false)
      setFetchingMore(false)
    }
  }
  useEffect(() => {
    loadPokemon(offset, LIMIT)
  }, [])

  function handleLoadMore() {
    console.log('HandleLOadMore is Triggered')
    if (!isFetchingMore && !isLoading) {
      loadPokemon(offset, LIMIT)
    }
  }

  function renderFooter() {
    if (!isFetchingMore) return null
    return (
      <LoadIcon />
    )
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadIcon />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (

            // <Text>{item.name}  url: {item.url}</Text>
            <PokemonBar
              id={item.id}
              name={item.name}
              url={item.url}
              img={item.img}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThershold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  itemText: { fontSize: 18, marginBottom: 12 },
});