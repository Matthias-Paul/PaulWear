import { IoMdClose } from "react-icons/io" 
import CartContents from "../cart/CartContents"
import { useNavigate } from "react-router-dom"
import {useEffect, useRef, useState } from "react"

const CartDrawer = ({drawerOpen, setDrawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate()
    const editRef = useRef(false)


const handleClickOutside = (event) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      setDrawerOpen(false);
    }
  };    

  // Attach event listener for outside clicks
  useEffect(() => {
    if (drawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerOpen]);


  

  return (
    <>
    <div  className={`relative max-w-[1400px]    ${drawerOpen ? "h-screen": "" }  mx-auto`} > 
      <div
      ref={editRef}
          className={`absolute right-0 bottom-0 h-full  w-full sm:w-[400px] xl:w-[500px] shadow-lg flex flex-col h-full bg-white transition-all duration-300 ease-in-out
            ${drawerOpen ? "opacity-100 scale-100 bg-white pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
          `}
        >
        
            <div className=" p-4  h-screen pb-20 bg-white overflow-y-auto  " >
              <div className="flex justify-between  ">
              <h2 className="text-xl font-medium  " > Your Cart </h2>

              <button onClick={toggleCartDrawer}>
                <IoMdClose className="w-6 cursor-pointer text-red-600 h-6 " />
              </button>

            </div>
               {/* cart contents */}
               < CartContents toggleCartDrawer={toggleCartDrawer} />

             </div>   
               
      </div>
      </div>
    </>
  );
}

export default CartDrawer;
