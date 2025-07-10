import { useState } from "react"
import { Outlet } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)

    const toggleSideBar = ()=>{
        setIsSideBarOpen(!isSideBarOpen)

    }

  return (
    <>
      <div className="  md:pr-[50px] mx-auto max-w-[1400px] min-h-full flex flex-col md:flex-row relative  ">
        {/* mobile toggle button */}
        <div  className="flex fixed w-full md:hidden z-50 px-3 py-4  bg-gray-900 text-white z-50   " >
            <button onClick={toggleSideBar} className="cursor-pointer " >
                <FaBars size={24} />
            </button>
            <h1 className="text-xl ml-4 font-medium " > Admin Dashboard </h1>
        </div>  


     {/* Sidebar */}
        <div
          className={`
            fixed md:static top-0 left-0 z-50
            w-[270px] lg:w-[350px] bg-gray-900 text-white min-h-full
            transform transition-transform duration-300
            ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:flex
          `}
        >
          <AdminSidebar />
        </div>
        
          {/*  overlay for mobile sidebar  */}

          {isSideBarOpen && (
          <div
            onClick={toggleSideBar}
            className="fixed inset-0 bg-black opacity-60 z-40 md:hidden"
          />
        )}

                {/* main content */}
        <div className="flex-grow ml-[12px] md:ml-[50px] overflow-auto " >
            <Outlet />
        </div>    
      </div>  
    </>
  )
}

export default AdminLayout


