import HeatMap from "../../components/MapPage/HeatMap"
// import { useState } from "react"
import { getPlanner, getUserStats } from "../../utilities/planner-service"
import { useEffect, useState } from "react"
import TableResults from "../../components/TableResults/TableResults"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom"

import {  useAtomValue } from "jotai"
import UserCard from "../../components/UserCard/UserCard"
import { loginSts } from "../../../atom"
import { getUserDetails, patchViewer } from "../../utilities/users-service"
import LoadingPopup2 from "../../components/LoadingPopup/LoadingPopup2"
import React from "react";




export default function PlannerPage()
{
    const [plannerList, setPlannerList] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [heatMap, setheatMap] = useState(false);

    const [myheatMap, setmyheatMap] = useState(false);
    const [owner , setOwner] = useState(false)
  
    const {userid} = useParams();
    const visitedUser = userid
    // eslint-disable-next-line no-unused-vars
    const [selectedPlanner , setselectedPlanner] = useState("")
    const [loadingSts ,setLoadingSts] = useState(false);
    const [ visitedUserState , setvisitedUserState ] = useState("")
    // console.log(visitedUserState)
    const [userStats ,setUserStats] = useState("")
    const currentUser = useAtomValue(loginSts)
    const [loadingMsg2, setLoadingMsg2 ] = useState(false)
    // console.log(currentUser)
    // console.log(plannerList)


    // eslint-disable-next-line no-unused-vars
    const handleGetPlanner = async(e) => 
    {
      setLoadingSts(true);
      setmyheatMap(false)
      setheatMap(false)
      setPlannerList("")
      let results = await getPlanner(visitedUserState);
      console.log(results)
      setPlannerList(results)
      setLoadingSts(false)
    }


    const handleGetHeatMap = () =>
    {
      if(currentUser)
      {
        setmyheatMap(true)
        console.log(currentUser)
        const [ user ] = currentUser
        setselectedPlanner({selected : user , type: "userheatmap"})
      }
    }

    useEffect(() => {
      // eslint-disable-next-line no-unused-vars
      let ignore = false;
      const [ user ] = currentUser
      async function patchingViewer(curr,visit)
     {
        const item = {currentid: curr, viewer: visit}
        const response = await patchViewer(item)
        console.log(response)
     }

     if(parseInt(visitedUser) !== parseInt(user.id))
     {
      console.log("true")
      const currentUserId = parseInt(user.id)
      const visitingUserId = parseInt(visitedUser)
      patchingViewer(currentUserId,visitingUserId)
     }

      return () => {ignore = true;};
    }, [currentUser, visitedUser]);

    useEffect(() => {
      let ignore = false;
      const [ user ] = currentUser

     async function getAllDetails(name)
     {
      setLoadingMsg2(true)
              const response = await getUserStats(name)
              console.log(response)
              
              let titleCount = 0;
      let completedCount = 0;
      let views = 0;
      const titleSet = new Set();
      console.log(titleSet)
      for (let i = 0; i < response.length; i++) {
        if (response[i].status === 'Completed') {
          completedCount++;
        }
        if (!titleSet.has(response[i].title)) {
          titleSet.add(response[i].title);
          titleCount++;
        }
        views = response[i].views
      }

      const result = { title: titleCount, completed: completedCount, views: views };
      console.log(result)
      if(!ignore){
      setUserStats(result)
      setLoadingMsg2(false)
      }
     }

     async function getVisitUserDetails(id)
     {
        const response = await getUserDetails(id);
        setOwner(parseInt(user.id) === parseInt(visitedUser))
        setvisitedUserState(response)
        setLoadingSts(true);
        setmyheatMap(false)
        setheatMap(false)
        setPlannerList("")
        let results = await getPlanner(response);
        console.log(results)
        setPlannerList(results)
        setLoadingSts(false)
        //?
     }
     //! change to visited id 

     

     
     if(visitedUser)
     {
      // const [ user ] = currentUser
      // setUserState(user)
      getVisitUserDetails({id: visitedUser})
      getAllDetails({id: visitedUser});
     }
     
     return () => {ignore = true;};
    }, [visitedUser]);

      // console.log(plannerList)
    
    const Loading = () =>
    {
      return(<div className="text-center">
      <div role="status">
          <span className="loading loading-dots loading-lg"></span>
      </div>
  </div>)
    }

    // const AnotherLoading = () =>
    // {
    //   return(<span className="loading loading-ball loading-lg"></span>
    //   )
    // }

    
    return(<div style={{ display: 'flex', height: '93vh',
    background:'url("https://i.redd.it/uwmhyzndzusc1.jpeg")', backgroundSize:"cover", 
      }}>
      <div style={{ width: '30%',
        display:"flex",flexDirection:"row",justifyContent:"end"
      ,backgroundColor:""
      }}>
        

        <div>
          {visitedUserState && <UserCard 
          selectedUser={visitedUserState} 
          userStats={userStats} 
          handleGetHeatMap={handleGetHeatMap}
          handleGetPlanner={handleGetPlanner}
          />}
          
          </div>
          </div>
          {/* <div style={{backgroundColor:"grey"}}>ffff</div> */}
        {/* </div> */}

        <div style={{ width: '70%',}}>

        <div style={{height:"40%", backgroundColor: "", 
        justifyContent:"end", flexDirection:"column",
        display:"flex", alignItems:"center"}}> 
        {visitedUserState && <HeatMap selectedPlanner={{selected : visitedUserState , type: "userheatmap"}} mapSize={{width: "35vw",height: "35vh",borderRadius:"10px"}}/>}
        </div>


        <div style={{height:"60%", backgroundColor: "", justifyContent:'center', display:"flex", overflowY: 'scroll'}}> 
        <ToastContainer />
        
        

        {loadingSts && <Loading />}

        {(plannerList && !myheatMap ) && 
        <TableResults 
          plannerList={plannerList}
          setPlannerList={setPlannerList}
          setheatMapDisplay={setheatMap} 
          setselectedPlanner={setselectedPlanner}
          owner={owner}
          planner={visitedUserState}
        />}
{loadingMsg2 && <LoadingPopup2 msg={"Profile Page"}/>}
        </div>
        </div>
        </div>
        
        )
    
}