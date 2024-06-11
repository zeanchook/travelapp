export default function LoadingPopup2({msg})
{
      
      return(
      <div id='ModelContainer'
        className='fixed inset-0 bg-black flex justify-center items-center bg-opacity-20 backdrop-blur-sm' style={{zIndex:"10"}}>
        <div 
          className='p-2 bg-white w-10/12 md:w-1/2 lg:1/3 shadow-inner border-e-emerald-600 rounded-lg py-5'>
          <div
            className='w-full p-3 flex flex-col justify-center items-center'>
            <div
              className='font-semibold py-3 text-center text-xl'>
                Loading {msg}
            </div>
            <span className="loading loading-bars loading-lg"></span>
          </div>
        </div>
      </div>)
    
}