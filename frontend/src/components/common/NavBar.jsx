import {  Link } from "react-router-dom"
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2"
import SearchBar from "./SearchBar"

const NavBar = () => {

  return (
    <>
      <nav className=" w-full mt-[1px]  text-black  ">
        <div className="container px-[12px] py-[10px] flex justify-between items-center max-w-[1400px] mx-auto  ">
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
                    <button  className=" relative hover:text-black cursor-pointer ">
                        <HiOutlineShoppingBag className="w-5  h-5 text-gray-700 inline "  />
                        <span className=" absolute text-[8px] bg-[#ea2e0e] font-[700] -right-1 text-white rounded-full px-1.5 py-0.5 " >  2   </span>
                    </button>

                    {/* Search component */}
                     < SearchBar />
                      
                    <button  className=" flex cursor-pointer md:hidden ">
                        < HiBars3BottomRight className=" w-5 h-5 text-gray-700" />

            </button>       
              </div>       
        </div>
      </nav>
    </>
  );
};

export default NavBar;
