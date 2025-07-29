import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/products/FilterSidebar";
import { FaFilter } from "react-icons/fa";
import ProductGrid from "../components/products/ProductGrid";
import AboutVendor from "../components/vendor/AboutVendor";
import NewArrival from "../components/products/NewArrival";



const StoreDetailsPage = () => {
  const [storeDetails, setStoreDetails] = useState(null);
  const [productCount, setProductCount] = useState([]);
  const [newArrivals, setNewArrivals] = useState(null)

  const { id } = useParams(); // store id from URL

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const productContainerRef = useRef(null)
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Handle sidebar open/close for mobile
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

  // Fetch store details by ID
  const fetchStoreDetails = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor-store/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch store details");
    }
    return res.json();
  };

  const { data: detailsData, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["storeDetails", id],
    queryFn: fetchStoreDetails,
  });

  useEffect(() => {
    if (detailsData && detailsData.storeDetails) {
      setStoreDetails(detailsData.storeDetails);
      console.log("detailsData:", detailsData);
    }
  }, [detailsData]);



  const fetchVendorProducts = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/product/vendor-products/${storeDetails?.user?._id}?${searchParams.toString()}&page=${pageParam}&limit=20`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  };

  const {
    data: vendorProductData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isProductLoading,
  } = useInfiniteQuery({
    queryKey: ["vendorProducts", searchParams.toString(), id],
    queryFn: fetchVendorProducts,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    enabled: !!storeDetails?.user, 
  });

  // Flatten paginated product data
  const products = vendorProductData?.pages.flatMap((page) => page.vendorProducts) || [];

  const fetchNewArrivals = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/new-arrivals?productOwnerId=${id}`, {
    method: "GET",
    credentials: "include",
    });
    if (!res.ok) {
    throw new Error("Failed to fetch new arrivals");
    }
    return res.json();
};

const { data, isLoading } = useQuery({
    queryKey: ["newArrivals", id],
    queryFn: fetchNewArrivals,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,


  });

useEffect(() => {
    if (data) {
    setNewArrivals(data.newArrivals);
    console.log("newArrivals:", data.newArrivals);
    }
}, [data]);







  return (
    <div className="mx-auto pt-[92px] mb-10 md:pt-[101px] max-w-[1400px] px-[12px] container relative flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button
        ref={toggleButtonRef}
        onClick={toggleSidebar}
        className="flex border rounded-sm border-gray-300 mb-2 cursor-pointer justify-center items-center lg:hidden p-[7px]"
      >
        <FaFilter className="w-6 h-3" /> Filters
      </button>

      {/* Filter sidebar */}
      <div
        ref={sidebarRef}
        className={`absolute lg:border-r-2 border-gray-400 left-0 top-[88px] w-50 z-50 px-3 inset-y-0 bg-white overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "fixed px-[12px] translate-x-0" : " -translate-x-full"
        }`}
      >
        <FilterSidebar />
      </div>

      {/* Store details and products */}
      <div ref={productContainerRef} className="flex-grow relative lg:ml-50 w-full lg:w-2/3">
        {isDetailsLoading ? (
          <p className="text-center lg:text-lg my-4">Loading store details...</p>
        ) : storeDetails  && storeDetails?._id?.toString() === id? (
          <>
            <div className="relative">
              <img  
                className="rounded-md sm:rounded-xl w-full max-w-[1400px] max-h-[300px] sm:max-h-[450px] min-h-[220px] object-cover"
                src={storeDetails.storeLogo}
                alt={storeDetails.storeName}
              />
              <div className="absolute inset-0 rounded-md sm:rounded-xl bg-black opacity-50"></div>
              <div className="absolute font-bold px-[12px] md:px-[25px] inset-0 flex flex-col text-white justify-center items-start text-start">
                <h1 className="text-xl max-w-[800px] md:text-4xl leading-[35px] sm:leading-[60px] tracking-tighter uppercase">
                  {storeDetails.storeName}
                </h1>
                <p className="text-sm sm:text-xl max-w-[900px]">{storeDetails.bio}  </p>
                {storeDetails.contactNumber && (
                  <button className="cursor-pointer rounded-md bg-white shadow-md text-gray-900 md:text-[24px] py-[5px] md:py-[8px] md:rounded-lg mt-4 px-[12px] md:px-[20px]">
                    <a href={`tel:${storeDetails.contactNumber}`}>Contact Vendor</a>
                  </button>
                )}
              </div>
            </div>

{
  newArrivals && (
    <NewArrival newArrivals={newArrivals} isLoading={isLoading} text={"store"} />

  )
}

            {
            !isProductLoading && vendorProductData && detailsData?.totalVendorProducts === 0?(
                    <div className="text-lg xl:text-xl mt-10  text-gray-600 text-center text-center " > This vendor has no products yet! </div>
                ):(
                <div>
                         <h2 className="text-lg xl:text-2xl font-bold text-center mt-10 text-center uppercase">Shop Our Collection</h2>
                         <p  className="text-center sm:px-[20px] text-gray-600 mt-2  text-sm sm:text-lg" >Discover your favourite products from {storeDetails?.storeName}. Fast delivery, secure payments, and great deals.</p>
                   {!isProductLoading && vendorProductData && products.length === 0 && detailsData?.totalVendorProducts > 0 && (
                    <p className="text-center text-gray-600 mt-9 text-md sm:text-lg">No products found for your search.</p>
                  )}
                    <ProductGrid products={products} isLoading={isProductLoading} />

                 </div>
                )
            }


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
             <h2 className="text-lg xl:text-2xl font-bold text-center mt-18 text-center uppercase">About this store</h2>  
            < AboutVendor productsCount={detailsData?.totalVendorProducts}  storeDetails={storeDetails} />
          </>
        ) : (
          <p className="text-center lg:text-lg my-4">No store details available.</p>
        )}
      </div>
    </div>
  );
};

export default StoreDetailsPage;
