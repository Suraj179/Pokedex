const listOfPokemon = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'

export async function getPokemonList(offset, limit) {
  
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  // console.log(`response from api:\n ${response}`)
  if(!response.ok){
    throw new Error('Faild to load Pokemon')
  }
  const data = await response.json();
  const results=data.results

  function getPokemonId(pokeUrl){
    if(!pokeUrl) return null;
    const parts = pokeUrl.split('/').filter(Boolean)
    return parts[parts.length - 1]
  }

  results.forEach((e)=>{
    
    // const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    // console.log(e.url)
    e.id = getPokemonId(e.url)
    e.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${e.id}.png`
  })
  console.log(results)
  return results
}
