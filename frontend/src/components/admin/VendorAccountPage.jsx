import AdminSearchBar from "./AdminSearchBar";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const VendorAccountPage = () => {
  const [searchParams] = useSearchParams();

  const fetchVendorsAccount = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/vendorsAccount?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch vendors account ");

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
    queryKey: ["vendorsAccount", searchParams.toString()],
    queryFn: fetchVendorsAccount,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const vendorsAccount =
    data?.pages.flatMap((page) => page.vendorsAccount) || [];

  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-6 mt-3  ">
          {" "}
          Vendors Account Management{" "}
        </h1>
        {/* search bar component */}
        <AdminSearchBar />

        <div className="mt-15 mb-20 ">
          <h2 className="mb-6 font-bold text-lg sm:text-2xl ">
            {" "}
            Vendors Account{" "}
          </h2>
          {isLoading && (
            <div className="mx-auto text-lg md:text-xl  text-gray-400 px-[12px] pb-10 w-full">
              Loading account ...
            </div>
          )}

          {isError && (
            <div className="mx-auto text-lg md:text-xl  px-[12px] pb-10 w-full">
              {" "}
              Failed to load Vendors account, check your internet connection{" "}
            </div>
          )}
          {vendorsAccount?.length > 0 ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1600px]   text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N</th>
                    <th className="py-3 px-4  "> Vendor ID</th>
                    <th className="py-3 px-4  "> Account Name </th>
                    <th className="py-3 px-4  "> Account Number </th>

                    <th className="py-3 px-4  "> Bank Name </th>
                    <th className="py-3 px-4  "> Store Name </th>
                    <th className="py-3 px-4  "> Total Balance </th>
                    <th className="py-3 px-4  "> Pending Balance </th>
                    <th className="py-3 px-4  "> Recipient Code </th>

                    <th className="py-3 px-4  "> Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorsAccount?.map((vendorAcc, index) => (
                    <tr
                      key={vendorAcc?._id}
                      className={`border-b cursor-pointer font-medium text-gray-800  hover:border-gray-400 ${
                        index === vendorsAccount?.length - 1 ? "border-b-0" : ""
                      } `}
                    >
                      <td className="py-3 capitaalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {vendorAcc?.vendor?._id}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {vendorAcc?.accountName}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {vendorAcc?.bankAccountNumber}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4 font-medium text-gray-800  ">
                        {vendorAcc?.bankName}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {vendorAcc?.vendor?.storeName}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        ₦{vendorAcc?.totalBalance?.toLocaleString()}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        ₦{vendorAcc?.pendingBalance?.toLocaleString()}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        {vendorAcc?.recipientCode}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {new Date(vendorAcc?.updatedAt).toLocaleDateString()}{" "}
                        {new Date(vendorAcc?.updatedAt).toLocaleTimeString()}{" "}
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
                No vendor account Found.
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

export default VendorAccountPage;
