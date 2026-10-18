import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { getPokemonDetails } from '../api/getPokemonList';
import { useTeam } from '../context/TeamContext';

export default function PokemonDetailScreen({ route }) {
  const { id } = route.params;

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { team, addPokemon, removePokemon } = useTeam();

  const isInTeam = team.some(
    member => String(member.id) === String(id)
  );

  const isTeamFull = team.length >= 6;

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        setError('');

        const result = await getPokemonDetails(id);
        setPokemon(result);
      } catch (err) {
        setError('Could not load Pokémon details.');
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [id]);

  function handleTeamButton() {
    if (!pokemon) return;

    if (isInTeam) {
      removePokemon(pokemon.id);
      return;
    }

    if (isTeamFull) return;

    // Store a consistent structure for MyTeamScreen.
    addPokemon({
      id: pokemon.id,
      name: pokemon.name,
      img:
        pokemon.sprites.other?.['official-artwork']
          ?.front_default,
      sprites: pokemon.sprites,
      types: pokemon.types.map(item => item.type.name),
      stats: pokemon.stats,
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.message}>Loading Pokémon...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          {error || 'Pokémon not found.'}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setPokemon(null);
            setLoading(true);
            setError('');

            getPokemonDetails(id)
              .then(setPokemon)
              .catch(() =>
                setError('Could not load Pokémon details.')
              )
              .finally(() => setLoading(false));
          }}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const artwork =
    pokemon.sprites.other?.['official-artwork']?.front_default;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        {artwork ? (
          <Image
            source={{ uri: artwork }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text>No artwork available</Text>
        )}

        <Text style={styles.number}>
          #{String(pokemon.id).padStart(3, '0')}
        </Text>

        <Text style={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() +
            pokemon.name.slice(1)}
        </Text>

        <View style={styles.typeRow}>
          {pokemon.types.map(item => (
            <View
              key={item.type.name}
              style={styles.typeBadge}
            >
              <Text style={styles.typeText}>
                {item.type.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Height</Text>
          <Text style={styles.infoValue}>
            {(pokemon.height / 10).toFixed(1)} m
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Weight</Text>
          <Text style={styles.infoValue}>
            {(pokemon.weight / 10).toFixed(1)} kg
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Base Stats</Text>

      <View style={styles.statsCard}>
        {pokemon.stats.map(item => {
          const value = item.base_stat;

          return (
            <View key={item.stat.name} style={styles.statItem}>
              <View style={styles.statHeader}>
                <Text style={styles.statName}>
                  {item.stat.name.replace('-', ' ')}
                </Text>

                <Text style={styles.statValue}>{value}</Text>
              </View>

              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.min(value / 255 * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      <Pressable
        disabled={!isInTeam && isTeamFull}
        style={[
          styles.teamButton,
          isInTeam && styles.removeTeamButton,
          !isInTeam && isTeamFull && styles.disabledButton,
        ]}
        onPress={handleTeamButton}
      >
        <Text style={styles.buttonText}>
          {isInTeam
            ? 'Remove from Team'
            : isTeamFull
              ? 'Team Full (6/6)'
              : 'Add to Team'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    color: '#475569',
    textAlign: 'center',
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  image: {
    width: 190,
    height: 190,
  },
  number: {
    color: '#64748B',
    fontWeight: '800',
    marginTop: 8,
  },
  name: {
    color: '#172554',
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  typeBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  typeText: {
    color: '#B91C1C',
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 16,
    padding: 18,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#64748B',
  },
  infoValue: {
    color: '#172554',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#172554',
    marginTop: 22,
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  statName: {
    color: '#475569',
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  statValue: {
    color: '#172554',
    fontWeight: '900',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: '#DC2626',
    borderRadius: 8,
  },
  teamButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    alignItems: 'center',
    borderRadius: 14,
    marginTop: 20,
    marginBottom: 30,
  },
  removeTeamButton: {
    backgroundColor: '#475569',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
});