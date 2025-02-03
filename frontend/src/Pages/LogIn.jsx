import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../store/auth";
import ErrorPage from "./ErrorPage";
import Loader from "./Loader";

const LogIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!values.email || !values.password) {
      toast.error("Both email and password are required.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/sign-in",
        values,
        {
          withCredentials: true,
        }
      );
      dispatch(authAction.login());
      setValues({ email: "", password: "" });
      toast.success("Logged in successfully!");
      navigate("/profile");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    // Check login status and set loading to false
    setTimeout(() => {
      setLoading(false); // Remove loading after checking login status
    }, 2000); // Simulate checking the login status
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <ErrorPage />
      ) : (
        <div className="h-screen bg-green-100 flex items-center justify-center">
          <ToastContainer />
          <div className="flex flex-col items-center justify-center w-4/6 md:w-3/6 lg:w-2/6">
            <Link to={"/"} className="text-2xl font-bold">
              PODCASTER
            </Link>
            <div className="mt-6">
              <div className="flex flex-col mt-2">
                <label>Email</label>
                <input
                  type="email"
                  className="mt-2 px-2 py-1 border border-black rounded"
                  required
                  placeholder="Email"
                  name="email"
                  value={values.email}
                  onChange={change}
                />
              </div>
              <div className="flex flex-col mt-2">
                <label>Password</label>
                <input
                  type="password"
                  className="mt-2 px-2 py-1 border border-black rounded"
                  required
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={change}
                />
              </div>
              <div className="flex flex-col mt-4">
                <button
                  className="bg-green-900 font-semibold rounded py-2 text-xl text-white"
                  onClick={handleOnClick}
                >
                  LogIn
                </button>
              </div>
              <div className="text-center mt-2 font-semibold">or</div>
              <div className="flex mt-4 text-bold">
                <p>Don't have an account?</p>
                <Link
                  className="font-semibold hover:text-blue-600"
                  to={"/signup"}
                >
                  SignUp
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogIn;
