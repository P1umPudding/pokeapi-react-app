import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';
import './App.css';

const endpoint = 'https://beta.pokeapi.co/graphql/v1beta';

const query = gql`
  {pokemon_v2_pokemon(limit: 150) {
      id
      name
      pokemon_v2_pokemonsprites { sprites }
    }}
`;

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    request(endpoint, query)
      .then((data) => {
        const enriched = data.pokemon_v2_pokemon.map((poke) => {
          const sprites = poke.pokemon_v2_pokemonsprites[0]?.sprites;
          const imageUrl = sprites?.front_default || "https://placehold.co/96x96";

          return {
            id: poke.id,
            name: poke.name,
            image: imageUrl,
          };
        });

        setPokemons(enriched);
      })
      .catch((err) => {
        console.error("Error during API request:", err);
      });
  }, []);



  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Pokémon 1–150</h1>
      <div className="row">
        {pokemons.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={p.id}>
            <div className="card text-center h-100">
              <div className="card-body py-2 d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">{p.name}</h4>
                <p className="card-text mb-0">#{p.id}</p>
              </div>
              <img src={p.image} className="card-img-top pixel-art" alt={p.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
