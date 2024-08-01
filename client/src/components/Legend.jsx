// src/Legend.js
import React from 'react';

const Legend = () => {
  const legendStyles = {
    container: {
      marginLeft: '20px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#fff',
      width: '200px'
    },
    header: {
        marginTop: '0',
        fontSize: '20px',  
        fontWeight: 'bold'
    },
    rectangle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '60px',  // Adjusted width
      height: '20px', // Adjusted height
      border: '1px solid #ccc',
      marginRight: '10px',
      backgroundColor: '#eee',
      textAlign: 'center',
      fontSize: '12px', // Adjusted font size
    },
  
    item: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '5px'
    },
    colorBox: {
      width: '20px',
      height: '20px',
      marginRight: '10px',
      border: '1px solid #ccc'
    },
    green: {
      backgroundColor: 'green'
    },
    default: {
      backgroundColor: '#eee'
    }
  };

  return (
    <div style={legendStyles.container}>
      <h3 style={legendStyles.header}>Files</h3>
      <div style={legendStyles.item}>
        <div style={{ ...legendStyles.colorBox, ...legendStyles.green }}></div>
        <span>Imported </span>
      </div>
      <div style={legendStyles.item}>
        <div style={{ ...legendStyles.colorBox, ...legendStyles.default }}></div>
        <span>Not Imported</span>
      </div>


      <h3 style={legendStyles.header}>Traceability</h3>
      <div style={legendStyles.item}>
        <div style={{ ...legendStyles.rectangle, ...legendStyles.horizontal }}>
          <span>Verifies</span>
        </div>
        <span>Horizontal</span>
      </div>
      <div style={legendStyles.item}>
        <div style={{ ...legendStyles.rectangle, ...legendStyles.vertical }}>
          <span>Satisfies</span>
        </div>
        <span>Vertical</span>
      </div>
    </div>
  );
};

export default Legend;