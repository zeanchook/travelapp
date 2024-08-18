import React from "react"
export default function LoadingPopup()
{
    

      const msg = [
          "Planning your dream vacation, just for you!",
          "Your personalized itinerary is loading...",
          "We're curating your travel experiences, just a moment!",
          "Loading your travel plans, stay tuned!",
          "Your personalized travel guide is on its way!",
          "Just a sec, we're mapping out your adventures...",
          "Your travel itinerary is being prepared, hang tight!",
          "Loading your sightseeing list, just for you!",
          "We're crafting your perfect getaway, just a minute!",
          "Your travel plans are being generated, stay tuned!"
        ]
  
      return(
      <div id='ModelContainer'
        className='fixed inset-0 bg-black flex justify-center items-center bg-opacity-20 backdrop-blur-sm' style={{zIndex:"10"}}>
        <div 
          className='p-2 bg-white w-10/12 md:w-1/2 lg:1/3 shadow-inner border-e-emerald-600 rounded-lg py-5'>
          <div
            className='w-full p-3 flex flex-col justify-center items-center'>
            <div
              className='font-semibold py-3 text-center text-xl'>
                {msg[Math.floor(Math.random()*msg.length)]} 
            </div>
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        </div>
      </div>)
    
}