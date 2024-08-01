import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects, updateProject, setProjectInfo } from "../redux/project/project.slice";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link,useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  FormControl,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  Pagination,
} from "@mui/material";

const Edit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectsList, loading, errors } = useSelector((state) => state.project);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = (event) => {
    const projectId = event.target.value;
    const selectedProject = projectsList.find((project) => project._id === projectId);
    setSelectedProjectId(projectId);
    setName(selectedProject.name);
    setDescription(selectedProject.description);
    dispatch(setProjectInfo(selectedProject));
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(updateProject({ _id: selectedProjectId, name, description }));
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mb-10">
        <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
          <InputLabel id="demo-select-small-label">Select A project</InputLabel>
          <Select labelId="demo-select-small-label" label="Select A project" onChange={handleChange}>
            {projectsList.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="mt-20 text-center">
        <TableContainer >
          <Table sx={{ textAlign: "center" }}>
            <TableHead>
              <TableRow >
                <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase ">
                  Project Name
                </TableCell>
                <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase">
                  Description
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-black font-bold uppercase ">
                  <TextField value={name} onChange={handleNameChange} />
                </TableCell>
                <TableCell className=" text-black font-bold uppercase">
                  <TextField value={description} onChange={handleDescriptionChange} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody></TableBody>
          </Table>
        </TableContainer>
        <div className="mt-4 text-center">
        {selectedProjectId && (
          <div className="mt-4 text-center">
           <form
          className="border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem]"
          
        >
             <h1 className="uppercase text-xl mb-4 font-bold">Import Project Files</h1>
<div className="row">
  <div className="col-sm-6">
    <div className="card">
      <div className="card-body">
        <h1 className="uppercase text-xl mb-4 font-bold"> Desktop</h1>
        
        <button onClick={() => navigate("/projectManip")}
            className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
            type="submit"
          >  Import</button>

       
      </div>
    </div>
  </div>
  <div className ="col-sm-6">
    <div className="card">
      <div className="card-body">
        <h1 className="uppercase text-xl mb-4 font-bold">Jira</h1>
       
        <button onClick={() => navigate("/jira")}
            className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
            type="submit"
          >  Import</button>
      </div>
    </div>
  </div>
</div>
<Link to={`/project`} className="flex items-center">
    <FaCircleArrowLeft className="mr-2" />
  </Link>

</form>
          </div>
        )}
        </div>
        <div className="mt-4 text-center">
        {selectedProjectId && (
          <div className="mt-4 text-center">
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#2c7a7b",
                "&:hover": {
                  backgroundColor: "#059669",
                },
              }}
            >
              Update Project
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Edit;
