import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TypeIcon from './TypeIcon';
import Gauge from './Gauge';
import StatBar from './StatBar';

const typeColors = {
    fire: '#fddfdf',
    water: '#d6f0ff',
    grass: '#e2fbe0',
    electric: '#fffacc',
    psychic: '#ffe1f5',
    ice: '#e0f7ff',
    dragon: '#e6e0ff',
    dark: '#dcdcdc',
    fairy: '#fde6f8',
    bug: '#f3fbd1',
    normal: '#f5f5f5',
    poison: '#f0e0f8',
    ground: '#f8f0d8',
    rock: '#eae4d3',
    fighting: '#fce0e0',
    ghost: '#ece6f8',
    steel: '#e5e5e5',
    flying: '#e6f0ff',
};

const getTypeColor = (type) => typeColors[type] || '#f0f0f0';

const PokemonDetail = ({ pokemons }) => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [additionalData, setAdditionalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const pokemon = pokemons.find(p => p.name.toLowerCase() === name.toLowerCase());

    useEffect(() => {
        const fetchAdditionalData = async () => {
            const query = `
            query pokemon_details($name: String) {
              species: pokemon_v2_pokemonspecies(where: {name: {_eq: $name}}) {
                is_legendary
                is_mythical
                habitat: pokemon_v2_pokemonhabitat { name }
                flavorText: pokemon_v2_pokemonspeciesflavortexts(
                  where: {
                    pokemon_v2_language: {name: {_eq: "en"}},
                    pokemon_v2_version: {name: {_eq: "firered"}}
                  }, limit: 1 ) {
                  flavor_text
                }
                pokemon: pokemon_v2_pokemons_aggregate(limit: 1) {
                  nodes {
                    height
                    weight
                    stats: pokemon_v2_pokemonstats {
                      base_stat
                      stat: pokemon_v2_stat { name }
                    }
                    abilities: pokemon_v2_pokemonabilities_aggregate {
                      nodes {
                        ability: pokemon_v2_ability { name }
                      }
                    }
                  }
                }
              }
            }
          `;
          
            try {
                const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        variables: { name },
                        operationName: 'pokemon_details',
                    }),
                });
                const result = await response.json();
                setAdditionalData(result.data.species[0]);
            } catch (error) {
                console.error('Error fetching additional data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (pokemon) {
            fetchAdditionalData();
            setOffsetX(pseudoRandomFromId(pokemon.id, 1, 0, 600));
            setOffsetY(pseudoRandomFromId(pokemon.id, 2, 0, 600));
        }
    }, [name, pokemon]);

    function pseudoRandomFromId(id, seed = 1, min = 0, max = 1) {
        const x = Math.sin(id * seed) * 10000;
        const base = x - Math.floor(x);
        return min + base * (max - min);
    }


    if (!pokemons || pokemons.length === 0) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary mt-5" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    if (!pokemon) {
        return (
            <div className="d-flex flex-column align-items-center mt-5">
                <button className="btn btn-outline-secondary align-self-start ms-3 mb-3" onClick={() => navigate('/')}>
                    <i className="bi bi-chevron-left me-1"></i>
                    Back to list
                </button>
                <h2>❌ Pokémon doesn't seem to exist</h2>
            </div>
        );
    }
    return (
        <div className="d-flex flex-column align-items-center mt-4">
            {/* Zurück-Button */}
            <button className="btn btn-outline-secondary align-self-start ms-3 mb-3" onClick={() => navigate('/')}>
                <i className="bi bi-chevron-left me-1"></i>
                Back to list
            </button>

            {/* Hauptbox */}
            <div
                className="card p-4 text-center"
                style={{
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    backgroundImage: `url('/assets/card-background.png')`,
                    backgroundColor: getTypeColor(pokemon.types[0]) + 'cc',
                    backgroundBlendMode: 'overlay',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: `${offsetX}px ${offsetY}px`,
                    borderRadius: '1rem',
                }}

            >
                {/* Name + ID */}
                <div className="d-flex justify-content-center align-items-baseline gap-4 mb-0">
                    <h1 className="mb-0" style={{ textTransform: 'capitalize', fontSize: '2.7rem' }}>
                        {pokemon.name}
                    </h1>
                    <span className="text-muted" style={{ fontSize: '1.8rem' }}>#{pokemon.id}</span>
                </div>

                {/* Legendary & Mythical */}
                <div className="d-flex justify-content-center gap-3 mb-3">
                    {additionalData?.is_legendary && (
                        <span className="badge bg-warning text-dark fs-5">Legendary</span>
                    )}
                    {additionalData?.is_mythical && (
                        <span className="badge text-white fs-5" style={{ backgroundColor: '#a830c0' }}>Mythical</span>
                    )}
                </div>

                {/* Image */}
                <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="mx-auto pixel-art"
                    style={{
                        maxWidth: '250px',
                    }}
                />

                {/* Types */}
                <div className="d-flex justify-content-center gap-3 flex-wrap mb-2">
                    {pokemon.types.map((type) => (
                        <div
                            key={type}
                            className="d-flex align-items-center border px-3 py-1 rounded-pill shadow-sm"
                            style={{
                                fontSize: '1rem',
                                backgroundColor: getTypeColor(type),
                                cursor: 'default',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            }}
                        >
                            <TypeIcon type={type} className="me-2" />
                            <span style={{ textTransform: 'capitalize' }}>{type}</span>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                    {/* Habitat */}
                    <div className="d-flex align-items-center mb-2 mb-md-0">
                        <strong className="me-2" style={{ fontSize: '1.3rem' }}>Habitat:</strong>
                        {additionalData?.habitat?.name && (
                            <img
                                src={`/assets/${additionalData.habitat.name}.png`}
                                alt={additionalData.habitat.name}
                                style={{ width: '40px', height: '30px' }}
                                className="me-2"
                            />
                        )}
                        <span className="text-capitalize">{loading ? '-' : additionalData?.habitat?.name ?? 'Unknown'}</span>
                    </div>

                    {/* Generation */}
                    <div>
                        <span
                            className="px-3 py-1"
                            style={{
                                backgroundColor: '#ffe2ad',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: '#404040',
                            }}
                        >
                            generation {loading ? '-' : pokemon.generation ?? '-'}
                        </span>
                    </div>
                </div>

                {/* Height, Weight */}
                <div className="row mt-5">
                    <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center">
                            <strong className="me-2" style={{ fontSize: '1.1rem' }}>Height:</strong>
                            <div className="d-flex flex-column align-items-start ms-3">
                                <Gauge value={additionalData?.pokemon?.nodes[0]?.height / 10} radius={25} maximum={20} />
                                <span className="d-flex align-items-center justify-content-center" style={{ marginTop: '-4px', width: '100%' }}> {loading ? '-' : `${(additionalData?.pokemon?.nodes[0]?.height ?? 'Unknown') / 10} m`} </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center">
                            <strong className="me-2" style={{ fontSize: '1.1rem' }}>Weight:</strong>
                            <div className="d-flex flex-column align-items-start ms-3">
                                <Gauge value={additionalData?.pokemon?.nodes[0]?.weight / 10} radius={25} maximum={1000} />
                                <span className="d-flex align-items-center justify-content-center" style={{ marginTop: '-4px', width: '100%' }}> {loading ? '-' : `${(Math.round(additionalData?.pokemon?.nodes[0]?.weight ?? 'Unknown') * 10) / 100} kg`} </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-0 px-2 pb-2" style={{ backgroundColor: '#ffffff' + '55', border: '2px solid ' + getTypeColor(pokemon.types[0]) + 'bb', borderRadius: '0.7rem' }}>
                    <div className="row">
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <strong className="d-flex align-items-start" style={{ fontSize: '1.7rem' }}>Stats</strong>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column justify-content-between">
                            <div></div>
                            <div className="d-flex align-items-start mb-1" style={{ fontSize: '1.1rem' }}>
                                <div className="d-flex align-items-start">
                                    <strong>Total:</strong>
                                    {!loading && (<p className="m-0 ms-3">{additionalData.pokemon.nodes[0].stats.reduce((sum, s) => sum + (s.base_stat || 0), 0)}</p>)} {loading && <p>-</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1 gy-1">
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <span className="pe-2 text-uppercase">{loading ? '-' : additionalData.pokemon.nodes[0].stats[0].stat.name ?? 'Unknown'}:</span>
                                <span>{loading ? '-' : additionalData.pokemon.nodes[0].stats[0].base_stat ?? 'Unknown'}</span>
                                {!loading && typeof additionalData.pokemon.nodes[0].stats[0].base_stat === 'number' && <StatBar value={additionalData.pokemon.nodes[0].stats[0].base_stat} />}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <span className="pe-2 text-capitalize">{loading ? '-' : additionalData.pokemon.nodes[0].stats[1].stat.name ?? 'Unknown'}:</span>
                                <span>{loading ? '-' : additionalData.pokemon.nodes[0].stats[1].base_stat ?? 'Unknown'}</span>
                                {!loading && typeof additionalData.pokemon.nodes[0].stats[1].base_stat === 'number' && <StatBar value={additionalData.pokemon.nodes[0].stats[1].base_stat} />}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <span className="pe-2 text-capitalize">{loading ? '-' : additionalData.pokemon.nodes[0].stats[2].stat.name ?? 'Unknown'}:</span>
                                <span>{loading ? '-' : additionalData.pokemon.nodes[0].stats[2].base_stat ?? 'Unknown'}</span>
                                {!loading && typeof additionalData.pokemon.nodes[0].stats[2].base_stat === 'number' && <StatBar value={additionalData.pokemon.nodes[0].stats[2].base_stat} />}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <span className="pe-2 text-capitalize">{loading ? '-' : additionalData.pokemon.nodes[0].stats[3].stat.name ?? 'Unknown'}:</span>
                                <span>{loading ? '-' : additionalData.pokemon.nodes[0].stats[3].base_stat ?? 'Unknown'}</span>
                                {!loading && typeof additionalData.pokemon.nodes[0].stats[3].base_stat === 'number' && <StatBar value={additionalData.pokemon.nodes[0].stats[3].base_stat} />}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <span className="pe-2 text-capitalize">{loading ? '-' : additionalData.pokemon.nodes[0].stats[4].stat.name ?? 'Unknown'}:</span>
                                <span>{loading ? '-' : additionalData.pokemon.nodes[0].stats[4].base_stat ?? 'Unknown'}</span>
                                {!loading && typeof additionalData.pokemon.nodes[0].stats[4].base_stat === 'number' && <StatBar value={additionalData.pokemon.nodes[0].stats[4].base_stat} />}
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <span className="pe-2 text-capitalize">{loading ? '-' : additionalData.pokemon.nodes[0].stats[5].stat.name ?? 'Unknown'}:</span>
                                <span>{loading ? '-' : additionalData.pokemon.nodes[0].stats[5].base_stat ?? 'Unknown'}</span>
                                {!loading && typeof additionalData.pokemon.nodes[0].stats[5].base_stat === 'number' && <StatBar value={additionalData.pokemon.nodes[0].stats[5].base_stat} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Abilities */}
                <div className="d-flex align-items-center">
                    <div className=" mt-4">
                        <strong className="me-3" style={{ fontSize: '1.3rem' }}>Abilities:</strong>
                        {loading ? ('-') : (
                            additionalData?.pokemon?.nodes[0]?.abilities.nodes.map((n, i) => (
                                <span key={i} className="badge bg-secondary me-2 rounded-5 pt-1 pb-2" style={{ fontSize: '0.9rem' }}>{n.ability.name}</span>
                            ))
                        )}
                    </div>
                </div>

                {/* Flavor Text */}
                <div className="mt-4 pb-0 p-3" style={{ backgroundColor: '#f1f8ff', borderRadius: '1rem', fontFamily: '"Cursive", sans-serif', fontStyle: 'italic', }}>
                    <p>{additionalData?.flavorText?.[0]?.flavor_text ?? 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetail;
