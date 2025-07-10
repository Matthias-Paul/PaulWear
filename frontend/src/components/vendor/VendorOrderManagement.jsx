import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation,  useQueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import VendorSearchBar from "./VendorSearchBar";
import { useParams, useSearchParams } from "react-router-dom";



const VendorOrderManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchVendorOrders = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders/vendor?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch your orders");
         
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["vendorOrders",  searchParams.toString()],
    queryFn: fetchVendorOrders,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });  

  console.log("Pages:", data?.pages);



const vendorOrders = data?.pages.flatMap((page) => page.orders) || [];
console.log(vendorOrders)






   
    const handleRowClick = (orderId) => {
      console.log("orderId", orderId)
      navigate(`/vendor/orders/${orderId}`);
    };

    
  return (
    <>
      <div className=" mt-[68px] pb-30 pr-[12px] md:pr-0 md:mt-3 mx-auto   ">
            <div className="flex justify-between items-start gap-x-2 "  >
              <h1 className="text-xl sm:text-2xl font-bold mb-6 mt-3  " > Order Management  </h1>
              <div className="  mt-3 " > <VendorSearchBar />
            </div>
        </div> 

             {
              
      vendorOrders.length > 0 || isLoading ? (
        <>
          <div className={` shadow-md  overflow-x-auto relative rounded-sm lg:rounded-md `} >
            <table className="  text-left min-w-[1200px] md:min-w-[1400px] text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-3 px-4  " > Customer </th>
                  <th className="py-3 px-4  " > Customer Phone </th>
                  <th className="py-3 px-4  " > Total Price </th>
                  <th className="py-3 px-4  " > Status </th>
                  <th className="py-3 px-4  " > Address </th>
                  <th className="py-3 px-4  " > items </th>
                  <th className="py-3 px-4  " > Created </th>


                </tr>
  
              </thead>
              <tbody>
                   { vendorOrders?.map((order, index)=>(
                        <tr onClick={() => handleRowClick(order?._id)}
                        key={order?._id} className={`border-b cursor-pointer hover:border-gray-400 ${index === vendorOrders?.length -1  ? "border-b-0": ""} `} >
                        
                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {order?.buyerName}
                         </td >

                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                         {order?.buyerPhoneNumber}                          
                         </td >

                         <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                            ₦{order?.totalPrice.toFixed(2)}                      
                         </td >
                        <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                        <span
                          className={`px-4 py-1 rounded text-md font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {order.status}
                          </span>                     
                         </td >


                         <td className=" py-4 px-4">
                          {order?.shippingAddress
                            ? `${order?.shippingAddress}`
                            : "N/A"}                  
                          </td>

                         <td className="py-3  px-4 sm:py-4 sm:px-4" > 
                         {order?.orderItems?.length} item{order?.orderItems?.length > 1 ? "s" : ""}
                         </td >

                         <td className=" py-4 px-4">
                   
                          {new Date(order.createdAt).toLocaleDateString()}{" "}
                          {new Date(order.createdAt).toLocaleTimeString()}
                          </td>

                        </tr>
  
  
                    )

                  
                )}

                
              </tbody>
              
            </table>  
           
        </div>
        {hasNextPage && (
          <div className="flex justify-center items-center">
            <button
              className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 my-7 text-white cursor-pointer"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load more"}
            </button>
          </div>
        )}


            </>): (
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
