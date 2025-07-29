import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useMutation,
  useQueryClient,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import VendorOrderChart from "../components/common/VendorOrderChart";
import {
  FaMoneyBillWave,
  FaPercent,
  FaClock,
  FaWallet,
  FaUsers,
  FaUserTie,
  FaShoppingCart,
  FaBoxOpen,
  FaExchangeAlt
} from "react-icons/fa";


const AdminHomePage = () => {
  const fetchActivities = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/recent-activity?page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch recent activity");

    return res.json();
  };

  const {
    data: recentActivities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isActivityDataLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["recentActivity"],
    queryFn: fetchActivities,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const activities =
    recentActivities?.pages.flatMap((page) => page.recentActivities) || [];

  const fetchStats = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch stats ");
    }
    return res.json();
  };

  const { data } = useQuery({
    queryKey: ["fetchStat"],
    queryFn: fetchStats,
  });

  const fetchChart = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/chart`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch chart ");
    }
    return res.json();
  };

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["fetchChart"],
    queryFn: fetchChart,
  });

  const stats = [
    {
      title: "Total Revenue",
      value: `₦${data?.stats?.totalRevenue?.toLocaleString() || "--"}`,
      icon: <FaMoneyBillWave className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: null,
    },
    {
      title: "Total Platform Fee",
      value: `₦${data?.stats?.totalPlatformFee?.toLocaleString() || "--"}`,
      icon: <FaPercent className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: null,
    },
    {
      title: "Total Pending Balance",
      value: `₦${data?.stats?.totalPendingBalance?.toLocaleString() || "--"}`,
      icon: <FaClock className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: null,
    },
    {
      title: "Total Payout",
      value: `₦${data?.stats?.totalPayout?.toLocaleString() || "--"}`,
      icon: <FaWallet className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: { path: "/admin/payouts", text: "Manage Payouts" },
    },
    {
      title: "Total Vendor (Approved)",
      value: data?.stats?.totalVendors?.toLocaleString() || "--",
      icon: <FaUserTie className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: { path: "/admin/vendors", text: "Manage Vendors" },
    },
    {
      title: "Total Users",
      value: data?.stats?.totalUsers?.toLocaleString() || "--",
      icon: <FaUsers className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: { path: "/admin/users", text: "Manage Users" },
    },
    {
      title: "Total Orders",
      value: data?.stats?.totalOrders?.toLocaleString() || "--",
      icon: <FaShoppingCart className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: { path: "/admin/orders", text: "Manage Orders" },
    },
    {
      title: "Total Products",
      value: data?.stats?.totalProducts?.toLocaleString() || "--",
      icon: <FaBoxOpen className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: { path: "/admin/products", text: "Manage Products" },
    },
     {
      title: "Total Number Of Transactions",
      value: data?.stats?.totalNoTransactions?.toLocaleString() || "--",
      icon: <FaExchangeAlt className="text-blue-500" size={18} />,
      bg: "bg-gray-100",
      link: { path: "/admin/transactions", text: "Manage Transactions" },
    },
  ];

  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 mt-3  ">
          {" "}
          Admin Dashboard{" "}
        </h1>
        <h4 className="text-lg mb-5 font-semibold text-gray-800">
          👋 Welcome back, Admin 
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mb-8">
          {stats?.map((stat, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 ${stat.bg}`}
            >
              <div className="flex justify-between items-start gap-x-2">
                <h2 className="text-md font-medium text-gray-600">
                  {stat?.title}
                </h2>
                {stat?.icon}
              </div>
              <p className="text-xl md:text-lg lg:text-xl font-bold text-gray-800 mt-2">
                {stat.value}
              </p>
              {stat?.link && (
                <Link
                  to={stat?.link?.path}
                  className="text-blue-600 text-sm hover:underline font-medium mt-1 inline-block"
                >
                  {stat?.link?.text}
                </Link>
              )}
            </div>
          ))}
        </div>

        <VendorOrderChart data={chartData?.chartStat} isLoading={isLoading} />
        <div className="mt-8 mb-20 ">
          <h2 className="mb-6 font-bold text-2xl "> Recent Activities </h2>

          {activities.length > 0 ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1300px]  text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N</th>
                    <th className="py-3 px-4  "> Time</th>
                    <th className="py-3 px-4  "> User </th>
                    <th className="py-3 px-4  "> Role </th>
                    <th className="py-3 px-4  "> Action </th>
                    <th className="py-3 px-4  "> Description </th>
                    <th className="py-3 px-4  "> Status </th>
                  </tr>
                </thead>
                <tbody>
                  {activities?.map((activity, index) => (
                    <tr
                      key={activity?._id}
                      className={`border-b cursor-pointer hover:border-gray-400 ${
                        index === activities?.length - 1 ? "bactivity-b-0" : ""
                      } `}
                    >
                      <td className="py-3 capitaalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {new Date(activity?.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </td>
                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {activity?.user?.name}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {activity?.userRole}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {activity?.actionType}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {activity?.description}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            activity.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-700 font-semibold text-lg ">
              No Recent Activity Found.
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center items-center">
              <button
                className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 my-9 text-white cursor-pointer"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading more..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminHomePage;
