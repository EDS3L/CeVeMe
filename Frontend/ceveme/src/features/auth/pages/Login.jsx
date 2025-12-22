import React from "react";
import LoginForm from "../components/LoginForm";
import Navbar from "../../../components/Navbar";

function Login() {
  return (
    <div>
      <Navbar showShadow={true} />
      <LoginForm />
    </div>
  );
}

export default Login;
