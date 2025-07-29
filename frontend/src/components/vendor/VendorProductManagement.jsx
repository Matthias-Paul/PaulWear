import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import FilterSidebar from "../products/FilterSidebar";
import VendorSearchBar from "./VendorSearchBar";

import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";


const VendorProductManagement = () => {

  const { loginUser } = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();




    const fetchVendorProducts = async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/vendor?${searchParams.toString()}&page=${pageParam}&limit=15`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    };
  
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
    } = useInfiniteQuery({
      queryKey: ["vendorProducts", searchParams.toString(), loginUser.id],
      queryFn: fetchVendorProducts,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasNextPage ? pages.length + 1 : undefined;
      },
      enabled: !!loginUser?.id, 
    });
  
    const products = data?.pages.flatMap((page) => page.vendorProducts) || [];
    console.log(products)



    const deleteMutation = useMutation({
      mutationFn: async ({productId}) => {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to delete product");
          }

          return res.json();
        },
        onSuccess: (data) => {
       

        queryClient.invalidateQueries("vendorProducts");
        toast.success(data.message);

    },
    onError: (error) => {
      toast.error(error.message);
    },

  })



        const handleDeleteProduct =(productId)=>{
            if(window.confirm("Are you sure you want to delete this product?")){
                console.log("Deleting product with ID", productId)
               deleteMutation.mutate({productId})


            }
        }


  return (
    <>
      <div className="pt-[82px] md:pt-5 pb-20 "  >
        <div className="flex justify-between items-start mr-3 md:mr-0 gap-x-2 "  >
          <div className=" text-xl text-gray-900 sm:text-2xl font-bold mb-6 " > Product Management  </div>
          <div className="   " > <VendorSearchBar /> </div>
        </div> 
        <Link to="/vendor/products/add">
        <button  className="py-1 px-2  lg:px-4 lg:text-xl mb-2 rounded bg-gray-900 hover:bg-gray-700 text-white cursor-pointer  "   >  Add Product </button>
        </Link> 
               
        <div className="text-xs sm:text-sm text-gray-500 px-3 mb-3 italic">
          <strong className="font-semibold">Notice:</strong> Please delete products that are no longer in stock or unavailable. 
          This helps maintain an accurate store and a better shopping experience for buyers.
        </div>
                {

            products.length > 0 || isLoading ? (
              <>
          <div className={` mr-[12px] md:mr-0 shadow-md overflow-hidden overflow-x-auto  relative rounded-sm lg:rounded-md `} >
            <table className="  text-left min-w-[900px] md:min-w-[1000px]  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-3 px-4  " > S/N </th>
                  <th className="py-3 px-4  " > Image </th>
                  <th className="py-3 px-4  " > Name </th>
                  <th className="py-3 px-4  " > Price </th>
                  <th className="py-3 px-4  " > category </th>
                  <th className="py-3 px-4  " > Actions </th>

                </tr>
  
              </thead>
              <tbody>
                   { products?.map((product, index)=>(
                        <tr key={product?._id} className={`border-b cursor-pointer hover:border-gray-400 ${index === products?.length -1  ? "border-b-0": ""} `} >
                         
                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {index + 1}
                        </td >

                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            <img src={product?.images[0]?.url} className=" h-15 w-18  sm:h-18 sm:w-21 flex-shrink-0  object-cover rounded-lg shadow-md   " />
                         </td >
                         <td className="py-3 px-4 capitalize sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {product?.name}
                         </td >
                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            ₦{product?.price.toLocaleString()}
                         </td >

                         <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                            {product?.category}
                         </td >
                        <td className="py-3 sm:py-4   " > 
                          <div className="flex pr-4  "  >
                            <Link to={`/vendor/products/${product._id}/edit`} >
                            <button  className="py-1 px-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer  "  >
                                Edit
                            </button> 
                            </Link>
                            <button onClick={()=> handleDeleteProduct(product._id) } className="py-1 px-2 rounded bg-red-500 hover:bg-red-600 text-white cursor-pointer ml-2  "  >
                                Delete
                            </button>  
                            </div>  
                         </td >

                        </tr>
  
                    )
                )}


              </tbody>
              
            </table>  
  
        </div>
            {hasNextPage && (
              <div className="flex justify-center items-center">
                <button
                  className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 mt-8 text-white cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
              </div>
            )}
            </>): (
                <div className="text-gray-700 font-semibold text-lg " >
                    No Products Found.
                 </div>   
            )
         }  
      </div>  
    </>
  )
}

export default VendorProductManagement
