import sprite from '/assets/type-icons.png';

const typeToPosition = {
  normal: { row: 0, col: 1 },
  fire: { row: 0, col: 6 },
  water: { row: 0, col: 4 },
  grass: { row: 1, col: 0 },
  bug: { row: 1, col: 2 },
  dark: { row: 4, col: 3 },
  dragon: { row: 3, col: 6 },
  electric: { row: 1, col: 4 },
  fairy: { row: 4, col: 0 },
  fighting: { row: 0, col: 3 },
  flying: { row: 2, col: 0 },
  ghost: { row: 3, col: 5 },
  ground: { row: 2, col: 1 },
  ice: { row: 2, col: 5 },
  poison: { row: 1, col: 3 },
  psychic: { row: 3, col: 2 },
  rock: { row: 2, col: 6 },
  shadow: { row: 4, col: 6 },
  steel: { row: 3, col: 0 },
  stellar: { row: 4, col: 4 },
  unknown: { row: 0, col: 0 },
};

const displaySize = 25;
const columnAmount = 8;
const rowAmount = 5;


const TypeIcon = ({ type, className = '' }) => {
  const { row = 0, col = 0 } = typeToPosition[type] || {};

  const style = {
    backgroundImage: `url(${sprite})`,
    backgroundPosition: `-${col * displaySize}px -${row * displaySize}px`,
    backgroundSize: `${displaySize * columnAmount}px ${displaySize * rowAmount}px`,
    width: `${displaySize}px`,
    height: `${displaySize}px`,
  };

  return <div className={`type-icon ${className}`} style={style}></div>;
};

export default TypeIcon;