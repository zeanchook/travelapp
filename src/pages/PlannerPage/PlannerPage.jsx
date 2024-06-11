import SearchPlaces from "../../components/SearchPlaces/SearchPlaces"
import HeatMap from "../../components/MapPage/HeatMap"
// import { useState } from "react"
import { createPlanner, getPlanner, getUserStats } from "../../utilities/planner-service"
import { useEffect, useState } from "react"
import TableResults from "../../components/TableResults/TableResults"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom"

import { useNavigate } from "react-router-dom"

import CalenderPicker from "../../components/CalenderPicker/CalenderPicker"
import { useAtom , useAtomValue } from "jotai"
import { currentSelectedRange } from "../../../atom"

import UserCard from "../../components/UserCard/UserCard"

import dayjs from "dayjs"

import { loginSts } from "../../../atom"
import { getUserDetails, patchViewer } from "../../utilities/users-service"

import { useLocation } from "react-router-dom"
import LoadingPopup2 from "../../components/LoadingPopup/LoadingPopup2"




export default function PlannerPage()
{
    const [plannerList, setPlannerList] = useState("");
    const [heatMap, setheatMap] = useState(false);
    const [ userState , setUserState ] = useState("")
    const [myheatMap, setmyheatMap] = useState(false);
    const [owner , setOwner] = useState(false)
    const GTOKEN = process.env.GOOGLEMAP_API;
    const {userid} = useParams();
    const visitedUser = userid
    const [selectedPlanner , setselectedPlanner] = useState("")
    const [loadingSts ,setLoadingSts] = useState(false);
    const [ visitedUserState , setvisitedUserState ] = useState("")
    // console.log(visitedUserState)
    const [userStats ,setUserStats] = useState("")
    const currentUser = useAtomValue(loginSts)
    const [loadingMsg2, setLoadingMsg2 ] = useState(false)
    // console.log(currentUser)
    // console.log(plannerList)


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
        console.log(response)

        const [ usercheck ] = currentUser
        // console.log(parseInt(user.id), parseInt(usercheck.id),visitedUser)
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
          {/* <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg> */}
          <span className="loading loading-dots loading-lg"></span>
      </div>
  </div>)
    }

    const AnotherLoading = () =>
    {
      return(<span className="loading loading-ball loading-lg"></span>
      )
    }

    
    return(<div style={{ display: 'flex', height: '93vh',
    background:'url("https://i.redd.it/uwmhyzndzusc1.jpeg")', backgroundSize:"cover", 
      }}>
      <div style={{ width: '30%',
        display:"flex",flexDirection:"row",justifyContent:"end"
      ,backgroundColor:""
      }}>
        

        <div>
          {visitedUserState && <UserCard 
          currentUser={visitedUserState} 
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