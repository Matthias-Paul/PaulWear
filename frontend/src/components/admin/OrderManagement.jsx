
const OrderManagement = () => {
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

    

  return (
    <>
      <div className=" mt-[80px] pr-[12px] md:pr-0  md:mt-3 mx-auto   ">
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
                            ₦{order?.totalPrice.toFixed(2)}                      
                         </td >
                        <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                          {order?.status}                   
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

export default OrderManagement
