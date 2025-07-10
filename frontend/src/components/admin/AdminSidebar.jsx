import { Link, NavLink, useNavigate } from "react-router-dom"
import { FaUser, FaBoxOpen, FaClipboardList, FaStore, FaSignOutAlt } from "react-icons/fa"

const AdminSidebar = () => {
    const navigate = useNavigate()


    const handleLogout =()=>{



        navigate("/login")

    }

  return (
    <>
      <div className="min-h-screen w-full px-[12px] pt-4 pb-9 " >
            <div className="mb-6 " >
                <Link to="/admin" className="font-medium text-2xl  " >
                    StyleNest
                </Link>
            </div>
            <h2 className="text-xl font-semibold text-center w-full mb-9  " >  Admin Dashboard </h2>   

            <nav className="flex flex-col gap-y-6 " >
                <NavLink  to="/admin/users" className={ ({isActive }) => isActive? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <FaUser />
                    <span className="font-semibold text-md " > Users </span>
                </NavLink>

                <NavLink to="/admin/products" className={ ({isActive }) => isActive? " border border-gray-400 bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <FaBoxOpen />
                    <span className="font-semibold text-md " > Products </span>
                </NavLink>

                <NavLink to="/admin/orders" className={ ({isActive }) => isActive? "border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
                    <FaClipboardList />
                    <span className="font-semibold text-md " > Orders </span>
                </NavLink>

                <NavLink to="/" className={ ({isActive }) => isActive? "bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 border border-gray-400 ":  " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 " } >
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

export default AdminSidebar
