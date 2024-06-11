import debug from "debug";
import { Component } from "react";
import { signUp } from "../../utilities/users-service";

import { useAtom } from "jotai";

import { useState } from "react";
import { loginSts } from "../../../atom";

const log = debug("mern:components:SignUpForm");

export default function SignUpForm({setOptions}){

  const initstate = {
    name: "",
    email: "",
    password: "",
    confirm: "",
    error: "",
  };

  const [user,setUser] = useAtom(loginSts);
  const [state,setState] = useState(initstate)
  // console.log(state)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { ...state };
    console.log(state)
    console.log(formData)
    delete formData.error;
    delete formData.confirm;

    try {
      const user = await signUp(formData);
      log("user: %o", user);
      setUser(user);
    } catch (error) 
    {
      console.log(error)
      setState({ error: "Sign Up Failed" });
    }
  };

  return (
      // <div>
      //   Sign Up
      <div style={{width: "100vw",height: "93vh",background:'url("https://i.redd.it/jmp3w2up1z0d1.jpeg")', backgroundSize:"cover",
      display:"flex",alignItems:"center",}}>
       
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit} style={{borderRadius:"10px",backgroundColor:"white",padding:"50px",opacity:"90%",display:'flex',flexDirection:'column'}}
        // style={{background:'url("https://i.redd.it/10e6ttd0fp4d1.jpeg")', backgroundSize:"cover"}}
        >
     <b style={{fontSize:"30px",textAlign:"center"}}>Sign Up</b>
  <div className="mb-5">
    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Name</label>
    <input type="name" value={state.name} onChange={handleChange} name="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
  </div>

  <div className="mb-5">
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your Email</label>
    <input type="email" value={state.email} onChange={handleChange} name="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
  </div>

  <div className="mb-5">
    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
    <input type="password" value={state.password} onChange={handleChange} name="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
  </div>

  <div className="mb-5">
    <label htmlFor="confirm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Repeat password</label>
    <input type="confirm" value={state.confirm} onChange={handleChange} name="confirm" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
  </div>

  <div className="flex items-start mb-5">
    <div className="flex items-center h-5">
      <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
    </div>

    <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
  </div>
  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
  <div className="mt-6 text-center ">
      <a className="text-sm text-blue-500 hover:underline dark:text-blue-400" onClick={()=>setOptions("login")}>
          Already have an account?
      </a>
  </div>
  
</form>
       </div>
    )
  }

