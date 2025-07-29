import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBoxOpen,
  FaClipboardList,
  FaStore,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { logOutSuccess } from "../../redux/slice/userSlice.js";
import { useDispatch } from "react-redux";
import { MdDashboard } from "react-icons/md";
import toast from "react-hot-toast";
import { FaUserTie } from "react-icons/fa";
import { closeSidebar } from "../../redux/slice/adminSlice.js";
import { FaUniversity } from "react-icons/fa";
import { FaTimesCircle, FaExchangeAlt } from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseSideBar = () => {
    dispatch(closeSidebar());
  };
  const handleLogout = async () => {
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
      toast.success("Log out successful!");
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="min-h-full  w-full px-[12px] pt-4 pb-15 ">
        <div className="mb-6 ">
          <Link to="/" className="font-medium text-2xl  ">
            StyleNest
          </Link>
        </div>
        <h2 className="text-xl font-semibold  text-center mx-auto items-center justify-center w-full mb-9  ">
          {" "}
          Admin Dashboard{" "}
        </h2>

        <nav className="flex flex-col gap-y-6 ">
          <NavLink
            onClick={handleCloseSideBar}
            to="/admin"
            end
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <MdDashboard />
            <span className="font-semibold text-md "> Dashboard </span>
          </NavLink>

          <NavLink
            to="/admin/payouts"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <MdOutlinePayment />
            <span className="font-semibold text-md "> Payouts </span>
          </NavLink>

          <NavLink
            to="/admin/vendors"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaUserTie />
            <span className="font-semibold text-md "> Vendors </span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? "border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaClipboardList />
            <span className="font-semibold text-md "> Orders </span>
          </NavLink>

          <NavLink
            to="/admin/cancelledOrders"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaTimesCircle />
            <span className="font-semibold text-md "> Cancelled Orders </span>
          </NavLink>

          <NavLink
            to="/admin/accounts"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaUniversity />
            <span className="font-semibold text-md ">Vendors Account</span>
          </NavLink>

          <NavLink
            to="/admin/transactions"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaExchangeAlt />
            <span className="font-semibold text-md "> Transactions </span>
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400  bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaUser />
            <span className="font-semibold text-md "> Users </span>
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? " border border-gray-400 bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaBoxOpen />
            <span className="font-semibold text-md "> Products </span>
          </NavLink>

          <NavLink
            to="/collections/all"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2 border border-gray-400 "
                : " text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-x-2  border border-gray-400 "
            }
          >
            <FaStore />
            <span className="font-semibold text-md "> Shop </span>
          </NavLink>
        </nav>
        <div className="mt-9 ">
          <button
            onClick={handleLogout}
            className="rounded  hover:bg-red-600 w-full font-semibold text-lg bg-red-700 flex gap-x-2 items-center justify-center  cursor-pointer py-3 text-center "
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
