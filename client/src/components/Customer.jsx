import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Customer = ({ data }) => {
  let complianceOccurrences = {};
  let priorityTagNameOccurrences = {};
  let RequirementAllocation = {};
  let statusOccurrences = {};
  if (data) {
    ({
      complianceOccurrences,
      priorityTagNameOccurrences,
      RequirementAllocation,
      statusOccurrences
    } = data);
  }
  
  const pieData = {
    labels: Object.keys(complianceOccurrences),
    datasets: [
      {
        data: Object.values(complianceOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  const barData = {
    labels: Object.keys(priorityTagNameOccurrences),
    datasets: [
      {
        label: 'Severity',
        data: Object.values(priorityTagNameOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }
    ]
  };

  const barDataa = {
    labels: Object.keys(RequirementAllocation),
    datasets: [
      {
        label: 'Requirement Allocation',
        data: Object.values(RequirementAllocation),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56']
      }
    ]
  };

  const barDataaa = {
    labels: Object.keys(statusOccurrences),
    datasets: [
      {
        label: 'Status',
        data: Object.values(statusOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    data? (
      <div className='max-h-80 overflow-y-scroll w-full bg-gray-200 flex flex-col items-center'>
       <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
          <h3>Compliance</h3>
          <Pie data={pieData} />
        </div>
        <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
          <h3>Priority</h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
          <h3>Requirement Allocation</h3>
          <Bar data={barDataa} options={barOptions} />
        </div>
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Status</h3>
          <Bar data={barDataaa} options={barOptions} />
        </div>
      </div> 
      
    </div>) : (<div>No data found for this project</div>)
  );
};

export default Customer;
