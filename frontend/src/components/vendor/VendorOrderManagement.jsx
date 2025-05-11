
const VendorOrderManagement = () => {
  const orders = [
        {
            _id:123,
            users: {
                name:"Daniel James"
            },
            totalPrice: 110,
            status:"Processing"
        },
        {
            _id:1234,
            users: {
                name:"Mike Johnson"
            },
            totalPrice: 180,
            status:"Processing"
        },
        {
            _id:12345,
            users: {
                name:"North Mike"
            },
            totalPrice: 210,
            status:"Processing"
        },
        {
            _id:123456,
            users: {
                name:"Nicholas Nail"
            },
            totalPrice: 400,
            status:"Processing"
        }

    ]

    const handleStatusChange = (orderId, status)=>{
        console.log({id:orderId, status})
    }

  return (
    <>
      <div className=" mt-[80px]  md:mt-3 mx-auto   ">
            <h1 className="text-2xl font-bold mb-6 mt-3  " > Order Management  </h1>


             {

            orders.length > 0 ? (
          <div className={` shadow-md overflow-x-auto relative rounded-sm lg:rounded-md `} >
            <table className="  text-left min-w-[800px] md:min-w-full  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-3 px-4  " > Order ID </th>
                  <th className="py-3 px-4  " > Customer </th>
                  <th className="py-3 px-4  " > Total Price </th>
                  <th className="py-3 px-4  " > Status </th>
                  <th className="py-3 px-4  " > Actions </th>


                </tr>
  
              </thead>
              <tbody>
                   { orders?.map((order, index)=>(
                        <tr key={order?._id} className={`border-b cursor-pointer hover:border-gray-400 ${index === orders?.length -1  ? "border-b-0": ""} `} >
                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {order?._id}
                         </td >
                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {order?.users?.name}
                         </td >

                         <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                            ${order?.totalPrice}                      
                         </td >
                        <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                        <select name="role" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value) } className=" focus:ring-blue-500 focus:border-blue-500   w-full block cursor-pointer bg-gray-50 text-sm p-2 rounded border border-gray-400 mt-1 " >
                            <option value="processing" > Processing </option>
                            <option value="shipped" > Shipped </option>
                            <option value="delivered" > Delivered </option>
                            <option value="cancelled" > Cancelled </option>
                        </select>                      
                         </td >

                         <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                            
                            <button className="bg-green-500 hover:bg-green-600 rounded py-2 px-2 cursor-pointer text-white  " onClick={()=> handleStatusChange(order._id, "delivered")}  >
                                Mark as Delivered
                            </button>    
                         </td >

                        </tr>
  
                    )
                )}
              </tbody>
              
            </table>  
  
        </div>
            ): (
                <div className="text-gray-700 font-semibold text-lg " >
                    No  Orders Found.
                 </div>   
            )
         }   

      </div>  
    </>
  )
}

export default VendorOrderManagement
