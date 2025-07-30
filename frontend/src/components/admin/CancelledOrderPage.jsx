import AdminSearchBar from "./AdminSearchBar";
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CancelledOrderPage = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const fetchDeletedOrders = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/deletedOrders?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch deleted orders ");

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
    queryKey: ["orders", searchParams.toString()],
    queryFn: fetchDeletedOrders,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const orders = data?.pages.flatMap((page) => page.deletedOrders) || [];

  const handleRowClick = (orderID) => {
    navigate(`/admin/cancelledOrders/${orderID}`);
  };

  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className=" text-lg sm:text-2xl lg:text-3xl font-bold mb-6 mt-3  ">
          {" "}
          Cancelled Order Management{" "}
        </h1>
        {/* search bar component */}
        <AdminSearchBar />

        <div className="mt-15 mb-20 ">
          <h2 className="mb-6 font-bold text-lg sm:text-2xl ">
            {" "}
            Cancelled Orders{" "}
          </h2>
          {isLoading && (
            <div className="mx-auto text-lg md:text-xl  text-gray-400 px-[12px] pb-10 w-full">
              Loading orders ...
            </div>
          )}

          {isError && (
            <div className="mx-auto text-lg md:text-xl  px-[12px] pb-10 w-full">
              {" "}
              Failed to load vendors account, check your internet connection{" "}
            </div>
          )}
          {orders?.length > 0 ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1500px]   text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N</th>
                    <th className="py-3 px-4  "> Reason </th>
                    <th className="py-3 px-4  "> Vendor ID</th>
                    <th className="py-3 px-4  "> User ID </th>
                    <th className="py-3 px-4  "> Reference </th>
                    <th className="py-3 px-4  "> Buyer Name </th>
                    <th className="py-3 px-4  "> Store Name </th>
                    <th className="py-3 px-4  "> Total Price </th>
                    <th className="py-3 px-4  "> Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order, index) => (
                    <tr
                      key={order?._id}
                      onClick={() => handleRowClick(order?._id)}
                      className={`border-b cursor-pointer font-medium text-gray-800  hover:border-gray-400 ${
                        index === orders?.length - 1 ? "border-b-0" : ""
                      } `}
                    >
                      <td className="py-3 capitaalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        {order?.cancelReason}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {order?.vendor?._id}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {order?.user}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {order?.reference}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4 font-medium text-gray-800  ">
                        {order?.buyerName}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {order?.vendor?.storeName}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        ₦{order?.totalPrice?.toLocaleString()}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {new Date(order?.createdAt).toLocaleDateString()}{" "}
                        {new Date(order?.createdAt).toLocaleTimeString()}{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !isLoading &&
            !isError && (
              <div className="text-gray-700 font-semibold text-lg ">
                No canceled order Found.
              </div>
            )
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

export default CancelledOrderPage;
