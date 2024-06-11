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
import Auth from "../../components/Auth/Auth";


const log = debug("mern:pages:App:App");

function App() {
  // const [user, setUser] = useState(getUser());
  const user = useAtomValue(loginSts)
  log("user %o", user);

  // if (!user) {
  //   return (
  //     <main >
  //       <AuthPage  />
  //     </main>
  //   );
  // }
  // console.log(user)
  return (
    <div>
      <NavBar />
      {/* <div > */}
        
        
        <Routes>
          {/* <Route path="/userprofile" element={<UserProfilePage/>}/> */}
          {/* <Route path="/userprofile2" element={<UserProfilePage2/>}/> */}
                    {/* <Route path="/new" element={<NewPage/>}/> */}
                              {/* <Route path="/map" element={<MapPage/>}/> */}
          <Route path="/usrprofile/:userid" element={<Auth><PlannerPage/></Auth>}/>
          <Route path="/planner/:plannerId" element={<Auth><PlannerDetailPage/></Auth>}/>
          <Route path="/auth" element={<Auth><AuthPage/></Auth>}/>
          <Route path="/admin" element={<Auth><AdminPage/></Auth>}/>
          <Route path="/userviewerpage" element={<Auth><UserViewerPage/></Auth>}/>
          
          <Route path="/" element={<Community/>}/>
          <Route path="*" element={<Navigate to="/"  />} />
        </Routes>
    </div>
  );
}

export default App;
