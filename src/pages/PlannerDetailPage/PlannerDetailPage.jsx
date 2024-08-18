import { useParams } from "react-router-dom"
import { deleteItineraryItem, getDetailPlanner } from "../../utilities/planner-service";
import { useEffect ,useState } from "react";
import dayjs from "dayjs";
import SearchPlaces from "../../components/SearchPlaces/SearchPlaces";
import { getEachDetailPlanner, patchOrderLocation , patchItinneraryItem } from "../../utilities/planner-service";
import { reload } from "../../../atom";
import { useAtom, useAtomValue } from "jotai";
import LoadingPopup from "../../components/LoadingPopup/LoadingPopup";
import MarkerMap from "../../components/MarkerMap/MarkerMap"
import { markerDir } from "../../../atom";
import { loginSts } from "../../../atom";
import { produce } from "immer";
import { patchHandleDrop } from "../../utilities/planner-local-service";
import React from "react";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: 'grab',
  fill: '#d00',
  stroke: 'none',
};

const textStyle = {
    fontSize: 9,
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
    // eslint-disable-next-line no-unused-vars
    const [reloadState , setReloadState] = useAtom(reload);
    const [markerDirection , setmarkerDirection] = useAtom(markerDir)
    const [dragItem , setDragItem] = useState("")
    const [loadingSts ,setLoadingSts] = useState(false);
    

    useEffect(() => {
        async function getPlannerList(item) {
          setLoadingSts(true)
          let results = await getDetailPlanner(item);
          setPlannerDetails(results)

          let detailResults = await getEachDetailPlanner(item)


          const plannerUser = {};
          results.map(item => {
            
            if (!plannerUser["id"]) {
                plannerUser["id"] = item.id;
            }})

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
    console.log("handleDrop")
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
        const updatedState = patchHandleDrop(plannerItem,data)
        setPlannerItem(updatedState)

        const filtering = updatedState.filter(item => item.date === markerDirection.date)
        const markerupdatedState = produce(markerDirection, (draft) => {
           draft.selected = filtering
          });
        setmarkerDirection(markerupdatedState)
        await patchOrderLocation(data);


    }
   
}

const handleDragOver =(e)=>
{
    e.preventDefault();
}

const handleDragLeave = (e) =>
{
    e.preventDefault();
}

const handleDropDay = async(e,item) =>
{
    console.log("dropday")
    e.preventDefault();
    e.stopPropagation();

    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
        B_PlannerDate:item.date,
        B_PlannerItemID:item.planner_items_id,
    }
    if(data.A_PlannerItemID !== data.B_PlannerItemID)
    {
    const currentDragItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.A_PlannerLocID)
    // // console.log("dragItem:",currentDragItem)
    const currentdropItem = plannerItem.findIndex(x=>x.date === data.B_PlannerDate)
    // // console.log("dropItem",currentdropItem)
    const updatedState = produce(plannerItem, (draft) => {
        // console.log(draft[currentDragItem].date,draft[currentdropItem].date)
        draft[currentDragItem].date = draft[currentdropItem].date 
        draft[currentDragItem].planner_items_id = data.B_PlannerItemID
      });

      const updatedStateMarker = produce(markerDirection, (draft) => {
        const type = draft.type;
        if(type === "planneroverview")
        {
            draft.selected = updatedState
        }
        else if(type === "plannerview")
        {
            draft.selected = updatedState.filter(item => item.date === draft.date)
        }
      });
    // console.log(updatedState,markerDirection)
    setmarkerDirection(updatedStateMarker)
    setPlannerItem(updatedState);
    await patchItinneraryItem(data);
    }
}

const handleDelete = async (e,selectedItem) =>
{
    e.preventDefault();
    e.stopPropagation();
    const { plannerlocationitemsid } = selectedItem
    const deleted = plannerItem.filter(item => (item.plannerlocationitemsid !== plannerlocationitemsid))
    setPlannerItem(deleted);

    const updatedState = produce(markerDirection, (draft) => {
        draft.selected = deleted;
      });
    setmarkerDirection(updatedState);
    await deleteItineraryItem(plannerlocationitemsid)
}

