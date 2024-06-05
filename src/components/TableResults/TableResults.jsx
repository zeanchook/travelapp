import { deletePlanner } from "../../utilities/planner-service";
import CalenderPicker from "../CalenderPicker/CalenderPicker"
import { useNavigate } from "react-router-dom"
import { globalPlannerList } from "../../../atom";
import { useAtomValue } from "jotai";

export default function TableResults({plannerList, handleDeletes,setheatMapDisplay, setselectedPlanner})
{
    const navigate = useNavigate();

    const handleClick = (e) =>
    {
        console.log(e.target.getAttribute('name'))
        navigate(`/planner/${e.target.getAttribute('name')}`)
    }

    const handleDelete = (e,item) =>
    {
        e.preventDefault();
        console.log(item)
        if (item)
        {
            const { plannerid } = item;
            const newPlannerList = plannerList.filter((planner) => planner.plannerid!== plannerid);
            handleDeletes(newPlannerList)
            // await deletePlanner(plannerid);
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
                        <td className="px-6 py-4"><button className="btn btn-accent"
                            onClick={(e) => 
                            {setheatMapDisplay(true)
                            setselectedPlanner({selected : item , type: "select"})}
                            }>Heat Map</button>
                            <button className="btn btn-secondary">Completed</button>
                            <button className="btn btn-error"
                            onClick={(e) => handleDelete(e,item)}
                            >Delete</button>
                            </td>                               
                    </tr>)
        })
    return(

        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Created At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Updated At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Trip Length
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow />
                    
                </tbody>
            </table>

        </div>
        )
}