import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import { useDispatch } from "react-redux";
import { updateUserSchema } from "../../validations/user.schema.js";
import { logOut, updateUser } from "../../redux/user/user.slice.js";
import DeleteUserModal from "../../components/DeleteUserModal.jsx";

const ProfileContainer = ({ userInfo, id }) => {
const isAuth = localStorage.getItem("persist:user");

  const { userInfo: reduxUserInfo, loading: reduxLoading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ profilePicture: downloadURL })
        );
      }
    );
  };

  const updatedProfile = (formData) => {
    console.log("values", values);
    dispatch(updateUser({ id, ...values, ...formData }));
  };

  const handleSignOut = async () => {
    console.log("logOut");
    dispatch(logOut(id));
   
  };

  /*===== formik and yup =====*/

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: `${userInfo?.email}`,
        username: `${userInfo?.username}`,
        password: "",
        confirm_password: "",
        profilePicture: `${userInfo?.profilePicture}`,
      },
      validationSchema: updateUserSchema,
      onSubmit: (values) => {
        updatedProfile(formData);
      },
    });

 
  /*=====// formik and yup //=====*/
  return (
    <>
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
          className="border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem] gap-4"
        >

          <h1 className="uppercase text-xl mb-4 font-bold">PROFILE</h1>
         
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <img
            src={formData.profilePicture || userInfo.profilePicture}
            alt="profile"
            className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
            onClick={() => fileRef.current.click()}
            title="Upload your profile picture"
          />
          <p className="text-sm self-center">
            {imageError ? (
              <span className="text-red-700">
                Error uploading image (file size must be less than 2 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className="text-green-700">
                Image uploaded successfully
              </span>
            ) : (
              ""
            )}
          </p>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full md:w-1/2">
          <input
            className="p-2 mb-4 border-2 rounded focus:outline-none"
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            title="Update Username"
          />
          <span className="text-red-700">
            {touched.username && errors.username && errors.username}
          </span>
          </div>
          <div className="flex flex-col w-full md:w-1/2">
          <input
            className="p-2 mb-4 border-2 rounded focus:outline-none"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            title="Update Email"
          />
          <span className="text-red-700">
            {touched.email && errors.email && errors.email}
          </span>
          </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full md:w-1/2">
          <input
            className="p-2 mb-4 border-2 rounded focus:outline-none"
            type="password"
            placeholder="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            title="Update password or enter the old one"
          />
          <span className="text-red-700">
            {touched.password && errors.password && errors.password}
          </span>
          </div>
          <div className="flex flex-col w-full md:w-1/2">
          <input
            className="block p-2 border-2 rounded focus:outline-none"
            type="password"
            placeholder="confirm password"
            name="confirm_password"
            value={values.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            title="confirm your password"
          />
          <span className="text-red-700">
            {touched.confirm_password &&
              errors.confirm_password &&
              errors.confirm_password}
          </span>
          </div>
          </div>

          <button
             className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
            type="submit"
          >
            {loading ? "Loading..." : "Update"}
          </button>
     
          <div className="flex justify-between mt-5">
            
         {/* <DeleteUserModal id={id} /> */} 
            <div className="w-9"></div> 
            
            <Link to='/signin'>
            <span
              onClick={handleSignOut}
              className="text-red-700 cursor-pointer"
            >
              Sign out
            </span>
            </Link>
          
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileContainer;
