import { deletePlanner, patchPlannerStatus } from "../../utilities/planner-service";
import CalenderPicker from "../CalenderPicker/CalenderPicker"
import { useNavigate } from "react-router-dom"
import { useAtomValue } from "jotai";
import dayjs from "dayjs";
import { loginSts } from "../../../atom";

export default function TableResults({plannerList, setPlannerList,setheatMapDisplay, setselectedPlanner})
{
    const navigate = useNavigate();
    const GTOKEN = process.env.GOOGLEMAP_API;

    const [currentUser] = useAtomValue(loginSts)
    // console.log(currentUser)

    const [visitingUser] = plannerList
    // console.log(visitingUser)
    const isValidUser = currentUser?.id === visitingUser?.id

    console.log(isValidUser)


    const handleClick = (e) =>
    {
        console.log(e.target.getAttribute('name'))
        navigate(`/planner/${e.target.getAttribute('name')}`)
    }

    const handleDelete = async(e,item) =>
    {
        e.preventDefault();
        console.log(item)
        if (item)
        {
            const { plannerid } = item;
            const newPlannerList = plannerList.filter((planner) => planner.plannerid!== plannerid);
            setPlannerList(newPlannerList)
            const response = await deletePlanner(plannerid);
            console.log(response)
        }
        
    }

    console.log(plannerList)

    const handleStatus = async(e,item) =>
    {
        e.preventDefault();
        console.log(item)
        if(item)
        {
            const { plannerid , status } = item;
            console.log(plannerid , status)
            let patchStatus = ""
            if(status === null || status === "Planned")
            {
                patchStatus = "Completed"
            }
            else{
                patchStatus = "Planned"
            }

            setPlannerList(plannerList.map(item => 
                {
                    if(item.plannerid === plannerid)
                    {
                        item.status = patchStatus
                    }
                return item
                }))
            const response = await patchPlannerStatus(plannerid,{status: patchStatus})
            console.log(response)
        }
    }

    const TableRow = () => plannerList?.map((item,idx) =>
           {return(<tr className="bg-white dark:bg-gray-800" key={idx} >
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:underline hover:cursor-pointer"
                        name={item.plannerid} onClick={handleClick} 
                        >{item.title}</th>
                        <td className="px-6 py-4">{item.created_at}</td> 
                        <td className="px-6 py-4">{item.created_at}</td> 
                        <td className="px-6 py-4">{parseInt(item.dayslength)}</td> 
                        <td className="px-6 py-4">{item.status === null ? "Planned" : item.status}</td> 
                        <td className="px-6 py-4"><button className="btn btn-accent"
                            onClick={(e) => 
                            {setheatMapDisplay(true)
                            setselectedPlanner({selected : item , type: "select"})}
                            }>Heat Map</button>
                            <button className="btn btn-error"
                            onClick={(e) => handleDelete(e,item)}
                            >Delete</button>
                            {item.status === "Completed" ? <button className="btn btn-secondary"
                            onClick={(e) => handleStatus(e,item)}
                            >Completed</button> : 
                            <button className="btn btn-success"
                            onClick={(e) => handleStatus(e,item)}
                            >Not Yet?</button>
                            }
                            </td>                               
                    </tr>)
        })

    const MyData = () => plannerList?.map((item,idx) =>
    {
        console.log(item)
        let url = "https://as1.ftcdn.net/v2/jpg/02/07/72/54/1000_F_207725426_TeMaoHbZgOs4sLJt03yyEO5E7uQh6vnQ.jpg" 
        if(item.coverphoto)
        {
            url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference=
        ${item.coverphoto}&key=${GTOKEN}`
        console.log(url)
        }
        
        // console.log(vis)
        
        return(<div style={{margin:"20px",padding:"20px",backgroundColor:""}} key={idx}>
            <div >
            <img src={url} style={{height: "20vh", width: "30vh",borderRadius:"20px",}} className="hover:cursor-pointer"
            name={item.plannerid} onClick={handleClick} 
            />
            <div style={{padding:"5px"}}></div>
            </div>

            <div style={{display:'flex',flexDirection:'row',justifyContent:"space-between",
            alignItems:'center',padding:"5px",fontFamily:"sans-serif"
            }}>
            <div className="hover:underline hover:cursor-pointer" 
            style={{whiteSpace:"nowrap",marginRight:"10px",fontSize:"20px"}}
            name={item.plannerid} onClick={handleClick} 
            >{item.title}
            </div>
            {isValidUser &&
            <div>
            {item.status === "Planned" ? 
            <button style={{borderRadius:"10px",backgroundColor:"orange",textAlign:"center", padding:"5px",fontSize:"10px"}}
            onClick={(e) => handleStatus(e,item)}
            >{item.status}</button> : 
            <button style={{borderRadius:"10px",backgroundColor:"green",textAlign:"center",padding:"5px",fontSize:"10px"}}
            onClick={(e) => handleStatus(e,item)}
            >{item.status}</button>}
            <button style={{borderRadius:"10px",backgroundColor:"red",textAlign:"center",padding:"5px",marginLeft:"5px",fontSize:"10px"}}
            onClick={(e) => handleDelete(e,item)}
            >Delete</button>
            </div>}
            </div>


            {/* <div >{dayjs(item.created_at).format("DD MMM")}</div> */}
            <div style={{display:'flex',color:"grey"}}>
            <div style={{padding:"2px"}}></div>
            <div style={{fontSize:"13px"}}>{dayjs(item.startdate).format("DD MMM")+" - "+dayjs(item.enddate).format("DD MMM YY")+
            " • "+parseInt(item.dayslength)+" days"+" • "+item.ref_count+" places "}</div>
            {/* <div >{item.created_at}</div> */}
            {/* <div >{parseInt(item.dayslength)} days</div> */}
            </div>
            
            </div>)
    })
    return(<div style={{display:'flex',flexDirection:"column",alignItems:"center"}}>
        <b style={{fontSize:"20px",padding:"20px"}}>Your Plans 📒</b>
        <div style={{backgroundColor:"",display:"flex",flexWrap:"wrap"}}>
            <MyData/>
        </div>
    </div>

        // <div className="relative overflow-x-auto">
        //     <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        //         <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
        //             <tr>
        //                 <th scope="col" className="px-6 py-3">
        //                     Title
        //                 </th>
        //                 <th scope="col" className="px-6 py-3">
        //                     Created At
        //                 </th>
        //                 <th scope="col" className="px-6 py-3">
        //                     Updated At
        //                 </th>
        //                 <th scope="col" className="px-6 py-3">
        //                     Trip Length
        //                 </th>
        //                 <th scope="col" className="px-6 py-3">
        //                     Trip Status
        //                 </th>
        //                 <th scope="col" className="px-6 py-3">
        //                     Action
        //                 </th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             <TableRow />
                    
        //         </tbody>
        //     </table>

        // </div>
        )
}