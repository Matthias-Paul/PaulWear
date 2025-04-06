import pic from "../assets/pic.jpg";
import Hero from "../components/layout/Hero";
import FeaturedCollection from "../components/products/FeaturedCollection";
import GenderCollectionSection from "../components/products/GenderCollectionSection";
import NewArrival from "../components/products/NewArrival";
import ProductGrid from "../components/products/ProductGrid";
import ProductsDetails from "../components/products/ProductsDetails";

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
  return (
    <>
      <div className="  h-full   text-black  ">
        <Hero />
        <div className="container px-[12px]  pt-[90px]  pb-[50px] max-w-[1400px] mx-auto  ">
          <GenderCollectionSection />
          <NewArrival />
          <div className="mx-auto max-w-6xl ">
            <h2 className="  text-2xl sm:text-3xl font-bold text-center my-4 ">
              {" "}
              Best seller{" "}
            </h2>
            <ProductsDetails />
        
          </div>
          <div className="mx-auto max-w-[1400px] w-full container">
            <h2 className="  text-2xl sm:text-3xl font-bold text-center my-4 ">
              Top Wears For Women
            </h2>
            <ProductGrid products={placeholderProducts} />
          </div>
          <FeaturedCollection />

        </div>
      </div>
    </>
  );
};

export default Home;
