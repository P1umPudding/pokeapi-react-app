import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';

const endpoint = 'https://beta.pokeapi.co/graphql/v1beta';

// Query: nur Pokemon mit id < 10000
const GET_ALL_DATA = gql`
  query getAllData {
    pokemon_v2_pokemon(where: { id: { _lt: 10000 } }) {
      id
      name
      pokemon_species_id
      pokemon_v2_pokemonsprites { sprites }
      pokemon_v2_pokemontypes { pokemon_v2_type { name } }
    }
    pokemon_v2_pokemonspecies {
      id
      pokemon_v2_generation { name }
    }
    pokemon_v2_type { name }
  }
`;

// Feste Generationen-Liste (römisch i–ix)
const FIXED_GENERATIONS = ['i','ii','iii','iv','v','vi','vii','viii','ix'];

// Hilfsfunktion: aus 'generation-i' → 'i', etc., sonst null
const mapGenNameToRoman = (genName) => {
  if (!genName) return null;
  const [, roman] = genName.split('-');
  return FIXED_GENERATIONS.includes(roman) ? roman : null;
};

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGenerations, setSelectedGenerations] = useState(['i']); // default 'i'
  const [showSidebar, setShowSidebar] = useState(true);
  const [typesExpanded, setTypesExpanded] = useState(false);
  const [generationsExpanded, setGenerationsExpanded] = useState(false);

  useEffect(() => {
    request(endpoint, GET_ALL_DATA)
      .then(data => {
        const genMap = {};
        data.pokemon_v2_pokemonspecies.forEach(spec => {
          genMap[spec.id] = spec.pokemon_v2_generation?.name;
        });

        const enriched = data.pokemon_v2_pokemon.map(poke => {
          const sprites = poke.pokemon_v2_pokemonsprites[0]?.sprites;
          const image = sprites?.front_default || 'https://placehold.co/96x96';
          const types = poke.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name);
          const genRoman = mapGenNameToRoman(genMap[poke.pokemon_species_id]);
          return { id: poke.id, name: poke.name, image, types, generation: genRoman };
        });

        setPokemons(enriched);
        setTypes(data.pokemon_v2_type.map(t => t.name).sort());
      })
      .catch(err => console.error('Error during API request:', err));
  }, []);

  const filteredPokemons = pokemons.filter(p =>
    selectedTypes.every(t => p.types.includes(t)) &&
    selectedGenerations.length > 0 &&
    p.generation && selectedGenerations.includes(p.generation)
  );

  return (
    <Router>
      <Routes>
        <Route path="/pokemon/:name" element={<PokemonDetail pokemons={pokemons} />} />
        <Route path="/pokemon/:name/*" element={<Navigate to="/" />} />
        <Route path="/" element={
          <div className="my-4" style={{ position: 'relative' }}>
            <div className="p-3 pb-2">
              <h1 className="text-center mb-2">Pokédex</h1>
              {!showSidebar && (
                <div className="text-start">
                  <button className="btn btn-sm btn-outline-secondary mb-1" onClick={() => setShowSidebar(true)}>
                    Filter
                  </button>
                </div>
              )}
              <div className="text-start">
                {selectedTypes.length > 0  || selectedGenerations.length < FIXED_GENERATIONS.length ? (
                  <small className="text-muted">
                    {filteredPokemons.length} out of {pokemons.length}
                  </small>
                ) : (
                  <small className="text-muted">
                    {pokemons.length} results
                  </small>
                )}
              </div>
            </div>
            <div className="d-flex">
              {showSidebar && (
                <Sidebar
                  types={types}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  generations={FIXED_GENERATIONS}
                  selectedGenerations={selectedGenerations}
                  setSelectedGenerations={setSelectedGenerations}
                  setShowSidebar={setShowSidebar}
                  typesExpanded={typesExpanded}
                  setTypesExpanded={setTypesExpanded}
                  generationsExpanded={generationsExpanded}
                  setGenerationsExpanded={setGenerationsExpanded}
                />
              )}
              <div className="flex-grow-1 mx-2 px-3 px-2-5 py-2 rounded-3" style={{ flexBasis: '0', backgroundColor: '#f0f0f0' }}>
                <div className="row">
                  {filteredPokemons.length > 0 ? (
                    filteredPokemons.map(p => <PokemonCard key={p.id} pokemon={p} />)
                  ) : (
                    <div className="col-12"><p className="text-center">No Pokémon found</p></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
