import { Link } from "react-router-dom";
import React, {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginUser } from "../redux/user/user.slice.js";
import { useDispatch, useSelector } from "react-redux";
import { loginSchema } from "../validations/user.schema.js";
import Footer from "../layout/Footer";

const SignIn = ({ reload, setReload }) => {
  // get all users
  const users = useSelector((state) => state.user?.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  const { isAuth, loading } = useSelector((state) => state.user);
  const login = () => {
    dispatch(loginUser(values));
  


    console.log("values", values);
  };
  /*===== formik and yup =====*/
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: login,
    });
  /*=====// formik and yup //=====*/
  useEffect(() => {
    {
      isAuth && navigate("/account");
      setReload(!reload)
    }
  }, [isAuth]);
  const error = false;

  // -------------------- get writen email ---------------------
  // Define a custom handleChange function to log the email value
  const handleChangeWithEmailLog = (e) => {
    const { name, value } = e.target;
    console.log(`Email changed: ${value}`); // Log the email value
    handleChange(e); // Call the original handleChange function
  };

  return (
    <div>

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
          onSubmit={handleSubmit}
        >
          <h1 className="uppercase text-xl mb-4 font-bold">Sign In </h1>
          <input
            className="p-2 mb-4 border-2 rounded focus:outline-none"
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={(e) => {
              handleChange(e);
              handleChangeWithEmailLog(e);
            }}
            onBlur={handleBlur}
            autoFocus={true}
          />
          <input
            className="p-2 mb-4 border-2 rounded focus:outline-none"
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

        
          <Link to="/forgot-password" className="text-sm underline mb-4">
            Forgot password?
          </Link>
          <button
            // disabled={loading}
            className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
            onClick={handleSubmit}
          >
            Sign In
          </button>
          {users?.map((el) => <>
            {el?.email == values.email && el?.isValidate == true ? <>

            </> :
              <>
              </>
            }
          </>)}
       

          <Link to="/signup" className="capitalize underline mb-4">
            Don't have an account ? Create one
          </Link>
          {/* <p> {error ? error.message || "Something went wrong!" : ""} </p> */}
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default SignIn;