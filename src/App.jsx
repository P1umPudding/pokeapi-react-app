import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';
import './App.css';
import Sidebar from './components/Sidebar'; // Import Sidebar-Komponente
import PokemonCard from './components/PokemonCard'; // Import PokemonCard-Komponente

const endpoint = 'https://beta.pokeapi.co/graphql/v1beta';

const query = gql` {
  pokemon_v2_pokemon(limit: 150) {
    id
    name
    pokemon_v2_pokemonsprites { sprites }
    pokemon_v2_pokemontypes {
      pokemon_v2_type { name }
    }
  }
  pokemon_v2_type { name }
}`;

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    request(endpoint, query)
      .then((data) => {
        const enriched = data.pokemon_v2_pokemon.map((poke) => {
          const sprites = poke.pokemon_v2_pokemonsprites[0]?.sprites;
          const imageUrl = sprites?.front_default || "https://placehold.co/96x96";
          const types = poke.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name);

          return {
            id: poke.id,
            name: poke.name,
            image: imageUrl,
            types: types,
          };
        });

        const allTypes = data.pokemon_v2_type.map((t) => t.name).sort();

        setPokemons(enriched);
        setTypes(allTypes);
      })
      .catch((err) => {
        console.error("Error during API request:", err);
      });
  }, []);

  const filteredPokemons = pokemons.filter(p =>
    selectedTypes.every(t => p.types.includes(t))
  );

  return (
    <div className="my-4" style={{ position: 'relative' }}>
      <div className="p-3 pb-2">
        <h1 className="text-center mb-2">Pokédex 1–150</h1>
        {/* Toggle-Button wenn Sidebar ausgeblendet */}
        {!showSidebar && (
          <div className="text-start">
            <button className="btn btn-sm btn-outline-secondary mb-1" onClick={() => setShowSidebar(true)}>
              Filter
            </button>
          </div>
        )}
        <div className="text-start">
          {selectedTypes.length > 0 ? (
            <small className="text-muted">
              {filteredPokemons.length} out of {pokemons.length}
            </small>
          ) : (
            <small className="text-muted" style={{ visibility: 'hidden' }}>
              {pokemons.length}
            </small>
          )}
        </div>
      </div>
      <div className="d-flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            types={types}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            setShowSidebar={setShowSidebar}
          />
        )}

        {/* Pokemon */}
        <div className="flex-grow-1 mx-2 px-3 px-2-5 py-2 rounded-3" style={{ flexBasis: '0', backgroundColor: '#f0f0f0' }}>
          <div className="row">
            {filteredPokemons.length > 0 ? (
              filteredPokemons.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))
            ) : (
              <div className="col-12">
                <p className="text-center">Keine Pokémon gefunden</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
