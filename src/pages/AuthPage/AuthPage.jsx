import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignUpForm from "../../components/SignUpForm/SignUpForm";

export default function AuthPage() {

  const [options, setOptions] = useState("signup")

  return (
    <>
      {options === "signup" ? 
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>Sign Up<SignUpForm setOptions={setOptions}/></div> : 
      <LoginForm setOptions={setOptions}/>}
    </>
  );
}
