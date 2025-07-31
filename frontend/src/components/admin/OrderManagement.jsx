import AdminSearchBar from "./AdminSearchBar";
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const OrderManagement = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const [filterBy, setFilterBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentFilter =
      searchParams.get("isDelivered") ||
      searchParams.get("isReceived") ||
      searchParams.get("isPayoutSuccess") ||
      searchParams.get("cancelRequested") ||
      "all";

    setFilterBy(currentFilter);
  }, [searchParams]);

  const handleFilterChange = (filterType) => {
    const params = new URLSearchParams();

    if (filterType !== "all") {
      params.set(filterType, "true");
    }

    navigate({ search: params.toString() });
  };

  const fetchOrders = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/orders?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch orders ");

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
    queryFn: fetchOrders,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const orders = data?.pages.flatMap((page) => page.orders) || [];

  const handleRowClick = (orderID) => {
    navigate(`/admin/orders/${orderID}`);
  };

  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 mt-3  ">
          {" "}
          Order Management{" "}
        </h1>
        {/* search bar component */}
        <AdminSearchBar />

        {/* Filter buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 mt-14 md:mt-16">
          <button
            onClick={() => handleFilterChange("all")}
            className={`font-bold border max-w-[12rem] sm:max-w-full border-gray-300 text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
       ${
         !searchParams.get("isDelivered") &&
         !searchParams.get("isReceived") &&
         !searchParams.get("cancelRequested") &&
         !searchParams.get("isPayoutSuccess")
           ? "bg-gray-900 text-gray-100"
           : "bg-gray-100 text-gray-900"
       }`}
          >
            All Orders
          </button>

          <button
            onClick={() => handleFilterChange("isDelivered")}
            className={`font-bold border max-w-[12rem] sm:max-w-full border-gray-300 text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
       ${
         searchParams.get("isDelivered") === "true"
           ? "bg-gray-900 text-gray-100"
           : "bg-gray-100 text-gray-900"
       }`}
          >
            Delivered Orders
          </button>

          <button
            onClick={() => handleFilterChange("isReceived")}
            className={`font-bold border max-w-[12rem] sm:max-w-full border-gray-300 text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
       ${
         searchParams.get("isReceived") === "true"
           ? "bg-gray-900 text-gray-100"
           : "bg-gray-100 text-gray-900"
       }`}
          >
            Received Orders
          </button>

          <button
            onClick={() => handleFilterChange("isPayoutSuccess")}
            className={`font-bold border max-w-[12rem] sm:max-w-full border-gray-300 text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
       ${
         searchParams.get("isPayoutSuccess") === "true"
           ? "bg-gray-900 text-gray-100"
           : "bg-gray-100 text-gray-900"
       }`}
          >
            Payout Success
          </button>

          <button
            onClick={() => handleFilterChange("cancelRequested")}
            className={`font-bold border max-w-[12rem] sm:max-w-full border-gray-300 text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
       ${
         searchParams.get("cancelRequested") === "true"
           ? "bg-gray-900 text-gray-100"
           : "bg-gray-100 text-gray-900"
       }`}
          >
            Cancellation Requests{" "}
          </button>
        </div>

        <div className="mt-8 mb-20 ">
          <h2 className="mb-6 font-bold text-xl sm:text-2xl "> Orders </h2>
          {isLoading && (
            <div className="mx-auto text-lg md:text-xl  text-gray-400 px-[12px] pb-10 w-full">
              Loading orders ...
            </div>
          )}

          {isError && (
            <div className="mx-auto text-lg md:text-xl  px-[12px] pb-10 w-full">
              {" "}
              Failed to load payout history, check your internet connection{" "}
            </div>
          )}
          {!isLoading && !isError && orders?.length > 0 ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1300px]   text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N</th>
                    <th className="py-3 px-4  "> Order ID</th>
                    <th className="py-3 px-4  "> Vendor ID</th>
                    <th className="py-3 px-4  "> User ID </th>
                    <th className="py-3 px-4  "> Reference </th>
                    <th className="py-3 px-4  "> Buyer Name </th>
                    <th className="py-3 px-4  "> Store Name </th>
                    <th className="py-3 px-4  "> Total Price </th>

                    <th className="py-3 px-4  "> Status </th>
                    <th className="py-3 px-4  "> Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading &&
                    !isError &&
                    orders?.map((order, index) => (
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

                        <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                          {order?._id}
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
                          {order?.totalPrice && (
                            <div> ₦{order?.totalPrice?.toLocaleString()}</div>
                          )}{" "}
                        </td>

                        <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                          <span
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              order?.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-200 text-red-700"
                            }`}
                          >
                            {order?.status}
                          </span>
                        </td>

                        <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                          {order?.createdAt && (
                            <div>
                              {new Date(order?.createdAt).toLocaleDateString()}{" "}
                              {new Date(order?.createdAt).toLocaleTimeString()}{" "}
                            </div>
                          )}
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
                No payout history Found.
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

export default OrderManagement;
