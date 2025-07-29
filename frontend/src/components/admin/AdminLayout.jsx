import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slice/adminSlice.js";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const isAdminSidebarOpen = useSelector(
    (state) => state.adminSidebar.isAdminSidebarOpen
  );

  const toggleSideBar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      <div className="  md:pr-[20px]  z-900 mx-auto max-w-[1400px] min-h-full flex flex-col md:flex-row relative  ">
        {/* mobile toggle button */}
        <div className="flex fixed w-full md:hidden z-90 px-3 py-4  bg-gray-900 text-white   ">
          <button onClick={toggleSideBar} className="cursor-pointer ">
            <FaBars size={24} />
          </button>
          <h1 className="text-xl ml-4 font-medium "> Admin Dashboard </h1>
        </div>

        {/* Sidebar */}

        <div className=" ">
          <div
            className={`
          fixed top-0 left-0 z-900 bg-gray-900 text-white min-w-[270px] lg:min-w-[320px] h-full overflow-y-auto transform transition-transform duration-300
          ${isAdminSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static 
        `}
          >
            <AdminSidebar />
          </div>
        </div>

        {/*  overlay for mobile sidebar  */}

        {isAdminSidebarOpen && (
          <div
            onClick={toggleSideBar}
            className="fixed inset-0  bg-black opacity-60 z-40 md:hidden"
          />
        )}

        {/* main content */}
        <div className="flex-grow ml-3 md:ml-5 lg:ml-8 overflow-auto ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
