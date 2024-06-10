import { useAtomValue } from "jotai"
import { loginSts } from "../../../atom"
import { useEffect, useState } from "react";
import { getViewer } from "../../utilities/users-service";
import dayjs from "dayjs";

export default function UserViewerPage()
{
    const [user] = useAtomValue(loginSts)
    console.log(user)
    const [viewers, setViewers] = useState("")

    useEffect(() => {
        let ignore = false;
        
        async function getUserViewer(id)
        {
            const response = await getViewer({userid:id})
            if(!ignore){
                setViewers(response)
            }
        }
  
        
        if(user)
        {
            getUserViewer(user.id);
        }
        
  
        return () => {ignore = true;};
      }, [user]);
console.log(viewers)

const TableData = () => viewers && viewers.map((item,idx) => 
    {
        return(<tr key={idx}>
            <th>{idx + 1}</th>
            <td>{item.name}</td>
            <td>{item.usertype}</td>
            <td>{dayjs(item.created_at).format("DD-MMM-YY hh:mm a")}</td>
          </tr>)
    })

    return(<div className="overflow-x-auto" style={{display:"flex",flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
        <div style={{fontSize:"30px", margin:"10px"}}>Your Viewer</div>
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Tiers</th>
          <th>Viewed On</th>
        </tr>
      </thead>
      <tbody>
        <TableData/>
      </tbody>
    </table>
  </div>)
}