export default function UserCard({currentUser, userStats, handleGetHeatMap, handleCreate, handleGetPlanner})
{
    const [user] = currentUser

    const handleHeatMapClicker = () =>
    {
        handleGetHeatMap();
    }

    const handleCreatePlanner = () =>
    {
        handleCreate();
    }

    const handleGoAndGetThatPlanner = () =>
    {
        handleGetPlanner();
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
            <p className="text-gray-500 border-rose-700	border-2 w-24 rounded-lg text-xs">{user.usertype}</p>
        </div>
        <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
            <li className="flex flex-col items-center justify-around">
                👁️
                <div>-</div>
            </li>
            <li className="flex flex-col items-center justify-between" style={{cursor:"pointer"}}
                onClick={handleGoAndGetThatPlanner}
            >
                📒
                <div>{userStats.title}</div>
            </li>
            <li className="flex flex-col items-center justify-around" style={{cursor:"pointer"}}
                onClick={handleHeatMapClicker}
            >
                🌎
                <div>{userStats.completed}</div>
            </li>
        </ul>
        <div className="p-4 border-t mx-8 mt-2">
            <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
                onClick={handleCreatePlanner}
            >
                Create a Planner</button>
        </div>
    </div>)
}