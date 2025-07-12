import { Link, NavLink, useNavigate } from "react-router-dom"
import { FaUser, FaBoxOpen, FaClipboardList, FaStore, FaSignOutAlt } from "react-icons/fa"
import { MdOutlinePayment } from "react-icons/md";
import { logOutSuccess } from "../../redux/slice/userSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../../redux/slice/vendorSlice";
import { MdDashboard } from "react-icons/md";
import toast from "react-hot-toast"



const VendorSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();


    const handleLogout = async()=>{

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || "Failed to log out");
            }
      
            dispatch(logOutSuccess());
            toast.success("Log out successful!");
      
          } catch (error) {
            console.log(error.message);
            toast.error("Something went wrong!");
          }


    }

    const handleCloseSideBar = ()=>{
      dispatch(closeSidebar())
    }

  return (
    <>
      <div className="min-h-screen w-full px-[12px] pt-4 pb-9 " >
            <div className="mb-6 " >
                <Link onClick={handleCloseSideBar} to="/" className="font-medium text-2xl  " >
                    StyleNest
                </Link>
            </div>
            <h2 className="text-xl font-semibold text-center w-full mb-9  " >  Vendor Dashboard </h2>

            <nav className="flex flex-col gap-y-6 " >
               <NavLink onClick={handleCloseSideBar} to="/vendor" end className={ ({isActive }) => isActive? "border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <MdDashboard />
                    <span className="font-semibold text-md " > Dashboard </span>
                </NavLink>

                 <NavLink onClick={handleCloseSideBar} to="/vendor/payout" className={ ({isActive }) => isActive? "border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <MdOutlinePayment />
                    <span className="font-semibold text-md " > Payouts </span>
                </NavLink>


                <NavLink onClick={handleCloseSideBar} to="/vendor/orders" className={ ({isActive }) => isActive? "border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <FaClipboardList />
                    <span className="font-semibold text-md " > Orders </span>
                </NavLink>

                <NavLink onClick={handleCloseSideBar} to="/vendor/products" className={ ({isActive }) => isActive? " border border-gray-400 bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <FaBoxOpen />
                    <span className="font-semibold text-md " > Products </span>
                </NavLink>

                <NavLink onClick={handleCloseSideBar} to="/vendor/profile" className={ ({isActive }) => isActive? " border border-gray-400 bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <FaUser />
                    <span className="font-semibold text-md " > Profile </span>
                </NavLink>
            
                <NavLink  to="/collections/all" className={ ({isActive }) => isActive? "bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 border border-gray-400 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <FaStore />
                    <span className="font-semibold text-md " > Shop </span>
                </NavLink>

            </nav>   
            <div className="mt-9" >  
                <button onClick={handleLogout} className="rounded hover:bg-red-600 w-full font-semibold text-lg bg-red-700 flex gap-x-2 items-center justify-center  cursor-pointer py-3 text-center " >
                    <FaSignOutAlt />
                    Logout
                </button>
             </div>     
      </div>  
    </>
  )
}

export default VendorSidebar
