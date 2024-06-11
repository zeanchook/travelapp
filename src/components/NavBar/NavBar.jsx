import { Link, NavLink } from "react-router-dom";
import { logOut } from "../../utilities/users-service";
import { useAtom } from "jotai";
import { loginSts } from "../../../atom";

export default function NavBar() {
  const [user,setUser] = useAtom(loginSts);
  const handleLogOut = () => {
    logOut();
    setUser(null);
  };


  const [ currentUser ] = user;
  const routes = `/usrprofile/${currentUser.id}`

  return (
<div className="navbar bg-base-300 rounded-box">
  <div className="flex-1 px-2 lg:flex-none">
    <a className="text-lg font-bold">TRAAPP</a>
  </div> 
  <div className="flex justify-end flex-1 px-2">
    <div className="flex items-stretch">
      <a className="btn btn-ghost rounded-btn" href="/" >Community</a>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">Welcome, {user[0].name}</div>
        <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
          <li><a href ={routes}>My Profile</a></li> 
          {currentUser.usertype === "admin" && <li><a href ="/admin">Admin</a></li>} 
          <li><a to="" onClick={handleLogOut}>Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

  );
}
