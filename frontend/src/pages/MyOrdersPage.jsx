import pic from "../assets/pic.jpg"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";


const MyOrdersPage = () => {
  const [orders, setOrders ] = useState([])
  const navigate = useNavigate()

  
  const fetchOrders = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }
    return res.json();
  };

  const { data, isLoading} = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  

  useEffect(() => {
    if (data) {
      setOrders(data.orders)
      console.log("Orders:", data.orders);
    }
  }, [data]);



  const handleRowClick = (orderId) =>{


    navigate(`/order/${orderId}`)


  }


  return (
    <>
      <div className="mx-auto pt-[90px] px-[12px] pb-10 w-full " >
        <h1 className="text-xl md:text-2xl font-bold my-6" > My Orders </h1>

        {
          
        }
        { orders?.length > 0 ? (
            <div className={` shadow-md   overflow-x-auto  relative rounded-sm lg:rounded-md `} >
            <table className="w-full text-left min-w-[900px] lg:min-w-full  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-2 px-4 sm:py-3 " > Image </th>
                  <th className="py-2 px-4 sm:py-3 " > Name </th>
                  <th className="py-2 px-4 sm:py-3 " > Created </th>
                  <th className="py-2 px-4 sm:py-3 " > Shipping Address </th>
                  <th className="py-2 px-4 sm:py-3 " > Quantity</th>
                  <th className="py-2 px-4 sm:py-3 " > Price </th>
                  <th className="py-2 px-4 sm:py-3 " > Status </th> 
                </tr>
  
              </thead>
              <tbody>
                   { orders?.map((order, index)=>(
                        <tr key={order?._id} onClick={()=> handleRowClick(order?._id) } className={`border-b text-[15px] md:text-[17px]  cursor-pointer hover:border-gray-400 ${index === orders?.length -1  ? "border-b-0  mb-3": ""} `} >
                       <td className=" px-4  sm:px-4 " > 
                        <img src={order?.orderItems[0]?.image} className="w-12 h-12  rounded-lg sm:rounded-md object-cover flex-shrink-0 " alt={order?.orderItems[0]?.name} />
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {order?.orderItems[0]?.name}
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            { new Date(order.createdAt).toLocaleDateString()}{"  "}
                            { new Date(order.createdAt).toLocaleTimeString()}
  
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            {order?.shippingAddress ? ` ${order?.shippingAddress?.city}, ${order?.shippingAddress?.country}` : "N/A"  }
                        
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            {  order?.orderItems[0]?.quantity }                      
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            ${order?.totalPrice}                      
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
  
                          <span className={` ${order.isPaid ?  "bg-green-100 text-green-600 ":   " bg-red-100 text-red-600 "} px-3 py-2 rounded text-sm font-medium `} > {order.isPaid ? "Paid" :"Pending"}  </span>
  
  
                         </td >
                        </tr>
  
                    )
                )}
              </tbody>
              
            </table>  
  
          </div>
        

          ):(
            isLoading ? (
            <div className=" text-gray-500 text-xl px-4 text-center" > Loading your orders... </div>
          ):(
          <div className=" text-gray-500 text-xl px-4 text-center" >
            You have no orders yet !
          </div>
          )
            
          )

        }

      </div>  
    </>
  )
}

export default MyOrdersPage
