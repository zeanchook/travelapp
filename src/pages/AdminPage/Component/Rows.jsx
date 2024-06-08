import { useEffect, useState } from "react"
import { getStats } from "../../../utilities/planner-service";
import { produce } from "immer";
import { tiers } from "../../../../atom";
import { useAtomValue } from "jotai";

export default function Rows({userList, handleSelection, selectedItem, handlePromotion})
{
    const [userStatsDetail, setUserStatsDetail] = useState("")
    
    const tiersState = useAtomValue(tiers)
    

    console.log(userList)

    useEffect(() => {
        async function getUser() {
          const response  = await getStats()

          const reducedData = {};
          response.forEach(item => {
            if (!reducedData[item.name]) {
                reducedData[item.name] = { name: item.name, planned: 0, completed: 0 };
            }
            if (item.status === "Planned") {
                reducedData[item.name].planned += 1;
            } else if (item.status === "Completed") {
                reducedData[item.name].completed += 1;
            }
});

            console.log(reducedData)
          setUserStatsDetail(reducedData)
        }
        getUser();
      }, []);

    const handleSelect =(e,item) =>
    {
        // setSelectedItem(item)
        e.preventDefault();
        if(item.usertype !== "admin")
        {
        console.log(e.target.value)
        const updatedState = produce(selectedItem, (draft) => {
            if(!draft[item.name])
            {
                draft[item.name] = item
            }
            else{
                delete draft[item.name]
            }
          });
          console.log(updatedState)
          handleSelection(updatedState)
        }
    }

    const handlePromo = (e,item) =>
    {
      const type = e.target.value
      console.log(type)
      console.log(tiersState)
      const selectedUser = item

      const tierIndex = tiersState.findIndex(item => item.name === selectedUser.usertype)
      const userIndex = userList.findIndex(item => item.id === selectedUser.id)
      const updatedState = produce(userList, (draft) => {
        draft[userIndex].usertype = tiersState[tierIndex + parseInt(type)].name
      });
      handlePromotion(updatedState,updatedState[userIndex])
      

      
    }

    console.log(userStatsDetail)
    const Rows = () => userList && userList?.map((item,idx) => 
        {
            return(<tr key={idx}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" 
                    checked={selectedItem[item.name]}
                    onChange={(e)=> handleSelect(e,item)}
                    />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png" 
                        alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                 {(item.usertype !== "admin" && item.usertype !== "stone") ? <button value="-1" onClick={(e) => handlePromo(e,item)}>🔻</button> : ""}
                  <span className="badge badge-ghost badge-sm">{item.usertype}</span>
                  {(item.usertype !== "admin" && item.usertype !== "gold") ? <button value="+1" onClick={(e) => handlePromo(e,item)}>🔺</button> : ""}
                  </div>
                </td>
                <td>
                    
                    <span className="badge badge-ghost badge-sm">
                      {userStatsDetail[item.name]?.completed ? userStatsDetail[item.name]?.completed : 0}
                      </span>
                    </td>
                <th>
                  <button className="btn btn-ghost btn-xs">Details</button>
                </th>
              </tr>)
        })
    return(<Rows/>)
}