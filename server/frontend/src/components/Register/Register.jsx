import React, { useState } from "react";
import "./Register.css";

import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";


const Register = () => {

  // ============================================================
  // State variables
  // ============================================================

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


  // ============================================================
  // Go to Home
  // ============================================================

  const gohome = () => {
    window.location.href = window.location.origin;
  };


  // ============================================================
  // Register
  // ============================================================

  const register = async (e) => {

    e.preventDefault();

    // Check required fields
    if (!userName || !password || !email) {
      alert("Please enter username, password, and email.");
      return;
    }

    // Build registration URL
    const register_url =
      window.location.origin + "/djangoapp/register";

    try {

      // Send POST request to Django
      const res = await fetch(register_url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userName: userName,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email
        }),
      });


      // Convert response to JSON
      const json = await res.json();


      // Registration successful
      if (json.status === "Authenticated") {

        // Save username in session
        sessionStorage.setItem(
          "username",
          json.userName
        );

        // Go to Home
        window.location.href =
          window.location.origin;

        return;
      }


      // Username already exists
      if (json.error === "Already Registered") {

        alert(
          "The user with the same username is already registered."
        );

        return;
      }


      // Other errors
      if (json.error) {

        alert(json.error);

        return;
      }


      // Unknown response
      alert("Registration failed.");

    } catch (error) {

      console.error("Registration error:", error);

      alert(
        "Unable to connect to the server."
      );
    }
  };


  // ============================================================
  // HTML
  // ============================================================

  return (

    <div
      className="register_container"
      style={{ width: "50%" }}
    >

      {/* Header */}

      <div
        className="header"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >

        <span
          className="text"
          style={{ flexGrow: "1" }}
        >
          Sign Up
        </span>


        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifySelf: "end",
            alignSelf: "start"
          }}
        >

          <a
            href="/"
            onClick={gohome}
            style={{
              justifyContent: "space-between",
              alignItems: "flex-end"
            }}
          >

            <img
              style={{ width: "1cm" }}
              src={close_icon}
              alt="Close"
            />

          </a>

        </div>

      </div>


      <hr />


      {/* Registration Form */}

      <form onSubmit={register}>

        <div className="inputs">


          {/* Username */}

          <div className="input">

            <img
              src={user_icon}
              className="img_icon"
              alt="Username"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input_field"
              value={userName}
              onChange={(e) =>
                setUserName(e.target.value)
              }
              required
            />

          </div>


          {/* First Name */}

          <div className="input">

            <img
              src={user_icon}
              className="img_icon"
              alt="First Name"
            />

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="input_field"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
            />

          </div>


          {/* Last Name */}

          <div className="input">

            <img
              src={user_icon}
              className="img_icon"
              alt="Last Name"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="input_field"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
            />

          </div>


          {/* Email */}

          <div className="input">

            <img
              src={email_icon}
              className="img_icon"
              alt="Email"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input_field"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* Password */}

          <div className="input">

            <img
              src={password_icon}
              className="img_icon"
              alt="Password"
            />

            <input
              name="psw"
              type="password"
              placeholder="Password"
              className="input_field"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


        </div>


        {/* Register Button */}

        <div className="submit_panel">

          <input
            className="submit"
            type="submit"
            value="Register"
          />

        </div>

      </form>

    </div>
  );
};


export default Register;