import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EmailSchema } from "../validations/user.schema";
import { useFormik } from "formik";
import { forgotPassword } from "../redux/user/user.slice";

const Forget = () => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // axios.defaults.withCredentials = true;

  const sendforgetPass = (e) => {
    console.log("value", values);
    dispatch(forgotPassword(values));
  };
  /*===== formik and yup =====*/
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: EmailSchema,
      onSubmit: sendforgetPass,
    });
  /*=====// formik and yup //=====*/
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
        onSubmit={handleSubmit}
      >
        <h1 className="uppercase text-xl mb-4 font-bold">Reset Password </h1>
        <h5 className="uppercase text-xl mb-4 font-bold">Please enter the email address that you used to register, and we will send you a link to reset your password via Email.</h5>
        <div className="form-outline mb-4">
          <input
            type="email"
            placeholder="Enter Email"
            autoComplete="off"
            name="email"
            className="form-control rounded-0 p-2"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus={true}
          />
        </div>
        <span className="text-red-700">
          {touched.email && errors.email && errors.email}
        </span>
        <button
          // disabled={loading}
          className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
          style={{ width: '5rem' }}
          type="submit"
        >
          Reset
        </button>

        <Link to="/signin" className="capitalize underline mb-4">
          Return To Sign In
        </Link>
      </form>
    </div>
  );
};

export default Forget;