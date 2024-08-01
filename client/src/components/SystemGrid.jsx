import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const SystemGrid = ({rows}) => {
 
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
    { field: 'FuSaASILLevel', headerName: 'FuSa ASIL Level', width: 150 },
    { field: 'Components', headerName: 'Component/s', width: 150 },
    { field: 'Functional', headerName: 'Functional', width: 150 },
    { field: 'requirementAllocation', headerName: 'Requirement Allocation', width: 150 },
    { field: 'Feasible', headerName: 'Feasible', width: 130 },
    { field: 'Verifiable', headerName: 'Verifiable', width: 130 },
    { field: 'Verificationcriteria', headerName: 'Verification criteria', width: 130 },
    { field: 'Buildpriority', headerName: 'Build priority', width: 130 },
    { field: 'RiskItem', headerName: 'Risk Item', width: 130 },
    { field: 'Release', headerName: 'Release', width: 130 },
    { field: 'Status', headerName: 'Status', width: 130 },
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

export default SystemGrid;