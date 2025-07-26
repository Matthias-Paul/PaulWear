import AdminSearchBar from "./AdminSearchBar";
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AdminPayout = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const [filterBy, setFilterBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentFilter = searchParams.get("filter");

    if (!currentFilter) {
      const params = new URLSearchParams(searchParams);
      params.set("filter", "all");
      navigate({ search: params.toString() }, { replace: true });
    } else {
      setFilterBy(currentFilter);
    }
  }, [searchParams, navigate]);

  const handleFilterChange = (type) => {
    const params = new URLSearchParams(searchParams);
    if (type) {
      params.set("filter", type);
    } else {
      params.delete("filter");
    }

    navigate({ search: params.toString() });
  };

  const fetchPayOutHistory = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/payout-history?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch payout history");

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
    queryKey: ["payOutHistory", searchParams.toString()],
    queryFn: fetchPayOutHistory,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const PayOutHistory = data?.pages.flatMap((page) => page.payoutHistory) || [];



  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 mt-3  ">
          {" "}
          Payout Management{" "}
        </h1>
        {/* search bar component */}
        <AdminSearchBar />

        {/* Filter buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 mt-14 md:mt-16 ">
          <button
            onClick={() => handleFilterChange("all")}
            className={`font-bold border max-w-[12rem] sm:max-w-full border-gray-300 text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "all"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            All Payouts{" "}
          </button>
          <button
            onClick={() => handleFilterChange("success")}
            className={`font-bold border border-gray-300  max-w-[12rem] sm:max-w-full text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "success"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            Successful Payouts{" "}
          </button>
          <button
            onClick={() => handleFilterChange("failed")}
            className={`font-bold border border-gray-300 max-w-[12rem] sm:max-w-full text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "failed"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            Failed Payouts{" "}
          </button>
        </div>

        <div className="mt-8 mb-20 ">
          <h2 className="mb-6 font-bold text-xl sm:text-2xl "> Payout History </h2>
           {
            isLoading && (
               <div className="mx-auto text-lg md:text-xl  text-gray-400 px-[12px] pb-10 w-full" >Loading payout history...</div>
            )
           }

           {
            isError && (
             <div className="mx-auto text-lg md:text-xl  px-[12px] pb-10 w-full"> Failed to load payout history, check your internet connection </div>

            )
           }
          {PayOutHistory?.length > 0 ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1300px]   text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N</th>
                    <th className="py-3 px-4  "> Vendor</th>
                    <th className="py-3 px-4  "> Order ID</th>
                    <th className="py-3 px-4  "> Amount </th>
                    <th className="py-3 px-4  "> Fee</th>
                    <th className="py-3 px-4  "> Reason </th>
                    <th className="py-3 px-4  "> Status </th>
                    <th className="py-3 px-4  "> Completed</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {PayOutHistory?.map((history, index) => (
                    <tr
                      key={history?._id}
                      className={`border-b cursor-pointer font-medium text-gray-800  hover:border-gray-400 ${
                        index === PayOutHistory?.length - 1 ? "border-b-0" : ""
                      } `}
                    >
                      <td className="py-3 capitaalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {history?.vendor?.storeName}
                      </td>
                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {history?.order}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        ₦{history?.payoutAmount?.toLocaleString()}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4 font-medium text-gray-800  ">
                        ₦{history?.feeDeducted?.toLocaleString()}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {history?.reason}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            history.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {history.status}
                        </span>
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {new Date(history.completedAt).toLocaleDateString()}{" "}
                        {new Date(history.completedAt).toLocaleTimeString()}{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : 
            !isLoading && !isError && (
            <div className="text-gray-700 font-semibold text-lg ">
              No payout history Found.
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

export default AdminPayout;
