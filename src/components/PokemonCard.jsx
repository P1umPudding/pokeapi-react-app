import TypeIcon from './TypeIcon';

const PokemonCard = ({ pokemon }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3 gx-3">
      <div className="card text-center h-100">
        <div className="card-body py-2 px-2">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0" style={{ fontSize: 'clamp(1.2rem, 1.2vw, 1.5rem)' }}>
              {pokemon.name}
            </h4>
            <p className="card-text mb-0" style={{ fontSize: 'clamp(1.0rem, 0.9vw, 1.3rem)' }}>
              #{pokemon.id}
            </p>
          </div>
          <div className="d-flex justify-content-center gap-2 mt-1">
            {pokemon.types.map((type) => (
              <TypeIcon key={type} type={type} />
            ))}
          </div>
        </div>

        <img src={pokemon.image} className="card-img-top pixel-art" alt={pokemon.name} />
      </div>
    </div>
  );
};

export default PokemonCard;
