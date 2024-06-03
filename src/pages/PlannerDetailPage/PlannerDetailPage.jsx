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
            // console.log(item)
          setLoadingSts(true)
          let results = await getDetailPlanner(item);
          setPlannerDetails(results)

          let detailResults = await getEachDetailPlanner(item)
        //   console.log(detailResults)
          setPlannerItem(detailResults)
        //   console.log("reload state is set: ",reloadState)
          setLoadingSts(false)
        }
        getPlannerList(plannerId);
      }, [plannerId,reloadState]);

    
const handleDrag = (item) =>
{
    // e.preventDefault();
    console.log("dragging",item)
    console.log("test")
    setDragItem(item)
    // console.log(e)
}

const handleDrop = async(item) =>
{
    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
        B_PlannerItemID:item.planner_items_id,
        B_PlannerLocID:item.plannerlocationitemsid,
    }
    console.log(data)
    if(data.A_PlannerItemID === data.B_PlannerItemID)
    {
        console.log("only item inside")
        // const resposne  = await patchOrderLocation(data);
        // console.log(resposne)
        // setReloadState(item)
    }
   
}

const handleDragOver =(e)=>
{
    e.preventDefault();
    console.log('handleDragOver')
}

// const handleDragLeave = (e) =>
// {
//     e.preventDefault();
//     console.log("handleDragLeave")
// }

const handleDropDay = async(item) =>
{
    console.log("dropped day item : ",dragItem,item)

    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
        B_PlannerItemID:item.planner_items_id,
    }

    console.log(data)
    const response  = await patchItinneraryItem(data);
    console.log(response);

}

const Filtering = ({date}) => {
    const filteredItems = plannerItem && plannerItem?.filter(item => item.date === date);
    if (filteredItems && filteredItems.length > 0) {
        console.log("here?",filteredItems)
      return filteredItems?.map((item,idx) => 
      <li className="mb-10 ms-4" key={idx} style={{backgroundColor:"grey"}}>
            <div className="absolute w-3 h-3 bg-orange-200 rounded-full 
            mt-1.5 -start-1.5 border border-white dark:border-black-900 dark:bg-black-700" ></div>
      <div draggable value={item}
      onDragStart={(e)=> handleDrag(item)} 
      onDrop={(e)=>{handleDrop(item)}} 
      onDragOver={handleDragOver}
    //   onDragLeave={handleDragLeave}
      key={idx}>{idx+1} {item.name}</div>
      </li>);
    } else {
        console.log("here?2",filteredItems)
        return [];
    }
  }

    const List = () => plannerDetails?.map((item,idx) =>
        {
            return(<div className="mb-10 ms-4" key={idx} 
            onDrop={(e)=>handleDropDay(item)}
            onDragOver={handleDragOver}
            >
            {/* <div className="absolute w-3 h-3 bg-orange-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-orange-900 dark:bg-orange-700" ></div> */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.locations}</h3>
            <p className="mb-4 text-base font-normal text-black-500 dark:text-black-400">
                {` Day ${idx+1}`}   {dayjs(item.date).format("ddd,DD/MMM/YY")}
            </p>

            {/* <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 bg-base-100" 
                key={idx}> */}
                {/* <div className="collapse-title text-xl font-medium" style={{display:"flex"}}>Click to view
                </div> */}
                {/* <div className="collapse-content">  */}
                {/* <div >  */}

                <ol className="relative border-s border-orange-200 dark:border-orange-700" >                  
                   {Filtering && <Filtering date={item.date}/>}
                   </ol>
                {/* </div> */}
            {/* </div> */}
            </div>)
        })

    // if(loadingSts)
    // {
    //     return <MyPopup/>
    // }
   


//     <ol className="relative border-s border-orange-200 dark:border-orange-700" >                  
//     <List/>
//  </ol>}
    
    // console.log(planne'rId);
    return( 
    <div style={{ display: 'flex', height: '100vh' }}>
    {/* <div style={{display:"flex",flexDirection:"row",backgroundColor:"yellow"}}> */}
    <div style={{ width: '50%', overflowY: 'scroll', padding: "20px" }}>
    {plannerDetails &&
                     
       <List/>
   }
    </div>
    <div style={{ width: '50%'}}>        
        <div style={{height:"50%",backgroundColor: 'grey',overflowY: 'scroll'}}>
        <SearchPlaces plannerDetails={plannerDetails}/>
        </div>
        <div style={{height:"50%",backgroundColor: 'yellow'}}>
        {/* <HeatMap/> */}
        </div>
    </div>
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