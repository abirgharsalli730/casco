import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const CustomerGrid = ({rows}) => {
  console.log(rows)

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'summary', headerName: 'Summary', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'projectName', headerName: 'Project Name', width: 130 },
    { field: 'createdBy', headerName: 'Created By', width: 130 },
    { field: 'createdTime', headerName: 'Created Time', width: 180 },
    { field: 'issueType', headerName: 'Issue Type', width: 130 },
    { field: 'assignee', headerName: 'Assignee', width: 130 },
    { field: 'LinkedIssues', headerName: 'Linked Issues', width: 130 },
    { field: 'priority', headerName: 'Priority', width: 130 },
    { field: 'customerDocumentName', headerName: 'Document Name', width: 150 },
    { field: 'customerDocumentVersion', headerName: 'Document Version', width: 150 },
    { field: 'customerDocumentReference', headerName: 'Document Reference', width: 150 },
    { field: 'requirementAllocation', headerName: 'Requirement Allocation', width: 150 },
    { field: 'compliance', headerName: 'Compliance', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'release', headerName: 'Release', width: 130 },
  ];

  const getRowClassName = (params) => {
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

export default CustomerGrid;