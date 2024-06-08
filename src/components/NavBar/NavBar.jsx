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
  console.log(user)

  return (
    <nav style={{backgroundColor:"grey"}}>
      <NavLink to="/">Home</NavLink>
      &nbsp; | &nbsp;
      <NavLink to="/planner/">My Profile</NavLink>
      &nbsp;&nbsp;
      <Link to="" onClick={handleLogOut}>
        Log Out {user[0].name}
      </Link>
    </nav>
  );
}
