import { useParams } from "react-router-dom"
import { deleteItineraryItem, getDetailPlanner } from "../../utilities/planner-service";
import { useEffect ,useState } from "react";
import dayjs from "dayjs";
import SearchPlaces from "../../components/SearchPlaces/SearchPlaces";
import { getEachDetailPlanner, patchOrderLocation , patchItinneraryItem } from "../../utilities/planner-service";
import { reload } from "../../../atom";
import { useAtom, useAtomValue } from "jotai";
import HeatMap from "../../components/MapPage/HeatMap";
import LoadingPopup from "../../components/LoadingPopup/LoadingPopup";
import MarkerMap from "../../components/MarkerMap/MarkerMap"

import { markerDir } from "../../../atom";
import { loginSts } from "../../../atom";
import { current, produce } from "immer";
import { patchHandleDrop } from "../../utilities/planner-local-service";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: 'grab',
  fill: '#d00',
  stroke: 'none',
};

const textStyle = {
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#fff',
    textAlign: 'center',
  };

export default function PlannerDetailPage()
{
    const { plannerId } = useParams();
    const [plannerDetails, setPlannerDetails] = useState("")
    const [plannerItem, setPlannerItem] = useState("")

    const [validate, setValidate ] = useState(false)

    const [ user ] = useAtomValue(loginSts)
    console.log(user)


    const [reloadState , setReloadState] = useAtom(reload);

    const [markerDirection , setmarkerDirection] = useAtom(markerDir)


    const [dragItem , setDragItem] = useState("")
    const [dropItem , setDropItem] = useState("")

    const [loadingSts ,setLoadingSts] = useState(false);
    
    // console.log(plannerId)
    useEffect(() => {
        async function getPlannerList(item) {
          setLoadingSts(true)
          let results = await getDetailPlanner(item);
          setPlannerDetails(results)

          let detailResults = await getEachDetailPlanner(item)
          console.log("this always run?")
          console.log(results,detailResults)

          const plannerUser = {};
          detailResults.map(item => {
            
            if (!plannerUser["id"]) {
                plannerUser["id"] = item.id;
            }})
        console.log(plannerUser)

        if(plannerUser.id === user.id)
        {
            setValidate(true);
        }
        else
        {
            setValidate(false);
        }

          setPlannerItem(detailResults)
          setmarkerDirection({selected : detailResults , type: "planoverview"})
          setLoadingSts(false)
        }
        getPlannerList(plannerId);
      }, [plannerId, reloadState, user.id]);

    //   plannerId,reloadState

    
const handleDrag = (e,item) =>
{
    e.stopPropagation();
    // console.log("dragging",item)
    // console.log("test")
    setDragItem(item)
    // console.log(e)
}

const handleDrop = async(e,item) =>
{
    e.preventDefault();
    e.stopPropagation();
    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
        B_PlannerItemID:item.planner_items_id,
        B_PlannerLocID:item.plannerlocationitemsid,
    }
    console.log(data)
    if(data.A_PlannerItemID === data.B_PlannerItemID && data.A_PlannerLocID !== data.B_PlannerLocID)
    {
        console.log("only item inside");
        const updatedState = patchHandleDrop(plannerItem,data)
        setPlannerItem(updatedState)

        const filtering = updatedState.filter(item => item.date === markerDirection.date)
        const markerupdatedState = produce(markerDirection, (draft) => {
           draft.selected = filtering
          });
        setmarkerDirection(markerupdatedState)

        const resposne  = await patchOrderLocation(data);
        console.log(resposne)

    }
   
}

const handleDragOver =(e)=>
{
    e.preventDefault();
    
    // console.log('handleDragOver')
}

const handleDragLeave = (e) =>
{
    e.preventDefault();
    // console.log("handleDragLeave")
}

const handleDropDay = async(e,item) =>
{
    e.preventDefault();
    e.stopPropagation();
   console.log(dragItem,item)
    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
        B_PlannerDate:item.date,
        B_PlannerItemID:item.planner_items_id,
    }
    console.log(data)
    // // console.log(plannerDetails,plannerItem)
    // console.log(item)
    if(data.A_PlannerItemID !== data.B_PlannerItemID)
    {
    const currentDragItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.A_PlannerLocID)
    // // console.log("dragItem:",currentDragItem)
    const currentdropItem = plannerItem.findIndex(x=>x.date === data.B_PlannerDate)
    // // console.log("dropItem",currentdropItem)
    const updatedState = produce(plannerItem, (draft) => {
        // console.log(draft[currentDragItem].date,draft[currentdropItem].date)
        console.log(currentDragItem,currentdropItem)
        console.log(draft[currentDragItem].date,draft[currentdropItem].date )
        draft[currentDragItem].date = draft[currentdropItem].date 
        console.log(draft[currentDragItem].date,draft[currentdropItem].date )
      });
    setPlannerItem(updatedState);
    
    // console.log(data)
    const response  = await patchItinneraryItem(data);
    console.log(response);
    }
}

