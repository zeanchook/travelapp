import debug from "debug";
import { useNavigate } from "react-router-dom";
import { login } from "../../utilities/users-service";
import { useAtom } from "jotai";
import { loginSts } from "../../../atom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const log = debug("mern:components:LoginForm");

export default function LoginForm({setOptions }) {
  const navigate = useNavigate();
  const [user,setUser] = useAtom(loginSts);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    log("data: %o", data);
    const { email, password } = data;
    const user = await login(email, password);
    if(user !== "No User Found" && user !== "Password incorrect")
    {
        setUser(user);
        navigate("/orders");
        
    }
    else{
        toast(user);
    }
  };

  const SignIn = () =>
  {
    return(
      <section className="bg-white dark:bg-gray-900">
    <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt=""/>

            <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">sign In</h1>

            <div className="relative flex items-center mt-8">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </span>

                <input type="email" name="email" className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Email address"/>
            </div>

            <div className="relative flex items-center mt-4">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </span>

                <input type="password" name="password" className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Password"/>
            </div>

            <div className="mt-6">
                <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                    Sign in
                </button>
                
                <ToastContainer />
               

                <div className="mt-6 text-center ">
                    <a onClick={()=>setOptions("signup")} className="text-sm text-blue-500 hover:underline dark:text-blue-400">
                        Don’t have an account yet? Sign up
                    </a>
                </div>
                
                
            </div>
        </form>
    </div>
</section>
    )
  }

  return (
    // <form onSubmit={handleSubmit}>
    //   <fieldset>
    //     <legend>Login</legend>

    //     <label>
    //       Email:
    //       <input name="email" />
    //     </label>
    //     <br />

    //     <label>
    //       Password:
    //       <input name="password" />
    //     </label>
    //     <br />
    //     <button>Login</button>
    //   </fieldset>
    // </form>
    <SignIn/>
  );
}
