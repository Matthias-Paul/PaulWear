import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import VendorSidebar from "./VendorSidebar";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slice/vendorSlice";

const VendorLayout = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

  const toggleSideBar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      <div className="  md:pr-[50px] mx-auto max-w-[1400px] min-h-full flex flex-col md:flex-row relative  ">
        {/* mobile toggle button */}
        <div className="flex fixed w-full md:hidden z-50 px-3 py-4  bg-gray-900 text-white z-50   ">
          <button onClick={toggleSideBar} className="cursor-pointer ">
            <FaBars size={24} />
          </button>
          <h1 className="text-xl ml-4 font-medium "> Vendor Dashboard </h1>
        </div>

        {/* Sidebar */}
        <div
          className={`
          fixed top-0 left-0 z-900 bg-gray-900 text-white min-w-[270px] lg:min-w-[320px] min-h-full overflow-y-auto transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static 
        `}
        >
          <VendorSidebar />
        </div>

        {/*  overlay for mobile sidebar  */}

        {isSidebarOpen && (
          <div
            onClick={toggleSideBar}
            className="fixed inset-0 bg-black opacity-60 z-40 md:hidden"
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

export default VendorLayout;
