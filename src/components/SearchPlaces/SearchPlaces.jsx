import { useState } from "react"
import { searchPlaces, searchDetail } from "../../utilities/search-service";

export default function SearchPlaces()
{
    const [searchState, setSearchState] = useState("");
    const [resultState, setResultState] = useState("");
    const [detailResult, setDetailResult] = useState({})

    const handleSubmit = async(e) =>
    {
        e.preventDefault();
        const searchResults  = await searchPlaces(searchState)
        setResultState(searchResults)
    }

    const handleChange = (e) =>
    {
        setSearchState(e.target.value)
    }

    // console.log(resultState)

    const handleAdd = () =>
    {
        console.log("adding")
    }

    const handleDetails = async(event) =>
    {
        console.log(event.target.id)
        const placeID = event.target.id
        const results = await searchDetail(event.target.id)
        console.log(results)
        setDetailResult({...detailResult,[placeID]:results.result})          
    }

    console.log(detailResult)

    const resultDisplay = resultState?.predictions?.map((item,idx) => 
        {
            return(
            <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 bg-base-100" key={idx}>
                <div className="collapse-title text-xl font-medium" style={{display:"flex"}}
                id={item.place_id}
                onClick={handleDetails}
                >
                    {/* {item.description} */}
                    {item.description}
                    {/* <button onClick={handleAdd}>Add to your planner</button> */}
                </div>
                <div className="collapse-content"> 
                    <div>{Object.keys(detailResult).length !== 0  && (detailResult[item.place_id]?.formatted_address)}</div>
                    <div>⭐ {Object.keys(detailResult).length !== 0  && (detailResult[item.place_id]?.rating)}</div>
                    {/* <button>add</button> */}
                </div>
            </div>)
            // console.log(item)
        })

    // console.log(process.env.GOOGLEMAP_API)
    return(<>
    
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>   
    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" onChange={handleChange} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
    </form>

    {resultState && resultDisplay}
        
    </>)
}

// https://places.googleapis.com/v1/places:searchText&key=AIzaSyBX7rQJzbDPH7BbvmsihiXmrFFLyoeJFCs
// https://maps.googleapis.com/maps/api/place/autocomplete/json?input=fff&key=AIzaSyBX7rQJzbDPH7BbvmsihiXmrFFLyoeJFCs
// https://maps.googleapis.com/maps/api/place/autocomplete/json?input=google&key=AIzaSyBX7rQJzbDPH7BbvmsihiXmrFFLyoeJFCs
// https://maps.googleapis.com/maps/api/place/autocomplete/json?input=kbmall&key=AIzaSyBX7rQJzbDPH7BbvmsihiXmrFFLyoeJFCs
// https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ46TVO5CvtjERw5To4Somqtw&key=AIzaSyBX7rQJzbDPH7BbvmsihiXmrFFLyoeJFCs