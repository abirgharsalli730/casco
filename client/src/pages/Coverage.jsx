import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector, useDispatch } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl, Select, InputLabel, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { fetchProjects, setProjectInfo } from "../redux/project/project.slice";
import axios from "axios";

const Coverage = () => {
  const dispatch = useDispatch();
  const { projectsList } = useSelector((state) => state.project);
  const [description, setDescription] = useState("");
  const [coverageResults, setCoverageResults] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = async (event) => {
    const projectId = event.target.value;
    const selectedProject = projectsList.find((project) => project._id === projectId);

    setDescription(selectedProject.description);
    dispatch(setProjectInfo(selectedProject));

    const response = await axios.post("http://localhost:3001/api/coverage/cover", { projectName: selectedProject.name });
    setCoverageResults(response.data);
  };

  const calculateCoveragePercentage = () => {
    if (!coverageResults || !coverageResults.customer) return 0;

    const totalIssues = coverageResults.customer.length;
    const cycleCoveredIssues = coverageResults.customer.filter(issue => issue.cycleCovered).length;

    return Math.round((cycleCoveredIssues / totalIssues) * 100) || 0;
  };



  const getSummaryByType = () => {
    if (!coverageResults) return [];

    return Object.entries(coverageResults).map(([type, issues]) => {
      const total = issues.length;
      const covered = issues.filter(issue => issue.covered).length;
      const uncovered = total - covered;
      return { type, total, covered, uncovered };
    });
  };

  return (
    <div style={{
      backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      overflow: 'hidden',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div className="mt-2 flex flex-col items-center">
        <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
          <InputLabel id="demo-select-small-label">
            Select A project
          </InputLabel>
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
      <div className='px-6 w-full h-screen flex justify-center items-center'>
        <div className="container-fluid p-0">
          <div className="row">
            {coverageResults && (
              <>
                <div style={{ maxHeight: '60vh', overflow: 'auto', width: '100%' }}>
                  <h2 style={{ textAlign: 'center' }}>Issues Table</h2>
                  <TableContainer component={Paper}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Key</TableCell>
                          <TableCell>IssueLink1</TableCell>
                          <TableCell>LinkedIssue1</TableCell>
                          <TableCell>IssueLink2</TableCell>
                          <TableCell>LinkedIssue2</TableCell>
                          <TableCell>Covered</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(() => {
                          const rows = [];
                          const typeCounts = {};

                          // Calculate row spans
                          Object.entries(coverageResults).forEach(([type, issues]) => {
                            typeCounts[type] = issues.length;
                            issues.forEach(issue => {
                              rows.push({ type, ...issue });
                            });
                          });

                          return rows.map((row, index) => (
                            <TableRow key={row.key}>
                              {index === 0 || row.type !== rows[index - 1].type ? (
                                <TableCell rowSpan={typeCounts[row.type]}>{row.type}</TableCell>
                              ) : null}
                              <TableCell>{row.key}</TableCell>
                              <TableCell>{row.issueLink1 ? row.issueLink1 : "None"}</TableCell>
                              <TableCell>{row.linkedissues1 ? row.linkedissues1.join(", ") : "None"}</TableCell>
                              <TableCell>{row.issueLink2 ? row.issueLink2 : "None"}</TableCell>
                              <TableCell>{row.linkedissues2 ? row.linkedissues2.join(", ") : "None"}</TableCell>
                              <TableCell>{row.covered ? "Yes" : "No"}</TableCell>
                            </TableRow>
                          ));
                        })()}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Summary Table</h2>
                  <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Total Issues</TableCell>
                          <TableCell>Covered Issues</TableCell>
                          <TableCell>Uncovered Issues</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getSummaryByType().map(({ type, total, covered, uncovered }) => (
                          <TableRow key={type}>
                            <TableCell>{type}</TableCell>
                            <TableCell>{total}</TableCell>
                            <TableCell>{covered}</TableCell>
                            <TableCell>{uncovered}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                <div style={{ textAlign: 'center', width: '100%' }}>
                  <h1><b>Customer Issues Cycle Coverage: {calculateCoveragePercentage()}%</b></h1>
                </div>
                <div className="progress-legend" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'green', marginRight: '10px' }}></div>
                    <span>Covered</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'red', marginRight: '10px' }}></div>
                    <span>Uncovered</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <ProgressBar style={{ height: '40px', width: '50%', marginBottom: '20px' }} className="mt-3">
                    <ProgressBar striped variant="success" now={calculateCoveragePercentage()} key={1} label={`${calculateCoveragePercentage()}%`} />
                    <ProgressBar striped variant="danger" now={100 - calculateCoveragePercentage()} key={2} label={`${100 - calculateCoveragePercentage()}%`} />
                  </ProgressBar>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
