import CalenderPicker from "../CalenderPicker/CalenderPicker"
export default function TableResults({plannerList})
{
    console.log(plannerList)
    
    const handleClick = (e) =>
    {
        console.log(e.target.getAttribute('name'))
    }


    const TableRow = () => plannerList?.map((item,idx) =>
           {return(<tr className="bg-white dark:bg-gray-800" key={idx} >
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:underline hover:cursor-pointer"
                        name={item.id} onClick={handleClick} 
                        >{item.title}</th>
                        <td className="px-6 py-4">{item.created_at}</td> 
                        <td className="px-6 py-4">{item.created_at}</td> 
                        <td className="px-6 py-4">{parseInt(item.ref_count)}</td> 
                        <td className="px-6 py-4">Button?</td>                               
                    </tr>)
        })
    return(

        <div className="relative overflow-x-auto">
            {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                            Total Locations
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow />
                    
                </tbody>
            </table> */}
        </div>
        )
}