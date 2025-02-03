import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import HomePage from "./Pages/HomePage";
import Categories from "./Pages/Categories";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import Profile from "./Pages/Profile";
import AddPodcast from "./Pages/AddPodcast";
import AllPodcasts from "./Pages/AllPodcasts";
import CategoryPage from "./Pages/CategoryPage";
import DescriptionPage from "./Pages/DescriptionPage";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { authAction } from "./store/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Utility function to check the authentication cookie
const checkCookie = async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:8080/api/v1/check-cookie", {
      withCredentials: true,
    });
    if (res.data.message === "true") {
      dispatch(authAction.login());
    }
  } catch (error) {
    toast.error("Failed to verify session. Please log in again.");
    console.error("Error checking cookie:", error);
  }
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    checkCookie(dispatch);
  }, [dispatch]);

  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:cat" element={<CategoryPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-podcast" element={<AddPodcast />} />
            <Route path="all-podcasts" element={<AllPodcasts />} />
            <Route path="description/:id" element={<DescriptionPage />} />
          </Route>

          {/* Auth Layout Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<LogIn />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
