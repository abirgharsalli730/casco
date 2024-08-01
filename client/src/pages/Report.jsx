import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import excelFile from "../assets/excel.xlsx"; 
import { useSelector, useDispatch } from "react-redux";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button, FormControl, Select, InputLabel, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import { fetchProjects, setProjectInfo } from "../redux/project/project.slice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const { projectsList } = useSelector((state) => state.project);
  const [coverageResults, setCoverageResults] = useState(null);
  const [name, setName] = useState(null);
  const [excelData1, setExcelData1] = useState(null);
  const [excelData2, setExcelData2] = useState(null);
  const [workbook, setWorkbook] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = async (event) => {
    const projectId = event.target.value;
    const selectedProject = projectsList.find((project) => project._id === projectId);
    setName(selectedProject.name);
    dispatch(setProjectInfo(selectedProject));
    const response = await axios.post("http://localhost:3001/api/coverage/cover", { projectName: selectedProject.name });
    setCoverageResults(response.data);
    fillExcelWithData(response.data, selectedProject.name);
  };

  useEffect(() => {
    const processExcelFile = async () => {
      const response = await fetch(excelFile);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Get raw rows
      setExcelData1(data.slice(0, 4));
      setExcelData2(data.slice(4));
      setWorkbook(workbook);
    };

    processExcelFile();
  }, []);

  const fillExcelWithData = (coverageResults, name) => {
    if (coverageResults && workbook) {
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Find and update the cell that indicates "PROJECT NAME:"
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          if (data[i][j] === "PROJECT NAME:") {
            worksheet[XLSX.utils.encode_cell({ r: i, c: j })] = { v: "PROJECT NAME: " + name, t: 's' };
            break;
          }
        }
      }
  
      // Adding coverage results starting from the 5th row
      const startingRow = 5;
      const newRows = coverageResults.customer.map((issue) => {
        const systemIssues = issue.cycleIssues.filter((cycleIssue) => cycleIssue.type === "system");
        const taskIssues = issue.cycleIssues.filter((cycleIssue) => cycleIssue.type === "task");
        const softwareIssues = issue.cycleIssues.filter((cycleIssue) => cycleIssue.type === "software");
  
        // Extracting software keys from softwareIssues
        const softwareKeys = softwareIssues.map((softwareIssue) => softwareIssue.key);
  
        // Extracting swad and swdd based on software keys in cycleIssues
        const swadKeys = [];
        const swddKeys = [];
        coverageResults.software.forEach((software) => {
          if (softwareKeys.includes(software.key)) {
            swadKeys.push(software.coverKey.swad)
            swadKeys.push(software.coverKey.swdd)            
          }
        });
        coverageResults.swad.forEach((swad)=>{
          if(swadKeys.includes(swad.key)){
            swddKeys.push(swad.coverKey)
          }
        })
        return [
          issue.key,
          issue.category,
          issue.requirement,
          issue.priority,
          issue.functional,
          issue.cycleCovered ? systemIssues.map((systemIssue) => systemIssue.key).join(', ') : "None", // SYR_ID
          issue.cycleCovered ? taskIssues.map((taskIssue) => taskIssue.key).join(', ') : "None", // SYAD_ID
          issue.cycleCovered ? softwareIssues.map((softwareIssue) => softwareIssue.key).join(', ') : "None", // SWRS_ID
          issue.cycleCovered ? swadKeys.join(',') : "None", // swad
          issue.cycleCovered ? swddKeys.join(',') : "None" // swdd
        ];
      });
  
      XLSX.utils.sheet_add_aoa(worksheet, newRows, { origin: startingRow });
  
      // Update the data state to re-render the component with updated Excel data
      const updatedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData1(updatedData.slice(0, 4));
      setExcelData2(updatedData.slice(4));
    }
  };
  
  
  

  const handleDownload = () => {
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `${name}_coverage_report.xlsx`);
  };

  return (
    <div className="wrapper">
      <div className="mt-2 flex flex-col items-center">
        <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
          <InputLabel id="demo-select-small-label">Select A project</InputLabel>
          <Select
            labelId="demo-select-small-label"
            label="Select A project"
            onChange={handleChange}
          >
            {projectsList.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {name && (
        <>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onClick={handleDownload}
            sx={{ mb: '10px' }}
            startIcon={<CloudDownloadIcon />}
          >
            Download Report
          </Button>

          <div className="viewer">
            {excelData1 ? (
              <>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650, border: '2px solid black' }} aria-label="simple table">
                    <TableBody>
                      {excelData1.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {rowIndex === 0 ? (
                            <TableCell colSpan={10} sx={{ border: '1px solid black', textAlign: 'center' }}>
                              {row[0]}
                            </TableCell>
                          ) : (
                            row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex} colSpan={5} sx={{ border: '1px solid black' }}>
                                {cell}
                              </TableCell>
                            ))
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 550, border: '2px solid black' }} aria-label="simple table">
                    <TableBody>
                      {excelData2.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell
                              key={cellIndex}
                              sx={{
                                border: '1px solid black',
                                width: '100px', // Set a fixed width for each column
                                maxWidth: '100px', // Ensure the maximum width is also fixed
                                overflow: 'hidden', // Handle overflow
                                textOverflow: 'ellipsis', // Display ellipsis for overflowing text
                                whiteSpace: 'nowrap' // Prevent text from wrapping
                              }}
                            >
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </>
            ) : (
              <div>No Data Available!</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
