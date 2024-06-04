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

  return (
    <nav >
      <NavLink to="/orders">Order History</NavLink>
      &nbsp; | &nbsp;
      <NavLink to="/orders/new">New Order</NavLink>
      &nbsp;&nbsp;
      <Link to="" onClick={handleLogOut}>
        Log Out
      </Link>
    </nav>
  );
}
