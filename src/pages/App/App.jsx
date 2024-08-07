import debug from "debug";
import { Route, Routes } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import AuthPage from "../AuthPage/AuthPage";
import { Navigate } from "react-router-dom";
import Community from "../Community/Community"
import PlannerPage from "../PlannerPage/PlannerPage";
import PlannerDetailPage from "../PlannerDetailPage/PlannerDetailPage";
import { loginSts } from "../../../atom";
import { useAtomValue } from "jotai";
import AdminPage from "../AdminPage/AdminPage";
import UserViewerPage from "../UserViewerPage/UserViewerPage";
import Auth from "../../components/Auth/Auth";
import React from 'react';

const log = debug("mern:pages:App:App");

function App() {
  const user = useAtomValue(loginSts)
  log("user %o", user);

  return (<div>
      <NavBar />
        <Routes>
          <Route path="/usrprofile/:userid" element={<Auth><PlannerPage/></Auth>}/>
          <Route path="/planner/:plannerId" element={<Auth><PlannerDetailPage/></Auth>}/>
          <Route path="/auth" element={<Auth><AuthPage/></Auth>}/>
          <Route path="/admin" element={<Auth><AdminPage/></Auth>}/>
          <Route path="/userviewerpage" element={<Auth><UserViewerPage/></Auth>}/>
          <Route path="/" element={<Community/>}/>
          <Route path="*" element={<Navigate to="/"  />} />
        </Routes>
    </div>);
}

export default App;
