import { useState } from "react"
import { Outlet } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import AdminSidebar from "./AdminSidebar"
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slice/adminSlice.js";


const AdminLayout = () => {
    const dispatch = useDispatch();
    const isAdminSidebarOpen = useSelector((state) => state.adminSidebar.isAdminSidebarOpen);

    const toggleSideBar = ()=>{
      dispatch(toggleSidebar());

    }

  return (
    <>
      <div className="  md:pr-[50px]  mx-auto max-w-[1400px] min-h-full flex flex-col md:flex-row relative  ">
        {/* mobile toggle button */}
        <div  className="flex fixed w-full md:hidden z-900 px-3 py-4  bg-gray-900 text-white   " >
            <button onClick={toggleSideBar} className="cursor-pointer " >
                <FaBars size={24} />
            </button>
            <h1 className="text-xl ml-4 font-medium " > Admin Dashboard </h1>
        </div>  


     {/* Sidebar */}
        <div
          className={`
            fixed md:static z-100 top-0 left-0
            min-w-[270px] lg:min-w-[350px] bg-gray-900 text-white min-h-full
            transform transition-transform duration-300
            ${isAdminSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:flex
          `}
        >
          <AdminSidebar />
        </div>
        
          {/*  overlay for mobile sidebar  */}

          {isAdminSidebarOpen && (
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


