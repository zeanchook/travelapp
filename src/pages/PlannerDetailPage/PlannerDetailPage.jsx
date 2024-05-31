import { useParams } from "react-router-dom"
import { getDetailPlanner } from "../../utilities/planner-service";
import { useEffect } from "react";

export default function PlannerDetailPage()
{
    const { plannerId } = useParams();
    
    console.log(plannerId)
    useEffect(() => {
        async function getPlannerList(item) {
          let results = await getDetailPlanner(item);
          console.log(results)
        }
        getPlannerList(plannerId);
      }, [plannerId]);

    
    console.log(plannerId);
    return(<>{plannerId}</>)
}