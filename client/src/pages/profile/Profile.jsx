import { useDispatch, useSelector } from "react-redux";
import ProfileContainer from "./ProfileContainer";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUser } from "../../redux/user/user.slice";

const Profile = () => {
  const { userInfo, loading } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser({ id }));
  }, [id]);
  return (
    <div>{!loading && <ProfileContainer userInfo={userInfo} id={id} />}</div>
  );
};

export default Profile;
