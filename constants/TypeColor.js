export const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  steel: '#B7B7CE',
  dark: '#705746',
  fairy: '#D685AD',
  stellar: '#43A047',
  unknown: '#68A090',
};

// Helper function to safely get type color
export const getTypeColor = (typeName) => {
  if (!typeName) return '#68A090';
  return TYPE_COLORS[typeName.toLowerCase()] || '#68A090';
};