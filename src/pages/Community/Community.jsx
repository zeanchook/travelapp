import { loginSts} from "../../../atom"
import {  useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { getStats } from "../../utilities/planner-service"
import dayjs from "dayjs"
import MarkerMap from "../../components/MarkerMap/MarkerMap"
import { useNavigate } from "react-router-dom"


export default function Community()
{
    const [user] = useAtomValue(loginSts)
    const [post , setPost] = useState("")

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
            // return(<div key={idx} style={{background:"grey",margin:"10px",width:"500px",height:"100px"}}>
            //     {item.name} created a {item.title} at {item.created_at}
            // </div>)
            console.log(item)
            return(
            <div key={idx}>
              <div className="stats shadow"  style={{margin:"10px",display:'flex',flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"white"}} >
                <div className="stat" style={{display:'flex',alignItems:"center"}}>
            
                  <div className="w-16 rounded-full" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <img src="https://images.twinkl.co.uk/tr/raw/upload/u/ux/earth-parents-wiki_ver_1.jpg" />
                    <div className="stat-title" 
                    onClick={(e) => handleUserClick(e,item)}
                    >{item.name}</div>
                    {/* <div className="stat-title">{dayjs(item.created_at).format('DD-MMM-YY')}{dayjs().format('DD-MMM-YY') }</div> */}
                    <div className="text-xs">{dayjs(item.created_at).format('DD-MMM-YY')}</div>
                  </div>

              <div className="stat-title" style={{cursor:"pointer"}}
              onClick={(e) => handleClick(e,item)}
              >📍 {item.title}</div>
             
            </div>
            <div>
          <MarkerMap mapSize={{width: "25vw",height: "30vh"}} type={{selected : item , type: "POST"}}/>
        </div>
          
          </div>

         
          </div>)
        })
    //   console.log(post)
    return(<div style={{ display: 'flex', height: '100vh', flexDirection:"column", backgroundColor:"yellow", alignItems:"center" ,overflowY:"scroll"}}>
        <div style={{display:"flex",flexDirection:"column",padding:"100px"}}>
        <Post/>
        </div>
        
    </div>)
}