import TypeIcon from './TypeIcon';

const Sidebar = ({
  types,
  selectedTypes,
  setSelectedTypes,
  generations,
  selectedGenerations,
  setSelectedGenerations,
  setShowSidebar,
  typesExpanded,
  setTypesExpanded,
  generationsExpanded,
  setGenerationsExpanded,
}) => {

  const selectAllGenerations = () => {
    setSelectedGenerations(generations);
  };

  const deselectAllGenerations = () => {
    setSelectedGenerations([]);
  };

  const deselectAllTypes = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="sidebar ms-2" style={{ width: '200px', flexShrink: 0, position: 'relative' }}>
      {/* Toggle-Button */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Filter</strong>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowSidebar(false)}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>

        <div className="card-body text-start p-2-5">
          {/* Types Filter */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Types</strong>
            <button
              className="btn btn-sm my-btn"
              onClick={() => setTypesExpanded((prev) => !prev)}
            >
              <i className={`bi ${typesExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>

          {/* "Deselect" Button for Types */}
          {typesExpanded && (
            <div className="d-flex justify-content-start mb-2 ms-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={deselectAllTypes}
              >
                Deselect all
              </button>
            </div>
          )}

          {typesExpanded && types.map((type) => (
            <div key={type} className="form-check mb-1 ms-3">
              <input
                className="form-check-input"
                type="checkbox"
                value={type}
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSelectedTypes((prev) =>
                    checked ? [...prev, type] : prev.filter((t) => t !== type)
                  );
                }}
              />
              <label className="form-check-label d-flex align-items-center gap-2" htmlFor={`type-${type}`}>
                <TypeIcon className="" type={type} />
                <span style={{ textTransform: 'capitalize' }}>{type}</span>
              </label>
            </div>
          ))}

          {/* Generations Filter */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-1">
            <strong>Generations</strong>
            <button
              className="btn btn-sm my-btn"
              onClick={() => setGenerationsExpanded((prev) => !prev)}
            >
              <i className={`bi ${generationsExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>

          {/* "All" and "None" Buttons for Generations */}
          {generationsExpanded && (
            <div className="d-flex justify-content-start mb-2 ms-3">
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={selectAllGenerations}
              >
                All
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={deselectAllGenerations}
              >
                None
              </button>
            </div>
          )}

          {/* Mapping generations */}
          {generationsExpanded && generations.map((generation) => (
            <div key={generation} className="form-check mb-1 ms-3">
              <input
                className="form-check-input"
                type="checkbox"
                value={generation}
                id={`generation-${generation}`}
                checked={selectedGenerations.includes(generation)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSelectedGenerations((prev) =>
                    checked ? [...prev, generation] : prev.filter((g) => g !== generation)
                  );
                }}
              />
              <label className="form-check-label" htmlFor={`generation-${generation}`}>
                {generation}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
