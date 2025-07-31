import AdminSearchBar from "./AdminSearchBar";

import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const UserManagement = () => {
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

  const fetchUsers = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/users?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch users");

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
    queryKey: ["users", searchParams.toString()],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnMount: true,
  });

  console.log(hasNextPage);

  const users = data?.pages.flatMap((page) => page.users) || [];

  return (
    <>
      <div className="mt-3 pt-[60px] md:pt-0 mx-auto ">
        <h1 className="text-2xl font-bold mb-6 "> User Management </h1>
        {/* Admin search bar */}
        <AdminSearchBar />

        <div className="grid mr-3 grid-cols-2 md:grid-cols-4 gap-x-4 mb-10 gap-y-4 mt-14 md:mt-18 ">
          <button
            onClick={() => handleFilterChange("all")}
            className={`font-bold border max-w-full border-gray-300 text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "all"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            All Users{" "}
          </button>
          <button
            onClick={() => handleFilterChange("customer")}
            className={`font-bold border border-gray-300  max-w-full text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "customer"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            Cutomers{" "}
          </button>
          <button
            onClick={() => handleFilterChange("vendor")}
            className={`font-bold border border-gray-300  max-w-full text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "vendor"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            Vendors{" "}
          </button>
          <button
            onClick={() => handleFilterChange("admin")}
            className={`font-bold border border-gray-300 max-w-full text-md sm:text-lg lg:text-xl cursor-pointer py-2 sm:py-3 px-1 rounded-lg text-center
           ${
             filter === "admin"
               ? "bg-gray-900 text-gray-100"
               : "bg-gray-100 text-gray-900"
           }`}
          >
            {" "}
            Admin{" "}
          </button>
        </div>

        {isLoading && (
          <div className="text-start text-md pt-[10px] text-gray-500">
            Loading users...
          </div>
        )}

        {isError && (
          <div className="text-start text-md pt-[10px] text-red-500">
            Failed to load users.
          </div>
        )}

        {!isLoading && !isError && users.length > 0 ? (
          <div
            className={`mb-20 mr-[12px] md:mr-0 shadow-md overflow-hidden overflow-x-auto  relative rounded-sm lg:rounded-md `}
          >
            <table className="  text-left min-w-[1100px] md:min-w-full  text-gray-500 ">
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                <tr>
                  <th className="py-2 px-4 sm:py-3 "> S/N </th>
                  <th className="py-2 px-4 sm:py-3 "> User ID </th>
                  <th className="py-2 px-4 sm:py-3 "> Name </th>
                  <th className="py-2 px-4 sm:py-3 "> Email </th>
                  <th className="py-2 px-4 sm:py-3 "> Role </th>
                  <th className="py-2 px-4 sm:py-3 "> Joined At </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user, index) => (
                  <tr
                    key={user?._id}
                    className={`border-b cursor-pointer hover:border-gray-400 ${
                      index === users?.length - 1 ? "border-b-0" : ""
                    } `}
                  >
                    <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                      {index + 1}
                    </td>
                    <td className="py-2 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                      {user?._id}
                    </td>
                    <td className="py-2 capitalize px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                      {user?.name}
                    </td>
                    <td className="py-2 px-4 capitalize sm:py-4 sm:px-4 font-medium text-gray-800 ">
                      {user?.email}
                    </td>

                    <td className="py-2 capitalize px-4 sm:py-4 text-gray-800 sm:px-4">
                      {user?.role}
                    </td>
                    <td className="py-2 capitalize px-4 sm:py-4 text-gray-800 sm:px-4">
                      <div>
                        {new Date(user?.createdAt).toLocaleDateString()}{" "}
                        {new Date(user?.createdAt).toLocaleTimeString()}{" "}
                      </div>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading &&
          !isError && (
            <div className="text-gray-500 font-semibold text-md ">
              No User Found.
            </div>
          )
        )}

        {hasNextPage && (
          <div className="flex justify-center items-center">
            <button
              className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 mt-[-60px] text-white cursor-pointer"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;
