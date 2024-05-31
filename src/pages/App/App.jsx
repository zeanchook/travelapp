import debug from "debug";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import { Navigate } from "react-router-dom";

import PlannerPage from "../PlannerPage/PlannerPage";
import MapPage from "../../components/MapPage/HeatMap"

import { loginSts } from "../../../atom";
import { useAtomValue } from "jotai";

import UserProfilePage from "../UserProfilePage/UserProfilePage";

const log = debug("mern:pages:App:App");

function App() {
  // const [user, setUser] = useState(getUser());
  const user = useAtomValue(loginSts)
  log("user %o", user);

  if (!user) {
    return (
      <main >
        <AuthPage  />
      </main>
    );
  }
  console.log(user)
  return (
    <div>
      <NavBar />
      {/* <div > */}
        
        
        <Routes>
          <Route path="/userprofile" element={<UserProfilePage/>}/>
          <Route path="/" element={<PlannerPage/>}/>
          <Route path="/map" element={<MapPage/>}/>
          <Route path="*" element={<Navigate to="/"  />} />
          {/* <Route path="/useredit" element={<OrderHistoryPage />} />
          <Route path="/orders/new" element={<NewOrderPage />} />

          <Route path="/orders2" element={<OrderHistoryPage />}>
            <Route path="new" element={<NewOrderPage />} />
            <Route path="simon" element={<p>Simon</p>} /> */}
          {/* </Route> */}
        </Routes>
      {/* </div> */}
    </div>
  );
}

export default App;
