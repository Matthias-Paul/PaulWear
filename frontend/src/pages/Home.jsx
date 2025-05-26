import pic from "../assets/pic.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import Hero from "../components/layout/Hero";
import FeaturedCollection from "../components/products/FeaturedCollection";
import FeaturesSection from "../components/products/FeaturesSection";
import GenderCollectionSection from "../components/products/GenderCollectionSection";
import NewArrival from "../components/products/NewArrival";
import ProductGrid from "../components/products/ProductGrid";
import CategoryGrid from "../components/products/CategoryGrid";
import BestProduct from "../components/products/BestProduct";

const placeholderProducts = [
  {
    _id: 1,
    name: "cloth 1",
    price: 100,
    image: pic,
  },
  {
    _id: 2,
    name: "cloth 2",
    price: 100,
    image: pic,
  },
  {
    _id: 3,
    name: "cloth 3",
    price: 100,
    image: pic,
  },
  {
    _id: 4,
    name: "cloth 4",
    price: 100,
    image: pic,
  },
  {
    _id: 5,
    name: "cloth 5",
    price: 100,
    image: pic,
  },
  {
    _id: 6,
    name: "cloth 6",
    price: 100,
    image: pic,
  },
  {
    _id: 7,
    name: "cloth 7",
    price: 100,
    image: pic,
  },
  {
    _id: 8,
    name: "cloth 8",
    price: 100,
    image: pic,
  },
];
 

const Home = () => {
  const [bestProduct, setBestProduct] = useState(null);

  return (
    <>
      <div className="  h-full   text-black  ">
        <Hero />
        <div className="container pt-[30px]  pb-[50px] max-w-[1400px] mx-auto  ">

          <div className="mx-auto max-w-[1400px] w-full container">
            <h2 className="  text-2xl sm:text-3xl font-bold text-center my-4 ">
              Shop By Category
            </h2>
            <h3 className="  text-lg sm:text-xl text-center my-2 " > Explore a wide range of categories  from fashion to food, beauty, and more. </h3>
            <CategoryGrid  />
          </div>
          <NewArrival />
          <div className="mx-auto max-w-6xl ">
            <h2 className="  text-2xl sm:text-3xl font-bold text-center mt-4 mb-[-90px] ">
              {" "}
              Best Product{" "}
            </h2>
            <BestProduct />
        
          </div>
          
          <FeaturedCollection />
          <FeaturesSection/>
        </div>
      </div>
    </>
  );
};

export default Home;
