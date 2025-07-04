import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const VendorOrderDetails = () => {
    const { id } = useParams()
    const [orderDetails, setOrderDetails] = useState(null)
    const queryClient = useQueryClient();

  
  const fetchOrderDetails = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch order details");
    }
    return res.json();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: fetchOrderDetails,
  });

  useEffect(() => {
    if (data) {
      setOrderDetails(data.orderDetails)
      console.log("orderDetails:", data);
    }
  }, [data]);



  const markMutation = useMutation({
    mutationFn: async ()=>{
  
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/markAsDelivered/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to mark as delivered");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["orderDetails", id]);

    },
    onError: (error) => {
      toast.error(error.message);
    },

  })
  const handleMarkAsDelivered = async()=>{
 
    markMutation.mutate();


  }

  return (
    <>
      <div className=" pt-12 md:pt-0 pr-[12px] mx-auto max-w-[1000px] mb-20 " >
                <h2 className="font-bold mb-2 text-xl md:text-2xl mt-6 " > Order Details </h2>
                {
                  !orderDetails  ? (<p className="  " > Loading order details... </p>) : (
                        <div className="p-4 sm:p-6 rounded border border-gray-400  " > 
                            <div className="flex flex-col sm:flex-row justify-between  " >
                                <div className="  " >
                                    <h3 className="text:lg  md:text-xl font-semibold    " > 
                                        Order ID: #{orderDetails?._id}
                                    </h3>
                                    <p className="text-gray-600  " > { new Date(orderDetails?.createdAt).toLocaleDateString()  } </p>
                                </div>  

                                <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0  " >
                                    <span className={` ${orderDetails?.isPaid? "bg-green-100 text-green-700" : " bg-red-100 text-red-700" } py-1 px-3 rounded-lg text-sm mb-3    `}  > 
                                       { orderDetails?.isPaid ? "Approved" : "Pending"} 
                                    </span>
                                    <span className={` ${orderDetails?.isReceived? "bg-green-100 text-green-700" : " bg-yellow-100 text-yellow-700" } py-1 px-3 rounded-lg text-sm mb-3    `}  > 
                                       { orderDetails?.isReceived ? "Received" : "Pending Received"} 
                                    </span>

                                    <span>

                                    <button onClick={handleMarkAsDelivered} disabled={orderDetails?.isDelivered}
                                      className={`py-1 px-2 ${markMutation.isPending || orderDetails?.isDelivered  ? "cursor-not-allowed bg-green-100 text-green-700 " : "cursor-pointer text-white hover:bg-green-600 bg-green-500 "}    rounded-md`} > 
                                        {markMutation.isPending
                                            ? "Processing..."
                                            : orderDetails?.isDelivered
                                                ? "Order delivered"
                                                : "Mark order as delivered"}
                                        </button>
                                    </span>  
                                </div>      
                            </div>     

                            {/* customer, payment, shipping info */}
                                <div className="grid mb-13 mt-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-6  " >
                                        <div>
                                            <h3 className="text:lg  mb-2 font-semibold    " > 
                                                    Payment Info
                                            </h3>
                                            <p> Payment Method: { orderDetails?.paymentMethod} </p>
                                            <p> Status: { orderDetails?.isPaid ? "Paid" : "Unpaid"} </p>
                                            <p> Payout Status: { orderDetails?.isPayoutSuccess ? "Paid" : "Pending"} </p>

                                            


                                         </div>   
                                          <div>
                                            <h3 className="text:lg  mb-2 font-semibold    " > 
                                                    Delivery Info
                                            </h3>
                                            <p>Delivery Address: { ` ${orderDetails?.shippingAddress} ` } </p>
                                            {
                                            orderDetails?.deliveredAt && (
                                                <p> Delivered At: {" "}
                                                {new Date(orderDetails?.deliveredAt).toLocaleDateString()}{" "}
                                                {new Date(orderDetails?.deliveredAt).toLocaleTimeString()}
                                                </p>
                                            )
                                           }
                                         </div>  

                                         <div>
                                            <h3 className="text:lg  mb-2 font-semibold    " > 
                                                    Customer Info
                                            </h3>
                                            <p> Customer Name: {orderDetails?.buyerName  } </p>
                                            <p> Customer Email: {orderDetails?.user?.email} </p>
                                            <p className="flex items-start  mt-1 " > Customer Phone No: <a className="ml-2 text-sm sm:text-md  bg-green-100 text-green-700 px-2 py-1 rounded " href={`tel:${orderDetails?.buyerPhoneNumber}`} > {orderDetails?.buyerPhoneNumber} </a> </p>

                                         </div>  

                                </div>

                                {/* products list  */}


         { orderDetails?.orderItems ? (
            <div className={` shadow-md overflow-hidden  overflow-x-auto  relative rounded-sm lg:rounded-md `} >
            <table className="w-full  text-left min-w-[800px]  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-2 px-4 sm:py-3 " > Name </th>
                  <th className="py-2 px-4 sm:py-3 " > Color </th>
                  <th className="py-2 px-4 sm:py-3 " > Size </th>
                  <th className="py-2 px-4 sm:py-3 " > Quantity </th>
                  <th className="py-2 px-4 sm:py-3 " > Total </th>


                </tr>
  
              </thead>
              <tbody>
                   { orderDetails?.orderItems?.map((item, index)=>(
                        <tr key={`${item.productId}-${item.size}-${item.color}`} className={`border-b cursor-pointer hover:border-gray-400 ${index === orderDetails?.orderItems?.length -1  ? "border-b-0": ""} `} >
                       <td className="py-2 px-4 flex items-center  sm:py-3 sm:px-4 " > 
                        <img src={item?.image} className="w-12 h-12 mr-2 rounded-lg sm:rounded-md object-cover flex-shrink-0 " alt={item?.name} />
                            <Link to={`/product/${item.productId}`} className="text-blue-500 hover:underline" >
                                {item?.name}
                            </Link>
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {item?.color}
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {item?.size}
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            {item?.quantity}                      
                         </td >
                        <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            ₦{item?.price.toFixed(2)}                      
                         </td >

                        </tr>
  
                    )
                )}
              </tbody>
              
            </table>  
  
          </div>
        

          ):(
            isLoading ? (
            <div className=" text-gray-500 text-xl px-4 text-center" > Loading  order details... </div>
          ):(
          <div className=" text-gray-500 text-xl px-4 text-center" >
            No order details found!
          </div>
          )

          )

        }

                    <div className="mt-5" >    
                        <Link to={`/vendor/orders`}  className="text-blue-500 pt-4 hover:underline" >
                                Back to my orders
                        </Link>
                    </div>
                        </div>
                    )
                }
            
      </div>  
    </>
  )
}

export default VendorOrderDetails



