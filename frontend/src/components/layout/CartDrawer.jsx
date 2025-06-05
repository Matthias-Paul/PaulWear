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


  const handleCheckout= ()=>{
    

    navigate("/checkout")
    toggleCartDrawer()
  }

  return (
    <>
    <div  className={`relative max-w-[1400px]    ${drawerOpen ? "h-screen": "" }  mx-auto`} > 
      <div
      ref={editRef}
          className={`absolute right-0 bottom-0 h-full  w-[350px] sm:w-[400px] xl:w-[500px] shadow-lg flex flex-col h-full bg-white transition-all duration-300 ease-in-out
            ${drawerOpen ? "opacity-100 scale-100 bg-white pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
          `}
        >
        
            <div className=" p-4  h-screen pb-20 bg-white overflow-y-auto  " >
              <div className="flex justify-end ">
              <button onClick={toggleCartDrawer}>
                {" "}
                <IoMdClose className="w-6 cursor-pointer text-red-600 h-6 mt-3 mr-3  " />{" "}
              </button>
            </div>
                <h2 className="text-xl font-medium mb-4 " > Your Cart </h2>
               {/* cart contents */}
               < CartContents />

                <div className=" px-4 xl:w-[460px] text-center mx-auto  bottom-8 py-7 bg-white "> 
                    <button onClick={handleCheckout} className="w-full transition hover:bg-gray-800 text-white py-2 bg-black cursor-pointer rounded-md font-semibold  "> Checkout </button>
                    <div className="text-sm tracking-tighter text-center mt-2 text-gray-500  " > Shipping, taxes, with discount codes calculated at checkout. </div>
                </div>
             </div>   
               
      </div>
      </div>
    </>
  );
}

export default CartDrawer;
