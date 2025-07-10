import { Link,  useNavigate } from "react-router-dom"

const AdminHomePage = () => {

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
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 " >
            <h1 className="text-2xl lg:text-3xl font-bold mb-6 mt-3  " > Admin Dashboard  </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  " >
                <div className="p-4 rounded-lg shadow-lg  " >
                    <h2 className="text-xl font-semibold  " >  Revenue </h2>
                    <p className="text-2xl" > $10000 </p>
                </div>   

                <div className="p-4 rounded-lg shadow-lg  " >
                    <h2 className="text-xl font-semibold  " >  Total Orders </h2>
                    <p className="text-2xl" > 200 </p>
                    <Link to="/admin/orders" className="text-blue-500 hover:underline  "  >  
                        Manage Orders
                    </Link>
                </div> 

                <div className="p-4 rounded-lg shadow-lg  " >
                    <h2 className="text-xl font-semibold  " >  Products </h2>
                    <p className="text-2xl" > 100 </p>
                    <Link to="/admin/products" className="text-blue-500 hover:underline  "  >  
                        Manage Products
                    </Link>
                </div>  
            </div>    
            <div className="mt-8 mb-20 " >
                <h2 className="mb-6 font-bold text-2xl " > Recent Orders  </h2>

         {

            orders.length > 0 ? (
          <div className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `} >
            <table className="  text-left min-w-[800px] md:min-w-full  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-3 px-4  " > Order ID </th>
                  <th className="py-3 px-4  " > User </th>
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
                            ${order?.totalPrice}                      
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
                    No Recent Order Found.
                 </div>   
            )
         }   

        

            </div>    
      </div>  
    </>
  )
}

export default AdminHomePage
