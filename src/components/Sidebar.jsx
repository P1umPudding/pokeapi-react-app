import TypeIcon from './TypeIcon';

const Sidebar = ({ types, selectedTypes, setSelectedTypes, setShowSidebar }) => {
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
        <div className="card-body text-start">
          <div className="mb-2"><strong>Types</strong></div>
          {types.map((type) => (
            <div key={type} className="form-check mb-1">
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