const handleDelete = async (e,selectedItem) =>
{
    e.preventDefault();
        e.stopPropagation();
    console.log("test")
    console.log(selectedItem,plannerItem)

    const { plannerlocationitemsid } = selectedItem
    console.log(plannerlocationitemsid)

    const deleted = plannerItem.filter(item => (item.plannerlocationitemsid !== plannerlocationitemsid))
    setPlannerItem(deleted);

    const updatedState = produce(markerDirection, (draft) => {
        draft.selected = deleted;
      });
    setmarkerDirection(updatedState);
    const response = await deleteItineraryItem(plannerlocationitemsid)
    console.log(response)

}

const handleDropNoItem = async(e,item) =>
{
    e.preventDefault();
    e.stopPropagation();
   
    console.log("handleDropNoItem",dragItem,item)
    const finder = plannerDetails.findIndex(items => items.date === item)
    console.log(finder)
    console.log(plannerDetails[finder].planner_items_id)
    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
        B_PlannerItemID:plannerDetails[finder].planner_items_id
    }

    console.log(plannerDetails)


    const currentDragItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.A_PlannerLocID)
    console.log("handleDropNoItem",plannerItem[currentDragItem],currentDragItem)
    // console.log(currentDragItem)
    const updatedState2 = produce(plannerItem, (draft) => {
        console.log("handleDropNoItem before ",draft[currentDragItem].date,item)
        
        draft[currentDragItem].date = ""
        draft[currentDragItem].date = item

        console.log("handleDropNoItem after ",draft[currentDragItem].date,item)
      });
      console.log("handleDropNoItem",updatedState2[currentDragItem],updatedState2)
      console.log("handleDropNoItem")
      setPlannerItem(updatedState2);
      console.log(updatedState2 === plannerItem)
      const resposne = await patchItinneraryItem(data)
      console.log(resposne)
    
}

const Filtering = ({date}) => {
    let filteredItems = plannerItem  && plannerItem?.filter(item => item.date === date).sort((a,b) => 
    {
    if(a.plannerlocationitemsid > b.plannerlocationitemsid)
        {
            return 1;
        }
        else if(a.plannerlocationitemsid < b.plannerlocationitemsid)
        {
            return -1;
        }
        else{
            return 0;
        }
    }
    );
    // console.log("handleDropNoItem re-render")
    if (filteredItems && filteredItems.length > 0) {
        // console.log("here?",filteredItems)
      return filteredItems?.map((item,idx) => 
     
      <li className="mb-10 ms-4 " key={idx} style={{backgroundColor:"", display:"flex", justifyContent:"space-between"}}>
           <div style={{display:"flex",alignItems:"center"}}
            draggable={validate} value={item}
            onDragStart={(e)=> handleDrag(e,item)} 
            onDrop={(e)=>{handleDrop(e,item)}} 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            >
           <div>
            <svg className="" height={30} viewBox="0 0 24 24" style={pinStyle}>
                <path d={ICON} />
                <text x="7.5" y="15" style={textStyle}>{idx + 1}</text>
            </svg>
            
            </div>
             
      <div style={{margin:"5px"}}
      key={idx}>{item.placename}</div></div>
      {validate && <button onClick={(e) => handleDelete(e,item)}>🗑️</button>}
      </li>
      );
    } 
    
    else {
        return (
            <div 
            onDrop={(e)=>handleDropNoItem(e,date, "dropnoitem")} 
            onDragOver={handleDragOver}
            style={{backgroundColor:"green",padding:"20px"}}>
        <li className="mb-10 ms-4" >
        <div className="absolute w-3 h-3 bg-orange-200 rounded-full 
        mt-1.5 -start-1.5 border border-white dark:border-black-900 dark:bg-black-700"
        ></div>
        <div>No items here yet </div>
        </li>
        </div>
        );
    }
}

// const Filtering = ({date}) => {
//     let filteredItems = plannerItem  && plannerItem?.filter(item => item.date === date).sort((a,b) => 
//     {
//     if(a.plannerlocationitemsid > b.plannerlocationitemsid)
//         {
//             return 1;
//         }
//         else if(a.plannerlocationitemsid < b.plannerlocationitemsid)
//         {
//             return -1;
//         }
//         else{
//             return 0;
//         }
//     }
//     );
//     // console.log("handleDropNoItem re-render")
//     if (filteredItems && filteredItems.length > 0) {
//         // console.log("here?",filteredItems)
//       return filteredItems?.map((item,idx) => 
     
