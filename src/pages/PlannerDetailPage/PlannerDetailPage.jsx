import { useParams } from "react-router-dom"
import { getDetailPlanner } from "../../utilities/planner-service";
import { useEffect ,useState } from "react";
import dayjs from "dayjs";
import SearchPlaces from "../../components/SearchPlaces/SearchPlaces";

export default function PlannerDetailPage()
{
    const { plannerId } = useParams();
    const [plannerDetails, setPlannerDetails] = useState("")
    
    console.log(plannerId)
    useEffect(() => {
        async function getPlannerList(item) {
            // console.log(item)
          let results = await getDetailPlanner(item);
          setPlannerDetails(results)
        }
        getPlannerList(plannerId);
      }, [plannerId]);

    console.log(plannerDetails)

    const List = () => plannerDetails?.map((item,idx) =>
        {
            return(<li className="mb-10 ms-4" key={idx}>
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" ></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{dayjs(item.date).format("DD-MM-YYYY")}{` Day ${idx + 1}`}</time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.locations}</h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{` Day ${idx}`}</p>
            <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 bg-base-100" key={idx}>
                <div className="collapse-title text-xl font-medium" style={{display:"flex"}}>Click to view
                </div>
                <div className="collapse-content"> 
                   <p>test</p>
                </div>
            </div>
            </li>)
        })

   

    
    console.log(plannerId);
    return(
        <section style={{display:"flex",flexDirection:"row",backgroundColor:"yellow"}}>
    {/* <div style={{display:"flex",flexDirection:"row",backgroundColor:"yellow"}}> */}

    <div>
    {plannerDetails &&
    <ol className="relative border-s border-gray-200 dark:border-gray-700" >                  
       <List/>
    </ol>}
    </div>

    <div className="grid h-screen grid-cols-2"><SearchPlaces plannerDetails={plannerDetails}/></div>
    

    
    
  {/* <div className="grid h-screen grid-cols-2">[...]</div> */}

    
    
    {/* </div> */}
    </section>)
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