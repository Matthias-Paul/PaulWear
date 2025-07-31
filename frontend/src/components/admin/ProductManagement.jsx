import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import AdminSearchBar from "./AdminSearchBar";

import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";

const ProductManagement = () => {
  const { loginUser } = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const fetchAllProducts = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/admin/products?${searchParams.toString()}&page=${pageParam}&limit=15`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch products");
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
    queryKey: ["products", searchParams.toString()],
    queryFn: fetchAllProducts,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });

  const products = data?.pages.flatMap((page) => page.products) || [];
  console.log(products);

  const deleteMutation = useMutation({
    mutationFn: async ({ productId }) => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Deleting product with ID", productId);
      deleteMutation.mutate({ productId });
    }
  };

  return (
    <>
      <div className=" pt-[78px] md:pt-5 pb-20 ">
        <div className="flex justify-between items-start mr-3 md:mr-0 gap-x-2 ">
          <div className=" text-xl text-gray-900 sm:text-2xl font-bold mb-6 ">
            {" "}
            Product Management{" "}
          </div>
          <div className="   ">
            {" "}
            <AdminSearchBar />{" "}
          </div>
        </div>

        {isLoading && (
          <div className="text-start text-md pt-[60px] text-gray-500">
            Loading products...
          </div>
        )}

        {isError && (
          <div className="text-start text-md pt-[60px] text-red-500">
            Failed to load products.
          </div>
        )}
        {products.length > 0 && !isLoading && !isError ? (
          <>
            <div
              className={` mr-[12px] mt-12 md:mt-17 md:mr-0 shadow-md overflow-hidden overflow-x-auto  relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1400px] text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N </th>
                    <th className="py-3 px-4  "> Image </th>
                    <th className="py-3 px-4  "> Name </th>
                    <th className="py-3 px-4  "> Price </th>
                    <th className="py-3 px-4  "> Owner ID ( User ) </th>
                    <th className="py-3 px-4  "> Strore Name </th>
                    <th className="py-3 px-4  "> category </th>
                    <th className="py-3 px-4  "> Action </th>
                    <th className="py-3 px-4  "> Created At </th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product, index) => (
                    <tr
                      key={product?.slug}
                      className={`border-b  hover:border-gray-400 ${
                        index === products?.length - 1 ? "border-b-0" : ""
                      } `}
                    >
                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        <Link to={`/product/${product?._id}`}>
                          <img
                            src={product?.images[0]?.url}
                            className=" h-15 w-18  sm:h-18 sm:w-21 flex-shrink-0  object-cover rounded-lg shadow-md   "
                          />
                        </Link>
                      </td>
                      <td className="py-3 px-4 hover:underline hover:text-blue-600 capitalize sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        <Link to={`/product/${product?._id}`}>
                          {product?.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        ₦{product?.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-4">
                        {product?.user}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-4">
                        {product?.vendorStoreName}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-4">
                        {product?.category}
                      </td>
                      <td className="py-3 sm:py-4   ">
                        <div className="flex pr-4  ">
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="py-1 px-2 rounded bg-red-500 hover:bg-red-600 text-white cursor-pointer ml-2  "
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      <td className="py-2 capitalize px-4 sm:py-4 text-gray-800 sm:px-4">
                        <div>
                          {new Date(product?.createdAt).toLocaleDateString()}{" "}
                          {new Date(product?.createdAt).toLocaleTimeString()}{" "}
                        </div>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasNextPage && (
              <div className="flex justify-center items-center">
                <button
                  className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 mt-8 text-white cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
              </div>
            )}
          </>
        ) : (
          !isLoading &&
          !isError && (
            <div className="text-gray-700 font-semibold text-lg ">
              No Products Found.
            </div>
          )
        )}
      </div>
    </>
  );
};

export default ProductManagement;
