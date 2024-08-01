import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const SWAD = ({ data }) => {
  console.log(data);

  const columns = [
    { field: 'taskname', headerName: 'ID', width: 150 },
    { field: 'reference', headerName: 'Reference', width: 150 },
    { field: 'summary', headerName: 'Summary', width: 150 },
    { field: 'interfaceName', headerName: 'Interface Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'parameters', headerName: 'Parameters', width: 200 },
    { field: 'returns', headerName: 'Returns', width: 200 },
  ];

  // Flatten the interfaceDetails for all tasks and add taskname and reference to each row, excluding the first element of interfaceDetails
  const rows = data.flatMap((task, taskIndex) =>
    task.interfaceDetails.slice(1).map((detail, detailIndex) => ({
      id: `${taskIndex}-${detailIndex}`,
      taskname: task.taskname,
      reference: task.reference,
      summary: task.summary,
      ...detail
    }))
  );

  // Group rows by taskname, reference, and summary
  const groupedRows = rows.reduce((acc, row) => {
    const key = `${row.taskname}-${row.reference}-${row.summary}`;
    if (!acc[key]) {
      acc[key] = {
        ...row,
        details: []
      };
    }
    acc[key].details.push(row);
    return acc;
  }, {});

  return (
    <TableContainer component={Paper}>
      <Table sx={{ borderCollapse: 'separate', borderSpacing: 0, '& .MuiTableCell-root': { border: '1px solid black' } }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>{col.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(groupedRows).map((group, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell rowSpan={group.details.length}>{group.taskname}</TableCell>
                <TableCell rowSpan={group.details.length}>{group.reference}</TableCell>
                <TableCell rowSpan={group.details.length}>{group.summary}</TableCell>
                <TableCell>{group.details[0].interfaceName}</TableCell>
                <TableCell>{group.details[0].description}</TableCell>
                <TableCell>{group.details[0].parameters}</TableCell>
                <TableCell>{group.details[0].returns}</TableCell>
              </TableRow>
              {group.details.slice(1).map((detail, detailIndex) => (
                <TableRow key={detailIndex}>
                  <TableCell>{detail.interfaceName}</TableCell>
                  <TableCell>{detail.description}</TableCell>
                  <TableCell>{detail.parameters}</TableCell>
                  <TableCell>{detail.returns}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SWAD;
