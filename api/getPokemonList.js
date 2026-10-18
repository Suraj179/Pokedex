
let pokemonSearchCache = null;

async function getPokemonTypes(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load Pokémon types');
  }

  const data = await response.json();

  // Extract type names, e.g. ["grass", "poison"]
  return data.types.map((item) => item.type.name);
}

export async function getPokemonList(offset, limit) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to load Pokémon');
  }

  const data = await response.json();

  const results = await Promise.all(
    data.results.map(async (pokemon) => {
      const id = pokemon.url.split('/').filter(Boolean).pop();
      const types = await getPokemonTypes(pokemon.url);

      return {
        ...pokemon,
        id,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        types,
      };
    })
  );

  return results;
}


export async function searchPokemon(name) {
  const query = name.trim().toLowerCase();

  // Do not search if the input is empty.
  if (!query) {
    return [];
  }

  // Download the Pokémon list only if it is not cached.
  if (pokemonSearchCache === null) {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=1025'
    );

    if (!response.ok) {
      throw new Error('Failed to load Pokémon search data');
    }

    const data = await response.json();

    pokemonSearchCache = data.results.map((pokemon) => {
      const id = pokemon.url.split('/').filter(Boolean).pop();

      return {
        ...pokemon,
        id,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });
  }

  // Filter the cached list locally; no new request is needed.
  return pokemonSearchCache.filter((pokemon) =>
    pokemon.name.includes(query)
  );
}


export async function getPokemonGamePool() {
  // Reuse the existing Pokémon cache.
  if (pokemonSearchCache === null) {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=1025'
    );

    if (!response.ok) {
      throw new Error('Failed to load Pokémon for the game');
    }

    const data = await response.json();

    pokemonSearchCache = data.results.map((pokemon) => {
      const id = Number(
        pokemon.url.split('/').filter(Boolean).pop()
      );

      return {
        ...pokemon,
        id,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });
  }

  return pokemonSearchCache;
}

export async function getPokemonDetails(id) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  if (!response.ok) {
    throw new Error('Failed to load Pokémon details');
  }

  return await response.json();
}