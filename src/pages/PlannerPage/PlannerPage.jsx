import SearchPlaces from "../../components/SearchPlaces/SearchPlaces"
import HeatMap from "../../components/MapPage/HeatMap"
// import { useState } from "react"
import { createPlanner, getPlanner, getUserStats } from "../../utilities/planner-service"
import { useEffect, useState } from "react"
import TableResults from "../../components/TableResults/TableResults"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from "react-router-dom"

import CalenderPicker from "../../components/CalenderPicker/CalenderPicker"
import { useAtom , useAtomValue } from "jotai"
import { currentSelectedRange } from "../../../atom"

import UserCard from "../../components/UserCard/UserCard"

import dayjs from "dayjs"

import { loginSts } from "../../../atom"



export default function PlannerPage()
{
    const [plannerList, setPlannerList] = useState("");
    const [heatMap, setheatMap] = useState(false);

    const [myheatMap, setmyheatMap] = useState(false);

    const [selectedPlanner , setselectedPlanner] = useState("")

    const [newForm, setnewForm] = useState(false);
    const [formValue , setFormValue] = useState("")
    const [loadingSts ,setLoadingSts] = useState(false);

    const [userStats ,setUserStats] = useState("")
  
    const dateValue = useAtomValue(currentSelectedRange);

    const currentUser = useAtomValue(loginSts)
    console.log(currentUser)
    const numDays = parseInt(dayjs(dateValue.endDate).format('DD/MM/YYYY'))-parseInt(dayjs(dateValue.startDate).format('DD/MM/YYYY'));
    console.log(plannerList)
    const handleCreate = () =>
    {
      setnewForm(true)
      setPlannerList("")
    }

    const handleChange = (e) =>
    {
      setFormValue({title: e.target.value})
    }

    const handleSubmit = async(e) =>
    {
      e.preventDefault();
      console.log(formValue)

      console.log({...dateValue,...formValue})
      const result = await createPlanner({...dateValue,...formValue,daysLength:numDays})
      console.log(result)
      // if(typeof(result) === "string")
      // {
      //   toast(result)
      // }
      // else{
      //   toast(`${formValue} created succesfully !`)
      // }
    }
 
    const handleGetPlanner = async(e) => 
    {
      setLoadingSts(true);
      setmyheatMap(false)
      setheatMap(false)
      setPlannerList("")
      setnewForm(false)
      let results = await getPlanner();
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
     async function getAllDetails(name)
     {
              const response = await getUserStats(name)
              console.log(response)
              
              let titleCount = 0;
      let completedCount = 0;
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
      }

      const result = { title: titleCount, completed: completedCount };
      console.log(result)
      setUserStats(result)
     }
     if(currentUser)
     {
      getAllDetails(currentUser);
     }
     
    }, []);

      // console.log(plannerList)
    
    const Loading = () =>
    {
      return(<div className="text-center">
      <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>
  </div>)
    }

 



    console.log(plannerList)
    

    return(<div style={{ display: 'flex', height: '100vh'}}>
      <div style={{ width: '40%', overflowY: 'scroll', marginBottom: "300px", display:"flex", flexDirection: "column", justifyContent:"center"}}>
          <UserCard 
          currentUser={currentUser} 
          userStats={userStats} 
          handleGetHeatMap={handleGetHeatMap}
          handleCreate={handleCreate}
          handleGetPlanner={handleGetPlanner}
          />
        </div>

        <div style={{ width: '60%',}}>

        <div style={{height:"40%", backgroundColor: "yellow", 
        justifyContent:'center', 
        display:"flex", alignItems:"center"}}> 
        <HeatMap mapSize={{width: "35vw",height: "35vh",borderRadius:"10px"}}/>
        </div>


        <div style={{height:"60%", backgroundColor: "grey", justifyContent:'center', display:"flex", overflowY: 'scroll'}}> 
        {newForm &&
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Planner Name</label>
          <input type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          onChange={handleChange}
          required />
        </div>

        <div className="mb-5">
          <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Range</label>
          <CalenderPicker />
        </div>
        <div className="mb-5">
          <p>{dateValue.default === "no" && `Trip Length : ${numDays}`}</p>
        </div>
        
        <button type="submit" 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Create</button>
      </form>
        }
        <ToastContainer />
        
        

        {loadingSts && <Loading />}

        {(plannerList && !myheatMap ) && 
        <TableResults 
        plannerList={plannerList}
        setPlannerList={setPlannerList}

          setheatMapDisplay={setheatMap} 
          setselectedPlanner={setselectedPlanner}
        />}

        {(heatMap && !myheatMap) && <HeatMap selectedPlanner={selectedPlanner}/>}

        {myheatMap &&  <HeatMap selectedPlanner={selectedPlanner} mapSize={{width: "50vw",height: "50vh"}}/>}
  
        </div>
        </div>
        </div>
        
        )
    
}