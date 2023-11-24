import React from 'react';

const ChartComponent = ({ chartData }) => {
  return (
    <div>
      <h2>Chart Data</h2>
      <div>
        {chartData.datasets.map((dataset, index) => (
          <div key={index}>
            <h3>{dataset.label}</h3>
            <ul>
              {dataset.data.map((value, i) => (
                <li key={i}>{value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <h3>Labels</h3>
        <ul>
          {chartData.labels.map((label, index) => (
            <li key={index}>{label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChartComponent;