import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../App.css";
import "./Home.css";
import React from "react";
import Question from "../Question";
import { useAuthUser, useSignOut } from "react-auth-kit";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const apiUrl = "http://backendserver-container:5000/api";

function Home() {
  const navigate = useNavigate();
  const nameRef = useRef();
  const questionRef = useRef();
  const [data, setData] = useState([]);
  const auth = useAuthUser();
  const signOut = useSignOut();
  const [loading, setLoading] = useState(true);

  const handleUploadQuestion = () => {
    nameRef.current.value = auth().firstName;
    if (!nameRef.current.value || !questionRef.current.value) {
      alert("Name and Question are required!");
      return;
    }

    const askedBy =
      nameRef.current.value.charAt(0).toUpperCase() +
      nameRef.current.value.slice(1);
    const question =
      questionRef.current.value.charAt(0).toUpperCase() +
      questionRef.current.value.slice(1);

    axios.post("/question", { askedBy, question }).then((res) => {
      setData(res.data);
      nameRef.current.value = "";
      questionRef.current.value = "";
    });
  };

  useEffect(() => {
    axios("/data").then((res) => {
      setData(res.data);
      setLoading(false);
      console.log(auth().email);
    });
  }, []);

  return (
    <div className="">
      <div className="header">
        <div className="headerLeft">
          <h2 className="app-heading">Ask Your questions</h2>
        </div>
        <div className="headerRight">
          <button
            type="button"
            className="logoutButton"
            onClick={() => {
              Cookies.remove("_auth_state");
              Cookies.remove("_auth_storage");
              Cookies.remove("_auth_type");
              Cookies.remove("_auth");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="form-container">
        <input
          style={{ display: "none" }}
          spellCheck="false"
          ref={nameRef}
          type="text"
          placeholder="Your Name ..."
        />
        <textarea
          required
          spellCheck="false"
          ref={questionRef}
          type="text"
          placeholder="Ask your question ..."
        ></textarea>
        <button onClick={() => handleUploadQuestion()}>Publish Question</button>
      </div>
      <h2 className="app-heading">Forum Questions</h2>

      <div className="notes-container">
        {loading ? (
          <div className="loader"></div>
        ) : data.length === 0 ? (
          <div className="null-question-data">
            No Questions yet ... Be the first to ask question{" "}
          </div>
        ) : (
          data.map((obj) => {
            return <Question setData={setData} key={obj._id} obj={obj} />;
          })
        )}
      </div>
    </div>
  );
}

export default Home;
