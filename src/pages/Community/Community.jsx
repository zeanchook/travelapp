import { currentSelectedRange, loginSts} from "../../../atom"
import {  useAtomValue } from "jotai"
import { useEffect, useRef, useState } from "react"
import { createPlanner, getStats } from "../../utilities/planner-service"
import dayjs from "dayjs"
import MarkerMap from "../../components/MarkerMap/MarkerMap"
import { useNavigate } from "react-router-dom"
import CalenderPicker from "../../components/CalenderPicker/CalenderPicker"
import { ToastContainer, toast } from 'react-toastify';
import LoadingPopup from "../../components/LoadingPopup/LoadingPopup"
import LoadingPopup2 from "../../components/LoadingPopup/LoadingPopup2"


export default function Community()
{
    const isLoggedIn = useAtomValue(loginSts)
    let user = "" 
    if (isLoggedIn !== null)
    {
      [user] = isLoggedIn;
    }

    const [post , setPost] = useState("")
    const [createDisplay , setcreateDisplay] = useState(true)
    const [loadingMsg, setLoadingMsg ] = useState(false)
    const [loadingMsg2, setLoadingMsg2 ] = useState(false)
    const [newForm, setnewForm] = useState(false);
    const dateValue = useAtomValue(currentSelectedRange);
    const [formValue , setFormValue] = useState("")
    const inputEl = useRef("");
    const numDays = parseInt(dayjs(dateValue.endDate).format('DD/MM/YYYY'))-parseInt(dayjs(dateValue.startDate).format('DD/MM/YYYY'));
    const navigate = useNavigate();

    useEffect(() => {

       async function getPost()
       {
            setLoadingMsg2(true)
           const resposne = await getStats();           
           const reducedData = await resposne.reduce((acc, current) => {
            const existingPlanner = acc.find(planner => planner.planner_id === current.planner_id);
            if (!existingPlanner) {
              acc.push({
                userid: current.id,
                planner_id: current.planner_id,
                title: current.title,
                name: current.name,
                daylength: current.dayslength,
                startdate: current.startdate,
                enddate: current.enddate,
                created_at: current.created_at,data: [
                    {
                      date: current.date,
                      locations: current.locations,
                      placename: current.placename
                    }
                  ]
                });
              } else {
                existingPlanner.data.push({
                  date: current.date,
                  locations: current.locations,
                  placename: current.placename
                });
              }
              return acc;
          }, []);
            setPost(reducedData)
            setLoadingMsg2(false)
       }
       getPost()
      }, []);

      const handleClick = (e,item) =>
      {
        navigate(`/planner/${item.planner_id}`)
      }

      const handleUserClick = (e,item) =>
      {
        navigate(`/usrprofile/${item.userid}`)
      }

      const handleCreatePlanner = () =>
      {
          console.log(user)
          if(user)
          {
            setnewForm(true)
            setcreateDisplay(false)
          }
          else
          {
          navigate("/auth")
          }

      }

      const handleChange = (e) =>
    {
      inputEl.current = e.target.value
    }

    const handleSubmit = async(e) =>
    {
      e.preventDefault();
      e.stopPropagation();
      if(dateValue.default === "no")
      {
        setLoadingMsg(true)
        const result = await createPlanner({...dateValue,title: inputEl.current,daysLength:numDays})
        navigate(`/planner/${result}`)
        setLoadingMsg(false)
      }
      else
      {
        toast("Planner not created as date is default !");
        }
    }

      const Post = post && post?.sort((b,a) => 
      {
        if(a.created_at > b.created_at)
          {
              return 1;
          }
          else if(a.created_at < b.created_at)
          {
              return -1;

          }
          else{
              return 0;
          }
      }).map((item,idx) =>
        {
            return(
            <div key={idx} style={{backgroundColor:"",width:"750px",padding:"10px"}}>
              <div className="stats shadow"  style={{margin:"10px",display:'flex',
              flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"white"}} >
                <div className="stat" style={{display:'flex',alignItems:"center"}}>
            
                  <div className="w-16 rounded-full" style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer"}}
                    onClick={(e) => handleUserClick(e,item)}
                    >
                    <img src="https://images.twinkl.co.uk/tr/raw/upload/u/ux/earth-parents-wiki_ver_1.jpg" />
                    <div className="stat-title" style={{}}
                    
                    ><b>{item.name}</b></div>
                  </div>

              <div className="stat-title" style={{cursor:"pointer"}}
              onClick={(e) => handleClick(e,item)}
              >created 📍 <b>{item.title}</b> with <b>{item.data.length+" locations innit "}</b>  {" on "+dayjs(item.created_at).format('DD-MMM-YY')}</div>
             
            </div>
           <div style={{margin:"10px",marginBottom:"20px",width:"100%",backgroundColor:"",
            display:"flex",alignItems:"center",flexDirection:"column"
            }}>
                      <MarkerMap mapSize={{width: "35vw",height: "35vh"}} mapData={{selected : item , type: "POST"}}/>
           </div>
          
          </div>

         
          </div>)
        })
    return(<div style={{ display: 'flex', height: '100vh', 
    flexDirection:"column", backgroundColor:"yellow", alignItems:"center" ,
    background:'url("https://i.redd.it/10e6ttd0fp4d1.jpeg")', backgroundSize:"cover"
    ,overflowY:"scroll"}}>   
      <div style={{padding:"40px"}}><b style={{color:"white",fontSize:"50px"}}>Explore Our Community </b></div>
      <div className="divider" style={{color:"white",borderColor:"white"}}>OR</div>
      {createDisplay && <div className="p-4 border-t mx-8 mt-2">
            <button className="btn btn-active btn-primary"
                onClick={handleCreatePlanner}
            >
                Create One for yourself</button>
        </div>}
        
        {newForm &&
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",alignContent:"center"}}>
        <div className="mb-5" >
          <label htmlFor="text" className="block mb-2 text-sm font-medium" style={{color:"white"}}>New Planner Name</label>
          <input type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 
          text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
          dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          ref={inputEl}
          onChange={handleChange}
          required />
        </div>

        <div className="mb-5">
          <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          style={{width:"300px",backgroundColor:"",color:"white"}}
          >Date Range</label>
          <CalenderPicker />
        </div>
        <div className="mb-5" style={{color:"white"}}>
          <p>{dateValue.default === "no" && `Trip Length : ${numDays}`}</p>
        </div>
        
        <button type="submit" 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
        focus:outline-none focus:ring-blue-300 font-medium 
        rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        style={{textWrap:"nowrap"}}
        >
        Create that planner !</button>
      </form>
        }
        <div style={{display:"flex",flexDirection:"column",padding:"100px"}}>
        {Post}
        </div>
        <ToastContainer />
        {loadingMsg && <LoadingPopup/>}
        {loadingMsg2 && <LoadingPopup2/>}
    </div>)
}