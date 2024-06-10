import { currentSelectedRange, loginSts} from "../../../atom"
import {  useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { createPlanner, getStats } from "../../utilities/planner-service"
import dayjs from "dayjs"
import MarkerMap from "../../components/MarkerMap/MarkerMap"
import { useNavigate } from "react-router-dom"
import CalenderPicker from "../../components/CalenderPicker/CalenderPicker"


export default function Community()
{
    const [user] = useAtomValue(loginSts)
    const [post , setPost] = useState("")

    const [newForm, setnewForm] = useState(false);
    const dateValue = useAtomValue(currentSelectedRange);
    const [formValue , setFormValue] = useState("")

    const numDays = parseInt(dayjs(dateValue.endDate).format('DD/MM/YYYY'))-parseInt(dayjs(dateValue.startDate).format('DD/MM/YYYY'));


    const navigate = useNavigate();


    console.log(user)

    useEffect(() => {

       async function getPost()
       {
            const resposne = await getStats();
            console.log(resposne)

        //    const reducedData = {}
           
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
              
            
            console.log(reducedData)
            setPost(reducedData)
       }
       getPost()
      }, []);

      const handleClick = (e,item) =>
      {
        console.log(item.planner_id)
        navigate(`/planner/${item.planner_id}`)
      }

      const handleUserClick = (e,item) =>
      {
        console.log(item)
        navigate(`/usrprofile/${item.userid}`)
      }

      const handleCreatePlanner = () =>
      {
          setnewForm(true)
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

      const Post = () => post && post?.sort((b,a) => 
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
            console.log(item)
            console.log(item)
            return(
            <div key={idx} style={{backgroundColor:"",width:"600px",padding:"10px"}}>
              <div className="stats shadow"  style={{margin:"10px",display:'flex',
              flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"white"}} >
                <div className="stat" style={{display:'flex',alignItems:"center"}}>
            
                  <div className="w-16 rounded-full" style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer"}}
                    onClick={(e) => handleUserClick(e,item)}
                    >
                    <img src="https://images.twinkl.co.uk/tr/raw/upload/u/ux/earth-parents-wiki_ver_1.jpg" />
                    <div className="stat-title" style={{}}
                    
                    >{item.name}</div>
                    {/* <div className="stat-title">{dayjs(item.created_at).format('DD-MMM-YY')}{dayjs().format('DD-MMM-YY') }</div> */}
                    {/* <div className="text-xs">{dayjs(item.created_at).format('DD-MMM-YY')}</div> */}
                  </div>

              <div className="stat-title" style={{cursor:"pointer"}}
              onClick={(e) => handleClick(e,item)}
              >📍 {item.title} {"posted on "+dayjs(item.created_at).format('DD-MMM-YY')}</div>
             
            </div>
           <div style={{margin:"10px",marginBottom:"20px"}}>
                      <MarkerMap mapSize={{width: "25vw",height: "30vh"}} type={{selected : item , type: "POST"}}/>
           </div>
          
          </div>

         
          </div>)
        })
    //   console.log(post)
    return(<div style={{ display: 'flex', height: '100vh', flexDirection:"column", backgroundColor:"yellow", alignItems:"center" ,overflowY:"scroll"}}>
      <div className="p-4 border-t mx-8 mt-2">
            <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
                onClick={handleCreatePlanner}
            >
                Create a Planner</button>
        </div>

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
        <div style={{display:"flex",flexDirection:"column",padding:"100px"}}>
        <Post/>
        </div>
        
    </div>)
}