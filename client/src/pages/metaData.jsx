import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MetadataCharts = ({ data }) => {
  const { startKeywordCount, statusWords, preparedByWords } = data;

  const barData = {
    labels: ['Start Keyword Count'],
    datasets: [
      {
        label: 'Start Keyword Count',
        data: [startKeywordCount],
        backgroundColor: ['#FF6384'],
        hoverBackgroundColor: ['#FF6384'],
      },
    ],
  };

  const statusData = {
    labels: statusWords,
    datasets: [
      {
        label: 'Status Words',
        data: statusWords.map(() => 1),
        backgroundColor: ['#36A2EB'],
        hoverBackgroundColor: ['#36A2EB'],
      },
    ],
  };

  const preparedByData = {
    labels: preparedByWords,
    datasets: [
      {
        label: 'Prepared By Words',
        data: preparedByWords.map(() => 1),
        backgroundColor: ['#FFCE56'],
        hoverBackgroundColor: ['#FFCE56'],
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    data ? (
      <div className='max-h-80 overflow-y-scroll w-full bg-gray-200 flex flex-col items-center'>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
            <h3>Start Keyword Count</h3>
            <Bar data={barData} options={barOptions} />
          </div>
          <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
            <h3>Status Words</h3>
            <Bar data={statusData} options={barOptions} />
          </div>
          <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
            <h3>Prepared By Words</h3>
            <Bar data={preparedByData} options={barOptions} />
          </div>
        </div>
      </div>
    ) : (
      <div>No data found</div>
    )
  );
};

export default MetadataCharts;
