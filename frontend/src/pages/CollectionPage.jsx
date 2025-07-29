import { useState, useEffect, useRef } from "react";
import pic from "../assets/pic.jpg";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/products/FilterSidebar";
import SortOptions from "../components/products/SortOptions";
import ProductGrid from "../components/products/ProductGrid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";


const CollectionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const productContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const [searchParams] = useSearchParams();



  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(e.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProducts = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/product?${searchParams.toString()}&page=${pageParam}&limit=20`,
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
    queryKey: ["products", searchParams.toString()],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.products.length < 20) return undefined;
      return pages.length + 1;
    },
  });
 
 


 
  // Flatten paginated data into a single array
  const products = data?.pages.flatMap((page) => page.products) || [];

  return (
    <>
      <div className="container bg-gray-50 relative px-[12px] flex flex-col lg:flex-row pt-[90px] pb-[80px] max-w-[1400px] mx-auto">
        {/* mobile button */}
        <button
          ref={toggleButtonRef}
          onClick={toggleSidebar}
          className="flex border rounded-sm border-gray-300 my-1 sm:my-2 cursor-pointer justify-center items-center lg:hidden p-2"
        >
          <FaFilter className="w-6 h-4" /> Filters
        </button>

        {/* filter sidebar */}
        <div
          ref={sidebarRef}
          className={`absolute left-0 top-[88px] w-50 z-50 px-3 inset-y-0 bg-white overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? "fixed px-[12px] translate-x-0" : " -translate-x-full"
          }`}
        >
          <FilterSidebar />
        </div>

        <div ref={productContainerRef} className="flex-grow  lg:pl-50 w-full lg:w-2/3">
          <h1 className="text-md  sm:text-lg xl:text-2xl text-center my-2 sm:my-3 uppercase">
            All Products
          </h1>


          {/* sort options */}
          <SortOptions />

            
          {/* product grid */}
           {!isLoading && data && data.pages[0].products.length === 0 && (
          <p className="text-center text-gray-600 mt-9 text-md sm:text-lg">No products found for your search.</p>
           )}
          <ProductGrid products={products} isLoading={isLoading} />
           {hasNextPage && (
            <div className="flex justify-center items-center">
              <button
                className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 my-10 text-white cursor-pointer"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading more..." : "Load more"}
              </button>
            </div>
          )}
        
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
