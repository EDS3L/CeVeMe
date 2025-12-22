import React from "react";
import RegisterForm from "../components/RegisterForm";
import Navbar from "../../../components/Navbar";

function Register() {
  return (
    <div>
      <Navbar showShadow={true} />
      <RegisterForm />
    </div>
  );
}

export default Register;
