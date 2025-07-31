import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import {
  FaUserCircle,
  FaUserShield,
  FaStore,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { FaHome } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaStoreAlt } from "react-icons/fa";

import SearchBar from "./SearchBar";
import { BsCart } from "react-icons/bs";
import CartDrawer from "../layout/CartDrawer";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { logOutSuccess } from "../../redux/slice/userSlice.js";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { loginUser, cartQuantity } = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const editRef = useRef(false);
  const profileRef = useRef(false);

  const toggle = () => {
    setVisible(!visible);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const handleClickOutside = (event) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      setNavDrawerOpen(false);
    }
  };

  const handleClickOutsideProfile = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleClickOutsideProfile);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    };
  }, [visible]);
  // Attach event listener for outside clicks
  useEffect(() => {
    if (navDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navDrawerOpen]);

  const handleLogOut = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to log out");
      }

      dispatch(logOutSuccess());
      setVisible(false);

      toast.success("Log out successful!");
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <nav className=" w-full  bg-white  text-black  ">
        <div className="container px-[12px] border-b-[0.5px] border-gray-400  py-[10px] flex justify-between items-center max-w-[1400px] mx-auto  ">
          <Link to="/">
            {" "}
            <div className=" text-xl sm:text-2xl font-medium ">
              StyleNest
            </div>{" "}
          </Link>

          <div className="hidden md:flex items-center font-medium text-sm uppercase gap-x-5  ">
            <Link to="/" className=" text-gray-700 hover:text-black ">
              Home{" "}
            </Link>
            <Link
              to="/collections/all"
              className=" text-gray-700 hover:text-black "
            >
              Shop{""}
            </Link>
            <Link to="/stores" className=" text-gray-700 hover:text-black ">
              Stores{" "}
            </Link>

            {/* <Link to="" className=" text-gray-700 hover:text-black ">
              About{" "}
            </Link> */}
          </div>

          <div className="flex items-center gap-x-3 sm:gap-x-5  ">
            {visible && loginUser && (
              <div
                ref={profileRef}
                className="absolute right-5 top-[85px] sm:top-[93px] bg-white z-50 shadow-lg rounded-lg w-56 py-4 px-4 text-gray-800"
              >
                <div className="text-sm text-gray-500 truncate max-w-full mb-4">
                  @{loginUser?.email || ""}
                </div>

                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setVisible(false)}
                      className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                    >
                      <FaUserCircle className="text-green-600" />
                      <span>Profile</span>
                    </Link>
                  </li>

                  {loginUser?.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        onClick={() => setVisible(false)}
                        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                      >
                        <FaUserShield className="text-green-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </li>
                  )}

                  {loginUser?.role === "vendor" && (
                    <li>
                      <Link
                        to="/vendor"
                        onClick={() => setVisible(false)}
                        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                      >
                        <FaStore className="text-green-600" />
                        <span>Vendor Dashboard</span>
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-2 cursor-pointer w-full hover:bg-gray-100 px-3 py-2 rounded-md transition text-left"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
            {loginUser ? (
              <div onClick={toggle} className=" hover:text-black ">
                {
                  <img
                    className="w-6 h-6 rounded-full flex-shrink-0 object-cover cursor-pointer "
                    src={
                      loginUser?.profileImage ||
                      "https://res.cloudinary.com/drkxtuaeg/image/upload/v1735897100/Image_4_jb0cpq.png"
                    }
                    alt="profile image"
                  />
                }
              </div>
            ) : (
              <Link
                to="/login"
                className=" bg-black text-sm py-1 rounded px-2 cursor-pointer text-white "
              >
                Sign In
              </Link>
            )}
            <button
              onClick={toggleCartDrawer}
              className=" relative hover:text-black cursor-pointer "
            >
              <BsCart className="w-5  h-5 text-gray-700 inline " />

              {cartQuantity && (
                <span className=" absolute text-[8px] bg-[#ea2e0e] font-[700] -right-1.5 text-white rounded-full px-1.5 py-0.5 ">
                  {" "}
                  {cartQuantity}{" "}
                </span>
              )}
            </button>
            {/* Search component */}
            <SearchBar />
            <button
              onClick={toggleNavDrawer}
              className=" flex cursor-pointer md:hidden "
            >
              <HiBars3BottomRight className=" w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer
        setDrawerOpen={setDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
        drawerOpen={drawerOpen}
      />

      {/* Mobile navigation */}
      <div ref={editRef}>
        <div
          className={` fixed right-0  top-10 ${
            navDrawerOpen ? "translate-x-0" : "translate-x-full"
          } w-full  md:hidden shadow-lg border-b border-gray-300 flex flex-col transform transition-transform duration-300 h-[50%] bg-white `}
        >
          <div className={`flex pl-2 items-center mt-3 mb-1 justify-between `}>
            <div>
              {!loginUser && (
                <>
                  <Link
                    onClick={toggleNavDrawer}
                    to="/register"
                    className=" bg-black mr-2  text-sm py-1 rounded px-2 cursor-pointer text-white "
                  >
                    Sign Up
                  </Link>
                  <Link
                    onClick={toggleNavDrawer}
                    to="/login"
                    className=" bg-black text-sm py-1 rounded px-2 cursor-pointer text-white "
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <button onClick={toggleNavDrawer} className="z-100 static">
              {" "}
              <IoMdClose className="w-6 cursor-pointer   h-6 text-red-600 mr-2   " />{" "}
            </button>
          </div>

          <div className="p-2 mt-3 text-lg ">
            <nav>
              <div
                className={`${
                  loginUser ? "mt-[-51px] " : ""
                } font-semibold mb-4  text-xl `}
              >
                Menu{" "}
              </div>
              <Link
                onClick={toggleNavDrawer}
                to="/"
                className=" mb-4 text-start flex items-center gap-x-1 block text-gray-600 hover:text-black  "
              >
                {" "}
                <FaHome />
                Home{" "}
              </Link>
              <Link
                onClick={toggleNavDrawer}
                to="/collections/all"
                className="mb-4 text-start flex items-center gap-x-1 block text-gray-600 hover:text-black  "
              >
                <FaShoppingBag /> Shop{" "}
              </Link>
              <Link
                onClick={toggleNavDrawer}
                to="/stores"
                className=" text-start mb-4 flex items-center gap-x-1 block text-gray-600 hover:text-black  "
              >
                <FaStore /> Stores
              </Link>
              {/* <Link onClick={toggleNavDrawer} to=" " className=" mb-4 text-start block text-gray-600 hover:text-black  "  > About </Link> */}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
