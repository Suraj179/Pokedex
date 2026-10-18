import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getPokemonList, searchPokemon } from '../api/getPokemonList';
import PokemonBar from '../components/PokemonBar'
import LoadIcon from '../components/LoadIcon'
import SearchBar from '../components/SearchBar'
import { useNavigation } from '@react-navigation/native';

export default function PokedexScreen() {
  const [isLoading, setLoading] = useState(true);
  const [isFetchingMore, setFetchingMore] = useState(false)
  const [data, setData] = useState([]);
  const [offset, setOffSet] = useState(0)
  const LIMIT = 20;

  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const navigation = useNavigation();
  async function loadPokemon(offset, limit = LIMIT) {
    if (offset === 0) {
      setLoading(true);
    } else {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim())
    }, 500)
    return () => clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    async function runSearch() {
      // Empty query: return to the normal paginated list
      if (debouncedSearch === '') {
        setSearchResults([]);
        setSearchError('');
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setSearchError('');

      try {
        const results = await searchPokemon(debouncedSearch);
        setSearchResults(results);
      } catch (error) {
        setSearchError('Failed to search Pokémon. Please try again.');
        setSearchResults([]);
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }

    runSearch();
  }, [debouncedSearch]);
  return (
  <View style={styles.container}>
    <SearchBar
      value={searchText}
      onChangeText={setSearchText}
    />

    {isSearching ? (
      <LoadIcon />
    ) : searchError ? (
      <Text>{searchError}</Text>
    ) : isLoading && debouncedSearch === '' ? (
      <LoadIcon />
    ) : (
      <FlatList
        data={debouncedSearch ? searchResults : data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonBar
            id={item.id}
            name={item.name}
            img={item.img}
            types={item.types}
            onPress={() =>
              navigation.navigate('PokemonDetail', {
                id: item.id,
              })
            }
          />
        )}
        onEndReached={
          debouncedSearch === '' ? handleLoadMore : null
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          debouncedSearch === '' ? renderFooter : null
        }
        ListEmptyComponent={
          debouncedSearch !== '' ? (
            <Text style={styles.emptyText}>
              No Pokémon found for "{debouncedSearch}".
            </Text>
          ) : null
        }
      />
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingTop: 16,
  paddingHorizontal: 16,
  backgroundColor: '#FFFFFF',
},

  contentContainer: {
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  list: {
    marginBottom: 18,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#64748B',
  },
});