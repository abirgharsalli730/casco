import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const SWDD = ({ data }) => {
  const columns = [
    { field: 'ID', headerName: 'ID', width: 200 },
    { field: 'taskName', headerName: 'Summary', width: 200 },
    { field: 'reference', headerName: 'Reference', width: 250 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'parameter', headerName: 'Parameter', width: 150 },
    { field: 'returnValue', headerName: 'Return Value', width: 150 },
    { field: 'precondition', headerName: 'Precondition', width: 200 },
    { field: 'postCondition', headerName: 'Post Condition', width: 300 },
    { field: 'errorConditions', headerName: 'Error Conditions', width: 200 },
  ];

  // Adding id to each row for DataGrid
  const rows = data.map((item) => ({ id: item.ID, ...item }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      {rows.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          sx={{
            '.header-row': {
              backgroundColor: '#0097a7', // Teal color
              color: '#ffffff', // White text color
            },
          }}
        />
      ) : (
        <div>No Data Found</div>
      )}
    </div>
  );
};

export default SWDD;
