import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/project/project.slice";
import ProjectCard from "../components/ProjectCard.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const Account = () => {
  const dispatch = useDispatch();
  const { projectsList, loading, errors } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div
      className="d-flex flex-column align-items-center vh-100"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <div>
        <h1 className='uppercase text-xl mb-4 font-bold'>Your Projects</h1>
      </div>

      <div className="cards-container container-fluid">
        {loading && <div>Loading...</div>}
        {errors && <div>Error: {errors}</div>}
        <div className="d-flex">
          {projectsList.map((project) => (
            <ProjectCard
              key={project._id}
              title={project.name}
              content={project.description}
              createdAt={project.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
