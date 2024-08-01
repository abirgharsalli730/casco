import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Import = () => {
  const navigate = useNavigate();
  return (
    <div
      className="px-4 w-full h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <form
        className="border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem]"
      >
        <h1 className="uppercase text-xl mb-4 font-bold">Import Project Files</h1>
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h1 className="uppercase text-xl mb-4 font-bold">Desktop</h1>
                <button 
                  onClick={() => navigate("/projectManip")}
                  className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
                  type="button"
                > 
                  Import
                </button>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h1 className="uppercase text-xl mb-4 font-bold">Jira</h1>
                <button 
                  onClick={() => navigate("/jira")}
                  className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
                  type="button"
                > 
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
        <Link to="/project" className="flex items-center">
          <FaCircleArrowLeft className="mr-2" />
        </Link>
      </form>
    </div>
  );
};

export default Import;
