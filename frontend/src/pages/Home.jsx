import pic from "../assets/pic.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import Hero from "../components/layout/Hero";
import FeaturedCollection from "../components/products/FeaturedCollection";
import FeaturesSection from "../components/products/FeaturesSection";
import NewArrival from "../components/products/NewArrival";
import ProductGrid from "../components/products/ProductGrid";
import CategoryGrid from "../components/products/CategoryGrid";
import BestProduct from "../components/products/BestProduct";



const Home = () => {
  const [bestProduct, setBestProduct] = useState(null);

  return (
    <>
      <div className="  h-full   text-black  ">
        <Hero />
        <div className="container  max-w-[1400px] mx-auto  ">

          <div className="mx-auto bg-gray-50 pt-7  max-w-[1400px] w-full container">
            <h2 className="text-2xl sm:text-3xl font-bold text-center my-4 ">
              Shop By Category
            </h2>
            <h3 className="  text-lg sm:text-xl text-center my-2 " > Explore a wide range of categories  from fashion to food, beauty, and more. </h3>
            <CategoryGrid  />
          </div>
          <NewArrival />
          <div className="mx-auto max-w-6xl ">
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
