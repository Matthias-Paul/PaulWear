import {  Link } from "react-router-dom"
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2"
import SearchBar from "./SearchBar"
import CartDrawer from "../layout/CartDrawer"
import { useState } from "react"
import { IoMdClose } from "react-icons/io" 


const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

    const toggleCartDrawer = () => {
        
      setDrawerOpen(!drawerOpen)
      
    }
    const toggleNavDrawer = () => {
        
      setNavDrawerOpen(!navDrawerOpen)
      
    }



  return (
    <>
      <nav className=" w-full  bg-white  text-black  ">
        <div className="container px-[12px]  py-[10px] flex justify-between items-center max-w-[1400px] mx-auto  ">
          <div className="text-2xl font-medium ">StyleNest</div>

          <div className="hidden md:flex items-center font-medium text-sm uppercase gap-x-5  ">
            <Link to="" className=" text-gray-700 hover:text-black ">
              Men{" "}
            </Link>
            <Link to="" className=" text-gray-700 hover:text-black ">
              Women{" "}
            </Link>
            <Link to="" className=" text-gray-700 hover:text-black ">
              Top wear{" "}
            </Link>

            <Link to="" className=" text-gray-700 hover:text-black ">
              Bottom wear{" "}
            </Link>
          </div>

             <div className="flex items-center gap-x-5  " >
                    <Link to="/profile" className=" hover:text-black " >
                            <HiOutlineUser className="w-5 h-5 text-gray-700 "  />
                    </Link>
                    <button onClick={toggleCartDrawer}  className=" relative hover:text-black cursor-pointer ">
                        <HiOutlineShoppingBag className="w-5  h-5 text-gray-700 inline "  />
                        <span className=" absolute text-[8px] bg-[#ea2e0e] font-[700] -right-1 text-white rounded-full px-1.5 py-0.5 " >  2   </span>
                    </button>

                    {/* Search component */}
                     < SearchBar />
                      
                    <button onClick={toggleNavDrawer}  className=" flex cursor-pointer md:hidden ">
                        < HiBars3BottomRight className=" w-5 h-5 text-gray-700" />

            </button>       
              </div>       
        </div>
      </nav>
        <CartDrawer toggleCartDrawer={toggleCartDrawer} drawerOpen={drawerOpen} />

      {/* Mobile navigation */}
      
        <div  className={` fixed right-0  top-10 ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        } w-[300px] sm:w-[350px] xl:w-1/4 shadow-lg flex flex-col transform transition-transform duration-300  h-full bg-white `}
      >
         <div className="flex justify-end ">
          <button onClick={toggleNavDrawer}>
            {" "}
            <IoMdClose className="w-6 cursor-pointer h-6 text-red-600 mt-3 mr-3  " />{" "}
          </button>
        </div>
          <div className="p-2 ">
            <nav>
              <h1  className="font-semibold mb-4 text-start text-xl " >Menu </h1>
              
              <Link onClick={toggleNavDrawer} to=" " className=" mb-4 text-start block text-gray-600 hover:text-black  "  > Men </Link>
              <Link onClick={toggleNavDrawer} to=" " className="mb-4 text-start block text-gray-600 hover:text-black  "  > Women </Link>
              <Link onClick={toggleNavDrawer} to=" " className=" text-start mb-4 block text-gray-600 hover:text-black  "  > Top Wear </Link>
              <Link onClick={toggleNavDrawer} to=" " className=" mb-4 text-start block text-gray-600 hover:text-black  "  > Bottom Wear </Link>

            </nav>  

          </div>  
        </div>  
    </>
  );
};

export default NavBar;

