import { IoMdClose } from "react-icons/io" 
import CartContents from "../cart/CartContents"
const CartDrawer = ({drawerOpen, toggleCartDrawer }) => {
  

  return (
    <>
      <div
        className={` fixed right-0  top-10 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        } w-[300px] sm:w-[350px] xl:w-1/4 shadow-lg flex flex-col transform transition-transform duration-300  h-full bg-white `}
      >
        <div className="flex justify-end ">
          <button onClick={toggleCartDrawer}>
            {" "}
            <IoMdClose className="w-6 cursor-pointer text-red-600 h-6 mt-3 mr-3  " />{" "}
          </button>
        </div>

            <div className="flex-grow p-4 overflow-y-auto  " >
                <h2 className="text-xl font-medium mb-4 " > Your Cart </h2>
               {/* cart contents */}
               < CartContents />

                <div className="absolute   bottom-8 p-4 bg-white "> 
                    <button className="w-full transition hover:bg-gray-800 text-white py-2 bg-black cursor-pointer rounded-md font-semibold  "> Checkout </button>
                    <div className="text-sm tracking-tighter text-center mt-2 text-gray-500  " > Shipping, taxes, with discount codes calculated at checkout. </div>
                </div>
             </div>   
               
      </div>
    </>
  );
}

export default CartDrawer;
