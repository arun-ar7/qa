import React, { useEffect, useState } from "react";
import basestyle from "../Base.module.css";
import registerstyle from "./Register.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { useNavigate, NavLink } from "react-router-dom";
const Register = ({ setIsLoginDisplay }) => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
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
    const regex = /^[a-zA-Z0-9._-]+@softwareag\.com$/;
    if (!values.fname) {
      error.fname = "First Name is required";
    }
    if (!values.lname) {
      error.lname = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Invalid Email format (format : user@softwareag.com)";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    if (Object.keys(error).length > 0) {
      toast.error("Validation Failed !", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1200,
      });
      return error;
    } else {
      return undefined;
    }
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    if (errors) {
      setFormErrors(errors);
    } else {
      try {
        const response = await axios.post("/signup", {
          firstName: user.fname,
          lastName: user.lname,
          email: user.email,
          password: user.password,
        });
        toast.success("Registration success. Now login using your password", {
          autoClose: 4000,
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login", { replace: true });
      } catch (error) {
        console.log(error);
      }
      setIsSubmit(true);
    }
    // if (!formErrors) {
    //   setIsSubmit(true);
    // }
  };

  useEffect(() => {
    setIsLoginDisplay(true);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios.post("http://localhost:9002/signup/", user).then((res) => {
        alert(res.data.message);
        navigate("/login", { replace: true });
      });
    }
    return () => {
      setIsLoginDisplay(false);
    };
  }, [formErrors]);
  return (
    <div className={basestyle.authContainer}>
      <div className={registerstyle.register}>
        <form>
          <h1 style={{ color: "#011f3d" }}>Create your account</h1>
          <input
            type="text"
            name="fname"
            id="fname"
            placeholder="First Name"
            onChange={changeHandler}
            value={user.fname}
          />
          <p className={basestyle.error}>{formErrors.fname}</p>
          <input
            type="text"
            name="lname"
            id="lname"
            placeholder="Last Name"
            onChange={changeHandler}
            value={user.lname}
          />
          <p className={basestyle.error}>{formErrors.lname}</p>
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
          <input
            type="password"
            name="cpassword"
            id="cpassword"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.cpassword}
          />
          <p className={basestyle.error}>{formErrors.cpassword}</p>
          <button className={basestyle.button_common} onClick={signupHandler}>
            Register
          </button>
        </form>
        <NavLink to="/login">Already registered? Login</NavLink>
      </div>
    </div>
  );
};
export default Register;
