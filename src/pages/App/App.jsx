import debug from "debug";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import { Navigate } from "react-router-dom";
import Community from "../Community/Community"

import PlannerPage from "../PlannerPage/PlannerPage";
import MapPage from "../../components/MapPage/HeatMap"
import PlannerDetailPage from "../PlannerDetailPage/PlannerDetailPage";

import { loginSts } from "../../../atom";
import { useAtomValue } from "jotai";

import UserProfilePage from "../UserProfilePage/UserProfilePage";

import NewPage from "../NewPage";
import UserProfilePage2 from "../UserProfilePage2/UserProfilePage2";
import AdminPage from "../AdminPage/AdminPage";
import UserViewerPage from "../UserViewerPage/UserViewerPage";

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
  // console.log(user)
  return (
    <div>
      <NavBar />
      {/* <div > */}
        
        
        <Routes>
          <Route path="/userprofile" element={<UserProfilePage/>}/>
          <Route path="/userprofile2" element={<UserProfilePage2/>}/>
          <Route path="/usrprofile/:userid" element={<PlannerPage/>}/>
          <Route path="/planner/:plannerId" element={<PlannerDetailPage/>}/>
          <Route path="/userviewerpage" element={<UserViewerPage/>}/>
          <Route path="/map" element={<MapPage/>}/>
          <Route path="/new" element={<NewPage/>}/>
          <Route path="*" element={<Navigate to="/"  />} />
          <Route path="/admin" element={<AdminPage/>}/>
          <Route path="/" element={<Community/>}/>
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
