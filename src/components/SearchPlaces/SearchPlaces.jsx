import { useState } from "react"
import { searchPlaces, searchDetail, searchVeryDetail } from "../../utilities/search-service";
import dayjs from "dayjs";
import { useRef } from "react";

import { addLocationItem } from "../../utilities/planner-service";

import LoadingPopup from "../LoadingPopup/LoadingPopup";

import { searchResult } from "../../../atom";
import { useAtom } from "jotai";


export default function SearchPlaces({plannerDetails, handleSelect, handleSearch})
{
    const [searchState, setSearchState] = useState("");
    const [resultState, setResultState] = useAtom(searchResult);
    const [detailResult, setDetailResult] = useState({})
    const [loadingSts ,setLoadingSts] = useState(false);

    console.log(resultState)
    const TOKEN = process.env.GOOGLEMAP_API;

    const [isOpen, setIsOpen] = useState(false);

    const [popupContent, setpopupContent] = useState("");

    const [selectedResult, setSelectedResult] = useState("");
    const [selectedDay , setSelectedDay] = useState("0");

    const dropdown = useRef(null);

    const handleSubmit = async(e) =>
    {
        e.preventDefault();
        const searchResults  = await searchPlaces(searchState)
        const searchVeryDetai = await searchVeryDetail(searchState)
        // console.log(searchResults)
        // console.log(searchVeryDetai)
        console.log(searchVeryDetai)

        handleSearch({selected : searchVeryDetai , type: "result"});
        setResultState(searchVeryDetai)
        // handleSearch(searchVeryDetai)
    }

    const handleChange = (e) =>
    {
        setSearchState(e.target.value)
    }

    // console.log(resultState)
    // console.log("plannerDetails",plannerDetails)

    const handleAdd = () =>
    {
        console.log("adding")
    }

    const handleClicker = () =>
    {
        // console.log(dropdown.current)
        dropdown.current.removeAttribute("open")
    }

    const ListofDates = () => plannerDetails?.map((item,idx) =>
    {
        return(<li key={idx} onClick={handleClicker}><a>{dayjs(item.date).format("DD-MM-YYYY")} </a></li>)
    })

   

    const handleDetails = async(event) =>
    {
        // console.log(event.target.id)
        const placeID = event.target.id
        const results = await searchDetail(event.target.id)
        console.log(results)
        setDetailResult({...detailResult,[placeID]:results.result})          
    }

    const handleClick = (e) =>
    {   
        setIsOpen(true)
        const findIndex = resultState.findIndex(item => item.place_id === e.target.id)
        console.log("monitor",resultState[findIndex])
        setSelectedResult(resultState[findIndex])
    }

    const DetailSelectedResult = () =>
        {
            return(<>
            {selectedResult.name}
            {/* {selectedResult?.types?.map(item=><>{item}</>)} */}
            <div className="carousel carousel-center rounded-box">
                {selectedResult?.photos?.map((item,idx) => <div key={idx} className="carousel-item">
                    <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200
                    &maxheight=200&photoreference=${item.photo_reference}&key=${TOKEN}`}>
                        </img></div>)}</div>
            </>)
        }
    // console.log(selectedResult)

    const AddingOption = () =>
    {
        return(<details className="dropdown" ref={dropdown} id="dropdown">
        <summary className="m-1 btn">Add to your plan?</summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          <ListofDates/>
        </ul>
      </details>)
    }

    // console.log(resultState)

    const handleMapDirection = (e) =>
    {
        //to rotate to selected marker
        console.log(e.target.id);
        handleSelect({selected : e.target.id , type: "select", result: resultState});
    }

    const resultDisplay = resultState && resultState?.map((item,idx) => 
        {
            return(<div style={{display:"flex",backgroundColor:"grey"}} key={idx}>
            <div style={{display:"flex",flex:"1",backgroundColor:"white",margin:"10px"}} >
                <div className="collapse-title text-l font-small" style={{display:"flex"}}
                id={item.place_id} onClick={handleMapDirection}
                // onClick={handleDetails}
                >
                    {/* {item.description} */}
                    {item.formatted_address}
                    {/* <button onClick={handleAdd}>Add to your planner</button> */}
                </div>
                {/* <div className="collapse-content">  */}
                    <div>{Object.keys(detailResult).length !== 0  && (detailResult[item.place_id]?.formatted_address)}</div>
                    <div>⭐ {Object.keys(detailResult).length !== 0  && (detailResult[item.place_id]?.rating)}</div>
                {/* </div> */}
                
            </div>
            {<button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none 
            focus:ring-4 focus:ring-gray-300 font-medium rounded-lg 
            text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 
            dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" 
            id={item.place_id} onClick={handleClick}>Add</button>}
            </div>)
            // console.log(item)
        })

    // console.log(process.env.GOOGLEMAP_API)
    const handlelosePopUp = () =>
    {
    console.log("test")
      setIsOpen(false)
      setSelectedDay("0")
    }

    const handleAddToItinerary = async(e) =>
    {
        console.log(selectedDay)
        if(selectedDay !== "0")
        {
            setLoadingSts(true)
            const { geometry } = selectedResult;
            console.log(geometry.location)

            const data = {planner_items_id:selectedDay,name: selectedResult.name, locations: [geometry.location.lng,geometry.location.lat]}
            console.log(data)

            const response = await addLocationItem(selectedDay,data)
            console.log(response);
            // console.log("test")
            // console.log(selectedResult)
            // console.log("reload state is set: ",reloadState)
            setReloadState(e)
            setLoadingSts(false)
        }
    }

    const MyPopup = () =>
    {
        return(
        <div id='ModelContainer'
        className='fixed inset-0 bg-black flex justify-center items-center bg-opacity-20 backdrop-blur-sm' style={{zIndex:"1"}}>
        <div 
            className='p-2 bg-white w-10/12 md:w-1/2 lg:1/3 shadow-inner border-e-emerald-600 rounded-lg py-5'>
            <div
            className='w-full p-3 justify-center items-center'>
            <h2
                className='font-semibold py-3 text-center text-xl'>
                {selectedResult && <DetailSelectedResult/>}
                Which day would you like to add to?
                <OptionSelection/>
                <button onClick={handleAddToItinerary}>Add to Itinerary</button>
                <button onClick={handlelosePopUp}>Close Popup</button>
            </h2>
            
            </div>
        </div>
        </div>)
    }

  const handleChangeOption =(e) =>
  {
    const planneritemid = e.target.value;
    console.log(planneritemid)
    console.log(selectedResult)
    setSelectedDay(planneritemid);
  }

  
  const ListOptions = () => plannerDetails?.map((item,idx) =>
  {
      // <option key={idx}>{dayjs(item.date).format("DD-MM-YYYY")}</option>
      return(<option key={idx} value={parseInt(item.planner_items_id)}>{dayjs(item.date).format("DD-MM-YYYY")}</option>)
  })

  const OptionSelection = () =>
  {
    return(<form><label className="form-control w-full max-w-xs">
    <div className="label">
        <span className="label-text">Pick the best fantasy franchise</span>
        <span className="label-text-alt">Alt label</span>
    </div>

    <select className="select select-bordered" onChange={handleChangeOption} value={selectedDay}>
        <option disabled selected value="0">Pick one</option>
        <ListOptions/>
    </select>

    {/* </label> */}

    <div className="label">
        <span className="label-text-alt">Alt label</span>
        <span className="label-text-alt">Alt label</span>
    </div>
    </label>

    </form>)
  }

    return(<>
    
    {/* Search */}
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>   
    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" onChange={handleChange} id="default-search" 
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 
        rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 
        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
        <button type="submit" 
        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 
        focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
        text-sm px-4 py-2 dark:bg-blue-600 
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Search
        </button>
    </div>
    </form>

    {resultState && resultDisplay}

    
 
    {/* {plannerDetails && <AddingOption/>} */}
    {isOpen && <MyPopup />}
    {loadingSts && <LoadingPopup/>}

    


    

    



        
    </>)
}

