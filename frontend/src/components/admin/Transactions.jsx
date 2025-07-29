import AdminSearchBar from "./AdminSearchBar";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Transactions = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const fetchTransaction = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/transactions?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch transaction ");

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
    queryKey: ["transactions", searchParams.toString()],
    queryFn: fetchTransaction,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const transactions = data?.pages.flatMap((page) => page.transactions) || [];

  const handleRowClick = (orderID) => {
    navigate(`/admin/transactions/${orderID}`);
  };

  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className=" text-xl sm:text-2xl lg:text-3xl font-bold mb-6 mt-3  ">
          {" "}
          Transactions Management{" "}
        </h1>
        {/* search bar component */}
        <AdminSearchBar />

        <div className="mt-15 mb-20 ">
          <h2 className="mb-6 font-bold text-xl sm:text-2xl ">
            {" "}
            Transactions{" "}
          </h2>
          {isLoading && (
            <div className="mx-auto text-lg md:text-xl  text-gray-400 px-[12px] pb-10 w-full">
              Loading transactions ...
            </div>
          )}

          {isError && (
            <div className="mx-auto text-lg md:text-xl  px-[12px] pb-10 w-full">
              {" "}
              Failed to load Transactions, check your internet connection{" "}
            </div>
          )}
          {transactions?.length > 0 ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1000px]   text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N</th>
                    <th className="py-3 px-4  "> Reference </th>
                    <th className="py-3 px-4  "> User ID </th>
                    <th className="py-3 px-4  "> Name </th>
                    <th className="py-3 px-4  "> Email </th>
                    <th className="py-3 px-4  "> Amount </th>
                    <th className="py-3 px-4  "> Channel </th>
                    <th className="py-3 px-4  "> Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((transaction, index) => (
                    <tr
                      key={transaction?._id}
                      onClick={() => handleRowClick(transaction?._id)}
                      className={`border-b cursor-pointer font-medium text-gray-800  hover:border-gray-400 ${
                        index === transactions?.length - 1 ? "border-b-0" : ""
                      } `}
                    >
                      <td className="py-3 capitaalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        {transaction?.reference}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {transaction?.user?._id}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {transaction?.user?.name}
                      </td>
                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {transaction?.user?.email}
                      </td>

                      <td className="py-3 capitalize px-4 sm:py-4 sm:px-4">
                        ₦{transaction?.amount?.toLocaleString()}
                      </td>
                       <td className="py-3 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {transaction?.channel}
                      </td>

                      <td className="py-3 px-4  capitalize sm:py-4 sm:px-4">
                        {new Date(transaction?.createdAt).toLocaleDateString()}{" "}
                        {new Date(transaction?.createdAt).toLocaleTimeString()}{" "}
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
                No transactions found.
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

export default Transactions;