const handleDropNoItem = async(e,item) =>
{
    e.preventDefault();
    e.stopPropagation();
   

    const finder = plannerDetails.findIndex(items => items.date === item)
    const data = {
        A_PlannerItemID:dragItem.planner_items_id,
        A_PlannerLocID:dragItem.plannerlocationitemsid,
        B_PlannerItemID:plannerDetails[finder].planner_items_id
    }
    const currentDragItem = plannerItem.findIndex(x=>x.plannerlocationitemsid === data.A_PlannerLocID)
    const updatedState2 = produce(plannerItem, (draft) => {
        
        
        draft[currentDragItem].date = ""
        draft[currentDragItem].date = item
        draft[currentDragItem].planner_items_id = data.B_PlannerItemID

        
      });
      setPlannerItem(updatedState2);
      await patchItinneraryItem(data)
}

const Filtering = (date) => {
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

    if (filteredItems && filteredItems.length > 0) {
      return filteredItems?.map((item,idx) => 
     
      <li className="mb-10 ms-4 " key={idx} 
      style={{backgroundColor:"", display:"flex", 
      justifyContent:"space-between",color:"#2F3C7E",margin:"2px"}}>
           <div style={{display:"flex",alignItems:"center"}}
            draggable={validate} value={item}
            onDragStart={(e)=> handleDrag(e,item)} 
            onDrop={(e)=>{handleDrop(e,item)}} 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            >
           <div >
            <svg className="" height={30} viewBox="0 0 24 24" style={pinStyle}>
                <path d={ICON} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={textStyle}>{idx + 1}</text>
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
            <p 
            onDrop={(e)=>handleDropNoItem(e,date, "dropnoitem")} 
            onDragOver={handleDragOver}
            style={{backgroundColor:"",margin:"2px"}}>
        <div style={{padding:"2px"}}>No items here yet </div>
        </p>
        );
    }
}



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
        setmarkerDirection(({selected : data , type: "plannerview", date: item.date}))
    }

    const handleSelect = (item) =>
    {
        setmarkerDirection(item)
    }

    const handleSearch = (item) =>
    {
        setmarkerDirection(item)
    }

    const List = plannerDetails && plannerDetails?.map((item,idx) =>
        {
            return(<div className="mb-10 ms-4" key={idx} style={{backgroundColor:"gold",padding:"20px",cursor:"pointer",borderRadius:"10px"}}
            onDrop={(e)=>handleDropDay(e, item, "dropday")}
            onDragOver={handleDragOver}
            onClick={(e) => handleCurrentDay(e,item)}
            >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.locations}</h3>
            {/* <p className="mb-4 text-base font-normal text-black-500 dark:text-black-400"> */}
            <div tabIndex={0} className={`collapse collapse-open border border-base-300 bg-base-200`}
            >
            <div className="collapse-title text-xl font-medium"
             style={{display:"flex",alignItems:"flex-end",
             backgroundColor:"#101820",color:"#FEE715"}}>
                {` Day ${idx+1}`}   
                <p className="italic text-xs px-2">{dayjs(item.date).format("dddd , DD-MMM-YY")}</p>
                </div>
                <div className="collapse-content" style={{backgroundColor:"#FBEAEB"}}> 
                   {Filtering(item.date)}

                   </div>

                </div>
            </div>)
        })

        

    return( 
    <div style={{ display: 'flex', height: '93vh' }}>
    <div style={{ width: '50%', overflowY: 'scroll', padding: "10px", display:"flex", flexDirection: "column",background:'url("https://i.redd.it/uwmhyzndzusc1.jpeg")', backgroundSize:"cover",}}>
    <h1 style={{fontSize:"35px", backgroundColor:"", margin:"10px"}} onClick={handleOverview} className="font-mono"
    >{plannerDetails && plannerDetails[0]?.title}</h1>
    <div>{plannerDetails &&          
       List
   }</div>
    </div>

    <div style={{ width: '50%'}}>        
        <div style={{height:"50%",backgroundColor: '',overflowY: 'scroll', display:"flex", flexDirection:"column",alignItems:"center",
        background:'url("https://i.redd.it/vzgduzr6on3d1.png")', backgroundSize:"cover",
        }}>
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