//       <li className="mb-10 ms-4 " key={idx} style={{backgroundColor:"", display:"flex", justifyContent:"space-between"}}>
//            <div style={{display:"flex",alignItems:"center"}}
//             draggable={validate} value={item}
//             onDragStart={(e)=> handleDrag(e,item)} 
//             onDrop={(e)=>{handleDrop(e,item)}} 
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             >
//            <div>
//             <svg className="" height={30} viewBox="0 0 24 24" style={pinStyle}>
//                 <path d={ICON} />
//                 <text x="7.5" y="15" style={textStyle}>{idx + 1}</text>
//             </svg>
            
//             </div>
             
//       <div style={{margin:"5px"}}
//       key={idx}>{item.placename}</div></div>
//       {validate && <button onClick={(e) => handleDelete(e,item)}>🗑️</button>}
//       </li>
//       );
//     } 
    
//     else {
//         return (
//             <div 
            
//             onDrop={(e)=>handleDropNoItem(e,date, "dropnoitem")} 
//         onDragOver={handleDragOver}
//         style={{backgroundColor:"green",padding:"20px"}}
//         >
//         <li className="mb-10 ms-4" >
//         <div className="absolute w-3 h-3 bg-orange-200 rounded-full 
//         mt-1.5 -start-1.5 border border-white dark:border-black-900 dark:bg-black-700" 
        
//         ></div>
//         <div>No items here yet </div>
//         </li>
//         </div>
//         );
//     }
// }

    const handleOverview = (e) =>
    {
        e.preventDefault();
        setmarkerDirection({selected : plannerItem , type: "planoverview"})
    }

    const handleCurrentDay = (e,item) =>
    {
        e.preventDefault();
        e.stopPropagation();
        const data = plannerItem.filter(plannerItem => plannerItem.date === item.date)
        console.log(data)
        setmarkerDirection(({selected : data , type: "plannerview", date: item.date}))
        // console.log(item,plannerItem)
    }

    const handleSelect = (item) =>
    {
        setmarkerDirection(item)
    }

    const handleSearch = (item) =>
    {
        setmarkerDirection(item)
    }

    const List = () => plannerDetails?.map((item,idx) =>
        {
            return(<div className="mb-10 ms-4" key={idx} style={{backgroundColor:"yellow",padding:"20px",cursor:"pointer"}}
            onDrop={(e)=>handleDropDay(e, item, "dropday")}
            onDragOver={handleDragOver}
            onClick={(e) => handleCurrentDay(e,item)}
            >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.locations}</h3>
            <p className="mb-4 text-base font-normal text-black-500 dark:text-black-400">
                
                {` Day ${idx+1}`}   {dayjs(item.date).format("ddd,DD/MMM/YY")}
            </p>
                <ol className="relative" >                  
                   {Filtering && <Filtering date={item.date}/>}
                   {/* {Filtering && <Filtering date={item.date}/>} */}
                </ol>
            </div>)
        })

    return( 
    <div style={{ display: 'flex', height: '100vh' }}>
    {/* <div style={{display:"flex",flexDirection:"row",backgroundColor:"yellow"}}> */}
    
    <div style={{ width: '50%', overflowY: 'scroll', padding: "10px", display:"flex", flexDirection: "column"}}>
    <h1 style={{fontSize:"25px", backgroundColor:"grey"}} onClick={handleOverview}
    >{plannerDetails && plannerDetails[0]?.title}</h1>
    <div>{plannerDetails &&          
       <List/>
   }</div>
    </div>

    <div style={{ width: '50%'}}>        
        <div style={{height:"47.5%",backgroundColor: 'grey',overflowY: 'scroll', display:"flex", flexDirection:"column",alignItems:"center"}}>
        <SearchPlaces plannerDetails={plannerDetails} 
        handleSelect={handleSelect} 
        handleSearch={handleSearch}
        validate={validate}
        plannerId={plannerId}
        />
        </div>
        <div style={{height:"50%",backgroundColor: 'yellow'}}> 
         <MarkerMap mapSize={{width: "100%",height: "100%"}} mapData={markerDirection}/>
         </div>

    </div>
    {loadingSts && <LoadingPopup />}
    </div>)
}


{/* <li className="mb-10 ms-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
            {/* <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg 
            hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 
            focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white 
            dark:hover:bg-gray-700 dark:focus:ring-gray-700">Learn more 
            <svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg></a> */}
        // </li> */}