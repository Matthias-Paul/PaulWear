import { useState, useEffect, useRef } from "react";
import pic from "../assets/pic.jpg";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/products/FilterSidebar";
import SortOptions from "../components/products/SortOptions";
import ProductGrid from "../components/products/ProductGrid";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    // add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // close event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = [
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

    setProducts(fetchProducts);
  }, []);

  return (
    <>
      <div className="container px-[12px] flex flex-col lg:flex-row  pt-[90px]  pb-[50px] max-w-[1400px] mx-auto  ">
        {/* mobile button */}
        <button
          ref={toggleButtonRef}
          onClick={toggleSidebar}
          className="flex border rounded-sm border-gray-300 mb-2 cursor-pointer justify-center items-center lg:hidden p-2 "
        >
          <FaFilter className="w-6 h-4" /> Filters
        </button>
        {/* filter sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed  left-0 top-[90px] w-70 z-50 inset-y-0 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0  ${
            isSidebarOpen ? " pl-[12px] translate-x-0" : "-translate-x-full"
          }`}
        >
          <FilterSidebar />
        </div>
        <div className="flex-grow pl-4   lg:w-2/3">
          <h1 className="   text-lg xl:text-2xl text-center mt-2 uppercase mb-4">
            {" "}
            All Collections{" "}
          </h1>
          {/* sort options */}
          <SortOptions />
          {/* product grid */}
          <ProductGrid products={products} />
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
