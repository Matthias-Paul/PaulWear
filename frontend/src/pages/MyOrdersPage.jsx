import pic from "../assets/pic.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { setMyOrders } from "../redux/slice/userSlice.js";
import { useSelector, useDispatch } from "react-redux";


const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { myOrders } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchOrders = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders?page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch orders");

    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

   
  console.log(hasNextPage)
  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const orders = data?.pages.flatMap((page) => page.orders) || [];

    console.log(orders)
    
  if (isLoading) {
    return <div className="mx-auto text-lg md:text-2xl md:font-semibold pt-[140px] md:pt-[100px] px-[12px] pb-10 w-full" >Loading your orders...</div>;
  }
  
  if (isError) {
    return <div className="mx-auto text-lg md:text-2xl md:font-semibold pt-[120px] md:pt-[140px] px-[12px] pb-10 w-full">Failed to load orders, check your internet connection </div>;
  }

return (
  <div className="mx-auto pt-[90px] px-[12px] pb-10 w-full">
    <h1 className="text-xl md:text-2xl font-bold my-6">My Orders</h1>

    { orders?.length === 0 ? (
      <div className="text-gray-500 text-xl px-4 text-center">
        You have no orders yet!
      </div>
    ) : (
      <>
        {/* Orders Table */}
        <div className="shadow-md overflow-x-auto relative rounded-sm lg:rounded-md">
          <table className="w-full text-left min-w-[1100px] md:min-w-full text-gray-500">
            <thead className="uppercase bg-gray-100 text-xs text-gray-600">
              <tr>
                <th className=" px-4 py-3">order</th>
                <th className=" px-4 py-3">Vendor</th>
                <th className=" px-4 py-3">Items</th>
                <th className=" px-4 py-3">Total</th>
                <th className=" px-4 py-3"> Status</th>
                <th className=" px-4 py-3">Address </th>
                <th className=" px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <tr
                  key={order?._id}
                  onClick={() => handleRowClick(order?._id)}
                  className={`border-b text-[15px] md:text-[17px] cursor-pointer hover:border-gray-400 ${
                    index === orders?.length - 1 ? "border-b-0 mb-3" : ""
                  }`}
                >
                  <td className="font-medium text-gray-800 px-4">
                  #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className=" py-4 px-4 font-medium text-gray-800">
                  {order.vendor?.storeName || "Vendor"}
                  </td>
                  <td className="py-4 px-4">
                  {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                    
                  </td>
                  <td className="  py-4 px-4">
                  ₦{order.totalPrice.toLocaleString()}

                  </td>
                  <td className=" py-4 px-4">
                  <span
                    className={`px-4 py-1 rounded text-md font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {order.status}
                    </span>
                    </td>
                  <td className=" py-4 px-4">
                    {order?.shippingAddress
                      ? `${order?.shippingAddress}`
                      : "N/A"}                  
                    </td>
                  <td className=" py-4 px-4">
                   
                  {new Date(order.createdAt).toLocaleDateString()}{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
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
      </>
    )}
  </div>
);

};

export default MyOrdersPage;
