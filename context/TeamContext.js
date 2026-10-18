
import { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);

  function addPokemon(pokemon) {
    setTeam(currentTeam => {
      // Do not add the same Pokémon twice.
      const alreadyExists = currentTeam.some(
        member => member.id === pokemon.id
      );

      if (alreadyExists || currentTeam.length >= 6) {
        return currentTeam;
      }

      return [...currentTeam, pokemon];
    });
  }

  function removePokemon(id) {
    setTeam(currentTeam =>
      currentTeam.filter(pokemon => pokemon.id !== id)
    );
  }

  return (
    <TeamContext.Provider
      value={{ team, addPokemon, removePokemon }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
