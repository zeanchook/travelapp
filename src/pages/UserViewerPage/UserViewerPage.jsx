import { useAtomValue } from "jotai"
import { loginSts } from "../../../atom"
import { useEffect, useState } from "react";
import { getViewer } from "../../utilities/users-service";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import LoadingPopup2 from "../../components/LoadingPopup/LoadingPopup2";

export default function UserViewerPage()
{
    const [user] = useAtomValue(loginSts)
    const [viewers, setViewers] = useState("")
    const [loadingMsg2, setLoadingMsg2 ] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;
        
        async function getUserViewer(id)
        {
          setLoadingMsg2(true)
          
            const response = await getViewer({userid:id})
            if(!ignore){
                setViewers(response)
            }
            setLoadingMsg2(false)
        }
  
        if(user)
        {
            getUserViewer(user.id);
        }
        
  
        return () => {ignore = true;};
      }, [user]);


const handleUserClick = (e,item) =>
{
  console.log(item)
  navigate(`/usrprofile/${item.id}`)
}

const TableData = () => viewers && viewers.map((item,idx) => 
    {
        return(<tr key={idx}>
            <th>{idx + 1}</th>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200"
            onClick={(e) => handleUserClick(e,item)}
            >{item.name}</td>
            <td>{item.usertype}</td>
            <td>{dayjs(item.created_at).format("DD-MMM-YY hh:mm a")}</td>
          </tr>)
    })

    return(<div className="overflow-x-auto" style={{display:"flex",flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
        <div style={{fontSize:"30px", margin:"10px"}}>Your Viewer</div>
        <div className="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
    <table className="min-w-1/2 divide-y divide-gray-200 dark:divide-neutral-700" style={{width:"500px",border:"black",borderCollapse:""}}>
      {/* head */}
      <thead className="bg-gray-50 dark:bg-neutral-700">
        <tr>
          <th></th>
          <th>Name</th>
          <th>Tiers</th>
          <th>Viewed On</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
        <TableData/>
        {loadingMsg2 && <LoadingPopup2 msg={"your viewers"}/>}
      </tbody>
    </table>
    </div>
  </div>)
}