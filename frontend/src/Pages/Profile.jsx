import { useSelector } from "react-redux";
import ErrorPage from "./ErrorPage";
import Header from "../components/Profile/Header";
import UserPodcast from "../components/Profile/UserPodcast";

const Profile = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <>
      {isLoggedIn ? (
        <div>
          <Header />
          <UserPodcast />
        </div>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default Profile;
