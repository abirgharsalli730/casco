import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";


const UserRoutes = () => {
  const { isAuth } = useSelector((state) => state.user);
  return isAuth ? <Outlet /> : <Navigate to="/signin" />;
};

export default UserRoutes;
