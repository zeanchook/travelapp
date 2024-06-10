import { useAtomValue } from "jotai";
import { loginSts, tiers } from "../../../atom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserCard({currentUser: selectedUser, userStats, handleGetHeatMap, handleGetPlanner})
{
    const [user] = selectedUser
    const [currentUser] = useAtomValue(loginSts)

    const [owner , setOwner] = useState("")

    
    const tiersValue = useAtomValue(tiers)
    console.log(tiersValue)
    console.log(user.usertype)

    console.log(user,currentUser)

    useEffect(() => {
        let ignore = false;
        
        function isOwner()
        {
            console.log(user,currentUser)
            if(!ignore)
            {
                setOwner(parseInt(user.id) === parseInt(currentUser.id))
                
            }
        }

        isOwner();

        return () => {ignore = true;};
      }, [user]);



    console.log(owner)

    const findusertype = (tiersValue && user) && tiersValue.findIndex(item => item.name === user.usertype)
    console.log(findusertype)

    const navigate = useNavigate();

    console.log(selectedUser)
    // const handleHeatMapClicker = () =>
    // {
    //     handleGetHeatMap();
    // }

    // const handleGoAndGetThatPlanner = () =>
    // {
    //     handleGetPlanner();
    // }

    const handleGetViewer = () =>
    {
        navigate("/userviewerpage")
    }

    return(
    
        <div
        className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
        <div className="rounded-t-lg h-32 overflow-hidden">
            <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
        </div>
        <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img className="object-cover object-center h-32" 
            src='https://images.twinkl.co.uk/tr/raw/upload/u/ux/earth-parents-wiki_ver_1.jpg' alt='Woman looking front'/>
        </div>
        <div className="text-center mt-2" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <h2 className="font-semibold">{user.name}</h2>
            <p style={tiersValue[findusertype]?.style}>{user.usertype}</p>
            {/* className="text-gray-500 border-rose-700	border-2 w-24 rounded-lg text-xs" */}
        </div>
        <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
            {owner ? <li className="flex flex-col items-center justify-around"
                onClick={handleGetViewer}
            >
                👁️
                <div>{userStats.views}</div>
            </li> : 
            <li className="flex flex-col items-center justify-around" style={{cursor:"pointer"}}
        >
            👁️
            <div>{userStats.views}</div>
        </li>
            }
            <li className="flex flex-col items-center justify-between" style={{cursor:"pointer"}}
                // onClick={handleGoAndGetThatPlanner}
            >
                {/* findusertype */}
                📒
                <div>{userStats.title}</div>
            </li>
            <li className="flex flex-col items-center justify-around" style={{cursor:"pointer"}}
                // onClick={handleHeatMapClicker}
            >
                🌎
                <div>{userStats.completed}</div>
            </li>
        </ul>
    </div>)
}