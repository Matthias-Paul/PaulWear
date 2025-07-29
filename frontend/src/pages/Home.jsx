import pic from "../assets/pic.jpg";
import { useNavigate } from "react-router-dom"
import Hero from "../components/layout/Hero";
import FeaturedCollection from "../components/products/FeaturedCollection";
import FeaturesSection from "../components/products/FeaturesSection";
import NewArrival from "../components/products/NewArrival";
import ProductGrid from "../components/products/ProductGrid";
import CategoryGrid from "../components/products/CategoryGrid";
import BestProduct from "../components/products/BestProduct";
import { useRef, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import StoreGrid from "../components/vendor/StoreGrid"


const Home = () => {
  const [bestProduct, setBestProduct] = useState(null);
  const [newArrivals, setNewArrivals] = useState(null)


  const fetchNewArrivals = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/new-arrivals`, {
    method: "GET",
    credentials: "include",
    });
    if (!res.ok) {
    throw new Error("Failed to fetch new arrivals");
    }
    return res.json();
};

const { data, isLoading } = useQuery({
    queryKey: ["newArrivals"],
    queryFn: fetchNewArrivals,
});

useEffect(() => {
    if (data) {
    setNewArrivals(data.newArrivals);
    console.log("newArrivals:", data.newArrivals);
    }
}, [data]);



const fetchMostOrdered = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/most-ordered`, {
  method: "GET",
  credentials: "include",
  });
  if (!res.ok) {
  throw new Error("Failed to fetch most ordered products");
  }
  return res.json();
};

const { data:mostOrderedData, isLoading:mostOrderedIsLoading } = useQuery({
  queryKey: ["mostOrdered"],
  queryFn: fetchMostOrdered,
});



const fetchBestRatingStore = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/best-store`, {
  method: "GET",
  credentials: "include",
  });
  if (!res.ok) {
  throw new Error("Failed to fetch best rating store");
  }
  return res.json();
};

const { data:bestRatingStore, isLoading:bestRatingStoreIsLoading } = useQuery({
  queryKey: ["bestRatingStore"],
  queryFn: fetchBestRatingStore,
});



  return (
    <>
      <div className="  h-full   text-black  ">
        <Hero />
        <div className="container  max-w-[1400px] mx-auto  ">

          <div className="mx-auto bg-gray-50 pt-7  max-w-[1400px] w-full container">
            <h2 className="text-2xl sm:text-3xl font-bold text-center my-2 ">
              Shop By Category
            </h2>
            <h3 className="  text-sm sm:text-xl text-center my-2 " > Explore a wide range of categories  from fashion to food, beauty, and more. </h3>
            <CategoryGrid  />
          </div>
          <NewArrival newArrivals={newArrivals} isLoading={isLoading} text={"sellers"} />
        <div className="px-3" >
          <h3 className="  text-2xl sm:text-3xl font-bold text-center my-3" > Most Ordered Products </h3>
          <p className="text-sm px-3 sm:text-xl text-center  ">
            Our most ordered products- trusted and loved by many individuals. Explore what everyone is buying.
          </p>

            <ProductGrid products={mostOrderedData?.mostOrdered} isLoading={mostOrderedIsLoading}  />
         </div> 
         <div className="px-3 mt-11 mx-auto   " >
            {
              bestRatingStore && !bestRatingStoreIsLoading && (
                <>
                <h2 className=" text-2xl sm:text-3xl font-bold text-center my-2">Top-Rated Stores</h2>
                <p className="text-sm px-3 sm:text-xl text-center mb-10 ">
                  Discover our highest-rated vendors trusted by thousands of satisfied customers.
                </p>
                <StoreGrid stores={bestRatingStore?.stores}  isLoading={bestRatingStoreIsLoading} />

                </>
              )
            }

          </div>
          <div className="mx-auto max-w-6xl mt-[-30px] ">
            <BestProduct />
        
          </div>

            
          <div className="  bg-gray-50" >
          <FeaturesSection/>
          
          <FeaturedCollection />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
