import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";

import { FaHome } from 'react-icons/fa'
import { FaStore, FaShoppingBag } from 'react-icons/fa'
import { FaStoreAlt } from 'react-icons/fa'

import SearchBar from "./SearchBar";
import { BsCart } from "react-icons/bs";
import CartDrawer from "../layout/CartDrawer";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { loginUser, cartQuantity } = useSelector((state) => state.user);
  const editRef = useRef(false);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const handleClickOutside = (event) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      setNavDrawerOpen(false);
    }
  };

  // Attach event listener for outside clicks
  useEffect(() => {
    if (navDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navDrawerOpen]);

  return (
    <>
      <nav className=" w-full  bg-white  text-black  ">
        <div className="container px-[12px] border-b-[0.5px] border-gray-400  py-[10px] flex justify-between items-center max-w-[1400px] mx-auto  ">
          <Link to="/">
            {" "}
            <div className=" text-xl sm:text-2xl font-medium ">
              StyleNest
            </div>{" "}
          </Link>

          <div className="hidden md:flex items-center font-medium text-sm uppercase gap-x-5  ">
            <Link to="/" className=" text-gray-700 hover:text-black ">
              Home{" "}
            </Link>
            <Link
              to="/collections/all"
              className=" text-gray-700 hover:text-black "
            >
              Shop{""}
            </Link>
            <Link to="/stores" className=" text-gray-700 hover:text-black ">
              Stores{" "}
            </Link>

            {/* <Link to="" className=" text-gray-700 hover:text-black ">
              About{" "}
            </Link> */}
          </div>

          <div className="flex items-center gap-x-3 sm:gap-x-5  ">
            {loginUser?.role === "admin" ? (
              <Link
                to="/admin"
                className=" bg-black text-sm py-1 rounded px-2 cursor-pointer text-white "
              >
                Admin
              </Link>
            ) : (
              ""
            )}
            {loginUser?.role === "vendor" ? (
              <Link
                to="/vendor"
                className=" bg-black text-sm py-1 rounded px-2 cursor-pointer text-white "
              >
                Vendor
              </Link>
            ) : (
              ""
            )}

            {loginUser ? (
              <Link to="/profile" className=" hover:text-black ">
                <HiOutlineUser className="w-5 h-5 text-gray-700 " />
              </Link>
            ) : (
              <Link
                to="/register"
                className=" bg-black text-sm py-1 rounded px-2 cursor-pointer text-white "
              >
                Sign Up
              </Link>
            )}

            <button
              onClick={toggleCartDrawer}
              className=" relative hover:text-black cursor-pointer "
            >
              <BsCart className="w-5  h-5 text-gray-700 inline " />

              {cartQuantity && (
                <span className=" absolute text-[8px] bg-[#ea2e0e] font-[700] -right-1.5 text-white rounded-full px-1.5 py-0.5 ">
                  {" "}
                  {cartQuantity}{" "}
                </span>
              )}
            </button>

            {/* Search component */}
            <SearchBar />

            <button
              onClick={toggleNavDrawer}
              className=" flex cursor-pointer md:hidden "
            >
              <HiBars3BottomRight className=" w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer
        setDrawerOpen={setDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
        drawerOpen={drawerOpen}
      />

      {/* Mobile navigation */}
      <div ref={editRef}>
        <div
          className={` fixed right-0  top-10 ${
            navDrawerOpen ? "translate-x-0" : "translate-x-full"
          } w-full  md:hidden shadow-lg border-b border-gray-300 flex flex-col transform transition-transform duration-300 h-[50%] bg-white `}
        >
           <div className={`flex pl-2 items-center mt-3 mb-1 justify-between `}>
               

                <div >
                  {!loginUser && (
                    <>
                      <Link
                        onClick={toggleNavDrawer}
                        to="/register"
                        className=" bg-black mr-2  text-sm py-1 rounded px-2 cursor-pointer text-white "
                      >
                        Sign Up
                      </Link>
                      <Link
                        onClick={toggleNavDrawer}
                        to="/login"
                        className=" bg-black text-sm py-1 rounded px-2 cursor-pointer text-white "
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
                 <button onClick={toggleNavDrawer} className="z-100 static">
              {" "}
              <IoMdClose className="w-6 cursor-pointer   h-6 text-red-600 mr-2   " />{" "}
            </button>
              </div>

           
          <div className="p-2 mt-3 text-lg ">
            <nav> 
              <div className={`${loginUser ? "mt-[-51px] ":""} font-semibold mb-4  text-xl `} >
                  Menu{" "}
              </div>
              <Link
                onClick={toggleNavDrawer}
                to="/"
                className=" mb-4 text-start flex items-center gap-x-1 block text-gray-600 hover:text-black  "
              >
                {" "}
                <FaHome />
                Home{" "}
              </Link>
              <Link
                onClick={toggleNavDrawer}
                to="/collections/all"
                className="mb-4 text-start flex items-center gap-x-1 block text-gray-600 hover:text-black  "
              >
                <FaShoppingBag />{" "}
                Shop{" "}
              </Link>
              <Link
                onClick={toggleNavDrawer}
                to="/stores"
                className=" text-start mb-4 flex items-center gap-x-1 block text-gray-600 hover:text-black  "
              >
                <FaStore />{" "}
                Stores
              </Link>
              {/* <Link onClick={toggleNavDrawer} to=" " className=" mb-4 text-start block text-gray-600 hover:text-black  "  > About </Link> */}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
