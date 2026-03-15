import React from 'react';
import './RecentResults.css';

const RecentResults = ({ results }) => {
  return (
    <div className="recent-results">
      <h2>Recent Results</h2>
      <div className="results-container">
        {results.map((result, index) => (
          <div key={index} className="result-box" style={{ backgroundColor: result.color }}>
            <span className="result-number">{result.number}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentResults;
