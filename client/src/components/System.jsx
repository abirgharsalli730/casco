import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';


// Register the necessary components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const System = ({ data }) => {
  let functionalTagNameOccurrences = {}
  let priorityTagNameOccurrences = {}
  let statusOccurrences = {}
  let assigneeOccurrences = {}
  if(data){
    ({functionalTagNameOccurrences,
    priorityTagNameOccurrences,
    statusOccurrences,
    assigneeOccurrences
  }
   = data)
  }
  const pieData = {
    labels: Object.keys(functionalTagNameOccurrences),
    datasets: [
      {
        data: Object.values(functionalTagNameOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const barData = {
    labels: Object.keys(priorityTagNameOccurrences),
    datasets: [
      {
        label: 'Priority',
        data: Object.values(priorityTagNameOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
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
  const barDataa = {
    labels: Object.keys(assigneeOccurrences),
    datasets: [
      {
        label: 'Assignee',
        data: Object.values(assigneeOccurrences),
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
    data? (<div className='max-h-80 overflow-y-scroll w-full bg-gray-200 flex flex-col items-center'
      style={{
        height: 800,
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
      {data? (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
            <h3>Functional</h3>
            <Pie data={pieData} />
          </div>
          <div style={{ width: '300px', height: '300px' }}>
            <h3>Priority</h3>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Status</h3>
          <Bar data={barDataaa} options={barOptions} />
        </div>
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Assignee</h3>
          <Bar data={barDataa} options={barOptions} />
        </div>
      </div>):(<div>No data found</div>)}
      
    </div>) : (<div>No data found for this Proejct</div>)
  );
};

export default System;
