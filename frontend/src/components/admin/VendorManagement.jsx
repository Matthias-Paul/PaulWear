import AdminSearchBar from "./AdminSearchBar";
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const VendorManagement = () => {
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

  const fetchVendors = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/vendors?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch vendors ");

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
    queryKey: ["vendors", searchParams.toString()],
    queryFn: fetchVendors,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const vendors = data?.pages.flatMap((page) => page.vendors) || [];

  const handleRowClick = (vendorID) => {
    navigate(`/admin/vendors/${vendorID}`);
  };

  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 mt-3  ">
          {" "}
          Vendor Management{" "}
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
            All Vendors{" "}
          </button>
          <button
            onClick={() => handleFilterChange("pending")}
            className={`font-bold border border-gray-300  max-w-[12rem] sm:max-w-full text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "pending"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            Pending Vendors{" "}
          </button>
          <button
            onClick={() => handleFilterChange("approved")}
            className={`font-bold border border-gray-300 max-w-[12rem] sm:max-w-full text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "approved"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            Approved Vendors{" "}
          </button>
        </div>

        <div className="mt-8 mb-20 ">
          <h2 className="mb-6 font-bold text-xl sm:text-2xl "> Vendors </h2>
          {isLoading && (
            <div className="mx-auto text-lg md:text-xl  text-gray-400 px-[12px] pb-10 w-full">
              Loading vendors ...
            </div>
          )}

          {isError && (
            <div className="mx-auto text-lg md:text-xl  px-[12px] pb-10 w-full">
              {" "}
              Failed to load vendor, check your internet connection{" "}
            </div>
          )}
          {vendors?.length > 0 ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1200px]   text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N</th>
                    <th className="py-3 px-4  "> Store Name</th>
                    <th className="py-3 px-4  "> Name</th>
                    <th className="py-3 px-4  "> Phone </th>
                    <th className="py-3 px-4  "> Vendor ID</th>
                    <th className="py-3 px-4  "> Owner ID (User ID) </th>
                    <th className="py-3 px-4  "> Status </th>
                  </tr>
                </thead>
                <tbody>
                  {vendors?.map((vendor, index) => (
                    <tr
                      key={vendor?._id}
                      onClick={() => handleRowClick(vendor?._id)}
                      className={`border-b cursor-pointer font-medium text-gray-800  border-gray-400 ${
                        index === vendors?.length - 1 ? "border-b-0" : ""
                      } `}
                    >
                      <td className="py-3 capitaalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {vendor?.storeName}
                      </td>
                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {vendor?.user?.name}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {vendor?.contactNumber}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {vendor?._id}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4 font-medium text-gray-800  ">
                        {vendor?.user?._id}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            vendor.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {vendor.status}
                        </span>
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
                No vendor Found.
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

export default VendorManagement;
