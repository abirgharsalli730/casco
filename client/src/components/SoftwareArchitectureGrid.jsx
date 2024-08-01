import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const SoftwareArchitectureGrid = ({rows}) => {
  console.log(rows)

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'summary', headerName: 'Summary', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'Parameter 1', headerName: 'Parameter 1', width: 130 },
    { field: 'Return Value', headerName: 'Return Value', width: 130 },
    { field: 'Precondition', headerName: 'Precondition', width: 180 },
    { field: 'Post condition', headerName: 'Post condition', width: 130 },
    { field: 'Error Conditions', headerName: 'Error Conditions', width: 130 },
    { field: 'LinkedIssue', headerName: 'Linked Issue', width: 130 },
    
  ];

  const SoftwareArchitectureGrid = (params) => {
    if (params.rowIndex === 0) {
      return 'header-row';
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      { 
        rows? (<DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowClassName={getRowClassName}
          sx={{
            '.header-row': {
              backgroundColor: '#0097a7', // or any other teal color you prefer
              color: '#ffffff', // or any other text color you prefer
            },
          }}
        />):(<div>No Data Found for this project</div>)
      }
      
    </div>
  );
};

export default SoftwareArchitectureGrid;