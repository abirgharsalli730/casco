import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { restePasswordSchema } from "../validations/user.schema";
import { useFormik } from "formik";
import { createNewPassword } from "../redux/user/user.slice";

const Reset = () => {
  const dispatch = useDispatch();
  const { id, token } = useParams();
  const resetPassword = () => {
    console.log("values", values);
    dispatch(createNewPassword({ id, token, ...values }));
  };
  const navigate = useNavigate();
  const { checkResetPassword } = useSelector((state) => state.user);
  /*===== formik and yup =====*/
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        password: "",
        confirm_password: "",
      },
      validationSchema: restePasswordSchema,
      onSubmit: resetPassword,
    });
  /*=====// formik and yup //=====*/

  useEffect(() => {
    {
      checkResetPassword && navigate("/sigin");
    }
  }, [checkResetPassword]);
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
        onSubmit={handleSubmit}
        className="border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem]"
      >
        <h1 className="uppercase text-xl mb-4 font-bold">New Password</h1>
        <div className="form-outline mb-4">
          <input
            type="password"
            placeholder="Enter Password"
            autoComplete="off"
            className="form-control rounded-0 p-2"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus={true}
          />
          <span className="text-red-700">
            {touched.password && errors.password && errors.password}
          </span>
        </div>
        <div className="form-outline mb-4">
          <input
            type="password"
            placeholder="Enter confirm password"
            autoComplete="off"
            name="confirm_password"
            value={values.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-control rounded-0 p-2"
          />
          <span className="text-red-700">
            {touched.confirm_password &&
              errors.confirm_password &&
              errors.confirm_password}
          </span>
        </div>
        <button
          className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
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

export default Reset;