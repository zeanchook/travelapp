import { useParams } from "react-router-dom"
import { getDetailPlanner } from "../../utilities/planner-service";
import { useEffect ,useState } from "react";
import dayjs from "dayjs";
import SearchPlaces from "../../components/SearchPlaces/SearchPlaces";
import { getEachDetailPlanner, patchOrderLocation , patchItinneraryItem } from "../../utilities/planner-service";
import { reload } from "../../../atom";
import { useAtom } from "jotai";
import HeatMap from "../../components/MapPage/HeatMap";
import LoadingPopup from "../../components/LoadingPopup/LoadingPopup";

import { current, produce } from "immer";


export default function PlannerDetailPage()
{
    const { plannerId } = useParams();
    const [plannerDetails, setPlannerDetails] = useState("")
    const [plannerItem, setPlannerItem] = useState("")
    const [reloadState , setReloadState] = useAtom(reload);


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
          setPlannerItem(detailResults)
          setLoadingSts(false)
        }
        getPlannerList(plannerId);
      }, []);

    //   plannerId,reloadState

    
const handleDrag = (e,item) =>
{
    e.stopPropagation();
    setDragItem(item)
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

        const updatedState = produce(plannerItem, (draft) => {
            console.log(plannerItem)
            const currentDragItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.A_PlannerLocID)
            const currentdropItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.B_PlannerLocID)
            console.log(currentDragItem,currentdropItem)
            console.log(draft[currentDragItem].plannerlocationitemsid,draft[currentdropItem].plannerlocationitemsid)
            draft[currentDragItem].plannerlocationitemsid = data.B_PlannerLocID;
            draft[currentdropItem].plannerlocationitemsid = data.A_PlannerLocID;
            console.log(draft[currentDragItem].plannerlocationitemsid,draft[currentdropItem].plannerlocationitemsid)
          });
        // const resposne  = await patchOrderLocation(data);
        // console.log(resposne)
        console.log("handleDrop")
        console.log(updatedState)
        setPlannerItem(updatedState)
        // setReloadState(item)
    }
   
}
console.log(plannerItem)
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
    console.log("hello")
    console.log(updatedState[currentDragItem],updatedState[currentdropItem])
    console.log("handleDropDay")
    setPlannerItem(updatedState);

    // console.log(data)
    const response  = await patchItinneraryItem(data);
    console.log(response);
    }
}


const handleDropNoItem = async(e,item) =>
{
    e.preventDefault();
    e.stopPropagation();
   
    console.log("handleDropNoItem",dragItem,item)
    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
    }
   
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
    console.log("handleDropNoItem re-render")
    if (filteredItems && filteredItems.length > 0) {
        // console.log("here?",filteredItems)
      return filteredItems?.map((item,idx) => 
      <li className="mb-10 ms-4" key={idx} style={{backgroundColor:"grey"}}>
            <div className="absolute w-3 h-3 bg-orange-200 rounded-full 
            mt-1.5 -start-1.5 border border-white dark:border-black-900 dark:bg-black-700" ></div>
      <div draggable value={item}
      onDragStart={(e)=> handleDrag(e,item)} 
      onDrop={(e)=>{handleDrop(e,item)}} 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      key={idx}>{idx+1} {item.name}</div>
      </li>);
    } 
    
    else {
        return (
            <div 
            
            onDrop={(e)=>handleDropNoItem(e,date, "dropnoitem")} 
        onDragOver={handleDragOver}
        style={{backgroundColor:"green",padding:"20px"}}
        >
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

    const List = () => plannerDetails?.map((item,idx) =>
        {
            return(<div className="mb-10 ms-4" key={idx} style={{backgroundColor:"yellow",padding:"20px"}}
            onDrop={(e)=>handleDropDay(e, item, "dropday")}
            onDragOver={handleDragOver}
            >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.locations}</h3>
            <p className="mb-4 text-base font-normal text-black-500 dark:text-black-400">
                {` Day ${idx+1}`}   {dayjs(item.date).format("ddd,DD/MMM/YY")}
            </p>
                <ol className="relative border-s border-orange-200 dark:border-orange-700" >                  
                   {Filtering && <Filtering date={item.date}/>}
                </ol>
            </div>)
        })

    return( 
    <div style={{ display: 'flex', height: '100vh' }}>
    {/* <div style={{display:"flex",flexDirection:"row",backgroundColor:"yellow"}}> */}
    <div style={{ width: '50%', overflowY: 'scroll', padding: "20px" }}>
    {plannerDetails &&
                     
       <List/>
   }
    </div>

    {/* <div style={{ width: '50%'}}>        
        <div style={{height:"50%",backgroundColor: 'grey',overflowY: 'scroll'}}>
        <SearchPlaces plannerDetails={plannerDetails}/>
        </div>
        <div style={{height:"50%",backgroundColor: 'yellow'}}> */}
        {/* <HeatMap/> */}
        {/* </div> */}

    {/* </div> */}
    {/* {loadingSts && <LoadingPopup />} */}
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