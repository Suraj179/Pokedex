
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';

import { useTeam } from '../context/TeamContext';

export default function MyTeamScreen() {
  const { team, removePokemon } = useTeam();

  // Calculate the combined value of each base stat.
  const combinedStats = team.reduce(
    (totals, pokemon) => {
      (pokemon.stats || []).forEach(stat => {
        const statName = stat.stat.name;

        totals[statName] =
          (totals[statName] || 0) + stat.base_stat;
      });

      return totals;
    },
    {}
  );

  function getImage(pokemon) {
  return (
    pokemon.img ||
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  );
}

  function formatName(name = '') {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <ScrollView
  style={styles.container}
  contentContainerStyle={styles.contentContainer}
>
      <StatusBar style="dark" />

      <Text style={styles.heading}>My Team</Text>

      <Text style={styles.subtitle}>
        Build your ultimate Pokémon team
      </Text>

      <View style={styles.countCard}>
        <Text style={styles.countLabel}>TEAM MEMBERS</Text>

        <Text style={styles.count}>
          {team.length}/6
        </Text>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${(team.length / 6) * 100}%` },
            ]}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Your Pokémon
      </Text>

      {team.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            Your team is empty
          </Text>

          <Text style={styles.emptyText}>
            Open a Pokémon's Detail screen and add it
            to start building your team.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
  {team.map((item) => (
    <View
      key={String(item.id)}
      style={styles.pokemonCard}
    >
      <Image
        source={{ uri: getImage(item) }}
        style={styles.pokemonImage}
        resizeMode="contain"
      />

      <View style={styles.pokemonInfo}>
        <Text style={styles.pokemonNumber}>
          #{String(item.id).padStart(3, '0')}
        </Text>

        <Text style={styles.pokemonName}>
          {formatName(item.name)}
        </Text>

        <Text style={styles.pokemonTypes}>
          {(item.types || [])
            .map(type => type.type?.name || type.name)
            .filter(Boolean)
            .join(' / ')}
        </Text>
      </View>

      <Pressable
        style={styles.removeButton}
        onPress={() => removePokemon(item.id)}
        accessibilityLabel={`Remove ${item.name}`}
      >
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  ))}
</View>
      )}

      <Text style={styles.sectionTitle}>
        Combined Base Stats
      </Text>

      <View style={styles.statsCard}>
        {[
          ['HP', 'hp'],
          ['Attack', 'attack'],
          ['Defense', 'defense'],
          ['Special Attack', 'special-attack'],
          ['Special Defense', 'special-defense'],
          ['Speed', 'speed'],
        ].map(([label, key]) => (
          <View style={styles.statRow} key={key}>
            <Text style={styles.statLabel}>{label}</Text>

            <Text style={styles.statValue}>
              {combinedStats[key] || 0}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.totalValue}>
            {Object.values(combinedStats).reduce(
              (sum, value) => sum + value,
              0
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#F4F7FC',
},
list: {
  marginBottom: 18,
},
contentContainer: {
  paddingTop: 55,
  paddingHorizontal: 18,
  paddingBottom: 24,
},

  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#172554',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 4,
    marginBottom: 18,
  },
  countCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 22,
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  count: {
    fontSize: 30,
    fontWeight: '900',
    color: '#2563EB',
    marginVertical: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#172554',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#172554',
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
  list: {
    paddingBottom: 18,
  },
  pokemonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  pokemonImage: {
    width: 70,
    height: 70,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonInfo: {
    flex: 1,
    marginLeft: 10,
  },
  pokemonNumber: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  pokemonName: {
    color: '#172554',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },
  pokemonTypes: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
  },
  removeText: {
    color: '#B91C1C',
    fontWeight: '800',
    fontSize: 12,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    color: '#475569',
    fontWeight: '600',
  },
  statValue: {
    color: '#172554',
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    marginTop: 6,
  },
  totalLabel: {
    color: '#172554',
    fontWeight: '900',
  },
  totalValue: {
    color: '#2563EB',
    fontWeight: '900',
  },
});
