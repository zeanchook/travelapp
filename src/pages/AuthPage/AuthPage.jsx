import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import React from "react";


export default function AuthPage() {

  const [options, setOptions] = useState("signup")

  return (
    <>
      {options === "signup" ? 
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}><SignUpForm setOptions={setOptions}/></div> : 
      <LoginForm setOptions={setOptions}/>}
    </>
  );
}
