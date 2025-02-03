import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ErrorPage from "./ErrorPage";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!values.username || !values.email || !values.password) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/sign-up",
        values
      );
      setValues({ username: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      // Check if error.response exists before accessing message
      const errorMessage = error.response?.data?.message || "An error occurred.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after checking login status
    }, 2000);
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
          <div className="flex flex-col items-center justify-center w-4/6 md:w-3/6 lg:w-2/6">
            <Link to={"/"} className="text-2xl font-bold">
              PODCASTER
            </Link>
            <div className="mt-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label>Username</label>
                  <input
                    type="text"
                    className="mt-2 px-2 py-1 border border-black rounded"
                    required
                    placeholder="Username"
                    name="username"
                    value={values.username}
                    onChange={change}
                  />
                </div>
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
                    type="submit"
                  >
                    SignUp
                  </button>
                </div>
              </form>
              <div className="text-center mt-2 font-semibold">or</div>
              <div className="flex  mt-4 text-bold">
                Already have an account?
                <Link
                  className="font-semibold hover:text-blue-600"
                  to={"/login"}
                >
                  LogIn
                </Link>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default SignUp;
