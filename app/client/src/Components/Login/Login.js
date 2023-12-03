import React, { useState, useEffect } from "react";
// import "../appStyle.css";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import { useSignIn } from "react-auth-kit";
import "react-toastify/dist/ReactToastify.css";

const { useSignIn } = require("react-auth-kit");
const Login = ({ setUserState, setIsLoginDisplay }) => {
  const navigate = useNavigate();
  //   console.log(rak.__proto__);
  const signIn = useSignIn();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };
  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    if (Object.keys(error).length > 0) {
      toast.error("Validation Failed !", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1200,
      });
      console.log(error);
      return error;
    } else {
      return undefined;
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    if (errors) {
      setFormErrors(errors);
      return;
    }
    try {
      const response = await axios.post("/login", {
        email: user.email,
        password: user.password,
      });
      console.log(response);
      signIn({
        token: response.data.jwt,
        expiresIn: 120, //2hrs
        tokenType: "Bearer",
        authState: {
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        },
      });
      toast.success("Login successful", {
        autoClose: 1500,
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/");
    } catch (error) {
      toast.error("Error in Login!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1200,
      });
    }
    setIsSubmit(true);
    // if (!formErrors) {

    // }
  };

  useEffect(() => {
    setIsLoginDisplay(true);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios.post("http://localhost:9002/login", user).then((res) => {
        alert(res.data.message);
        setUserState(res.data.user);
        navigate("/", { replace: true });
      });
    }
    return () => {
      setIsLoginDisplay(false);
    };
  }, [formErrors]);
  return (
    <div className={basestyle.authContainer}>
      <div className={loginstyle.login}>
        <form>
          <h1 style={{ color: "#011f3d" }}>Login</h1>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={changeHandler}
            value={user.email}
          />
          <p className={basestyle.error}>{formErrors.email}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <p className={basestyle.error}>{formErrors.password}</p>
          <button className={basestyle.button_common} onClick={loginHandler}>
            Login
          </button>
        </form>
        <NavLink to="/signup">Not yet registered? Register Now</NavLink>
      </div>
    </div>
  );
};
export default Login;
