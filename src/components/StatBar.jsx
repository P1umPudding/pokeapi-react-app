const StatBar = ({ value, max = 200 }) => {
    const percentage = Math.min((value / max) * 100, 100);
  
    let barColor = '#23CD5E';
    if (value < 30) {
        barColor = '#F34444';
    } else if (value < 50) {
      barColor = '#FF7F0F';
    } else if (value < 100) {
      barColor = '#FFDD57';
    } else if (value < 120) {
      barColor = '#A0E515';
    }
  
    return (
      <div className="flex-grow-1 ms-2 d-flex align-items-center">
        <div className="bg-secondary bg-opacity-10 rounded-pill w-100" style={{ height: '10px' }}>
          <div
            className="rounded-pill"
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: barColor,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    );
  };
  
  export default StatBar;
  