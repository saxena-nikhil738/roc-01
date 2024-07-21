import { useScrollTrigger } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./OTP.css";
import BASE_URL from "../Config/Config";

const OTPVarification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showOTP, setShowOTP] = useState(false);
  const [resent, setResent] = useState(true);
  const { email } = location.state;
  const [checkEmail, setCheckEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const inputRefs = useRef([]);

  const sendOTP = async () => {
    await axios
      .post(`${BASE_URL}/sendOTPsql`, { email })
      .then((res) => {
        countdown();
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast("Failed to send OTP");
        console.log(error);
      });
  };
  useEffect(() => {
    document.getElementById("resendBtn").disabled = true;
    document.getElementById("tracker").style.display = "block";
    const indexBeforeAt = email.indexOf("@");
    setCheckEmail(
      email.substring(0, indexBeforeAt - 3) +
        "***" +
        email.substring(indexBeforeAt)
    );
    sendOTP();
  }, [resent]);

  const verify = async () => {
    console.log(OTP);
    const { email } = location.state;
    console.log(email);
    try {
      const res = await axios.post(`${BASE_URL}/verifyOTPsql`, {
        email,
        OTP,
      });
      console.log(res.data);
      if (res.data.success === true) {
        navigate("/login");
        toast.success("User registered");
      } else {
        toast.error("invalid OTP");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to decrement the timer every second
  function countdown() {
    let timer = 5;
    const timerElement = document.getElementById("timer");

    const interval = setInterval(() => {
      timer--;
      timerElement.innerHTML = timer;

      if (timer === 0) {
        document.getElementById("timer").innerHTML = 5;
        clearInterval(interval); // Stop the countdown when timer reaches 0
        document.getElementById("tracker").style.display = "none";
        document.getElementById("resendBtn").disabled = false; // Enable the resend button
      }
    }, 1000); // Update every 1 second
  }

  const refresh = () => {
    document.getElementById("resendBtn").disabled = true;
    console.log("object");
    setResent(!resent);
  };

  const handleChange = (index, value) => {
    const newOTP = OTP.slice(0, index) + value + OTP.slice(index + 1);
    setOTP(newOTP);

    // Move focus to the next input field if the current input field is filled
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div>
      <div className="container-f">
        <div className="form">
          {<h2>Verify Email</h2>}
          <p>Enter 6 digit code you have received on {checkEmail}</p>
          <label className="title" htmlFor="OTP">
            Enter OTP
          </label>

          <div className="boxes">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={OTP[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                ref={(input) => {
                  inputRefs.current[index] = input;
                }}
              />
            ))}
          </div>

          <button onClick={verify} className="create-button">
            VERIFY
          </button>
          <div style={{ margin: "10px" }}>
            <button
              id="resendBtn"
              onClick={refresh}
              style={{ cursor: "pointer" }}
              //   disabled
            >
              Resend OTP
            </button>
            <span id="tracker">
              <span id="timer" style={{ marginLeft: "10px" }}>
                5
              </span>{" "}
              seconds remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVarification;
