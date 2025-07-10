import StoreHero from "../components/layout/StoreHero"
import StoreGrid from "../components/vendor/StoreGrid"
import Faq from "../components/common/Faq"
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery , useInfiniteQuery} from "@tanstack/react-query";
import toast from "react-hot-toast";





const StorePage = () => {
  const [searchParams] = useSearchParams();
     
  const fetchStore = async ({ pageParam = 1 }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor-store?${searchParams.toString()}&page=${pageParam}&limit=12`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch store");
    }
    return res.json();
  };

   const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["stores", searchParams.toString() ],
    queryFn: fetchStore,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });



  
      const stores = data?.pages.flatMap((page) => page.stores) || [];


  return (
    <>
      <div  className="max-w-[1400px] mx-auto " >
            <StoreHero />
        <div className="px-[12px] mx-auto bg-gray-50 "  >
            <h2 className="  text-2xl sm:text-3xl font-bold text-center py-10 "  > Browse All Store </h2>
            
                {!isLoading && stores.length === 0 && (
                    <p  className="text-center text-gray-600  text-md sm:text-lg" >No store found for your search.</p>
                )}
                                
            <StoreGrid stores={stores}  isLoading={isLoading} />
        {hasNextPage && (
            <div className="flex justify-center items-center">
              <button
                className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 my-4 text-white cursor-pointer"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading more..." : "Load more"}
              </button>
            </div>
          )}

             <Faq />
        </div>        
      </div>  
    </>
  )
}

export default StorePage
