import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const VendorDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const VendorDetail = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/vendor-store/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch vendor store");
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["profileDetails", id],
    queryFn: VendorDetail,
  });

  console.log(data);

  function formatDateWithSuffix(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }

  const editMutation = useMutation({
    mutationFn: async (newStatus) => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/vendor/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to edit ");
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["profileDetails", id]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleApprove = () => {
    editMutation.mutate("approved");
  };

  const handleReject = () => {
    editMutation.mutate("rejected");
  };

  if (isLoading)
    return (
      <p className="text-start text-md pt-[70px] md:pt-10">
        Loading vendor details...
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 text-start pt-[70px] md:pt-10">
        {error.message}
      </p>
    );

  console.log(editMutation);
  return (
    <>
      <div className="mx-auto pt-[70px] md:pt-[10px] pr-3 md:pr-0 pb-15 w-full">
        <div>
          <div className="flex flex-col  items-start text-gray-900 ">
            <div className="mb-2 max-w-[5rem]  ">
              <Link
                to={`/admin/vendors`}
                className=" flex items-center  gap-x-1 md:text-lg  text-gray-900 pt-4 hover:underline"
              >
                <FaArrowLeft />
                Back
              </Link>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-3">
              Vendor Profile
            </h1>

            {data?.storeDetails?.status === "pending" && (
              <div className="flex items-center gap-x-7 mb-6 ">
                <button
                  onClick={handleApprove}
                  disabled={editMutation?.isPending}
                  className="px-3 md:text-xl py-1 rounded cursor-pointer text-white bg-green-600  "
                >
                  {editMutation?.isPending &&
                  editMutation?.variables === "approved"
                    ? "Processing..."
                    : "Accept"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={editMutation?.isPending}
                  className="px-3 py-1 md:text-xl rounded cursor-pointer text-white bg-red-600  "
                >
                  {editMutation?.isPending &&
                  editMutation?.variables === "rejected"
                    ? "Processing..."
                    : "Reject"}
                </button>
              </div>
            )}
          </div>
          {/* Store Banner */}
          <div className="bg-white   rounded-md sm:rounded-lg shadow-md border border-gray-300 p-5 mb-6 flex flex-col md:flex-row gap-6">
            <img
              src={data?.storeDetails?.storeLogo}
              alt="Store Logo"
              className="w-35 h-35 rounded-full object-cover "
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {data?.storeDetails?.storeName}
              </h2>
              <p className="text-gray-600">@{data?.storeDetails?.storeSlug}</p>
              <p className="text-sm text-gray-500 mt-2">
                {data?.storeDetails?.bio}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 text-gray-800">
            <div>
              <h3 className="font-semibold">Store Contact Number:</h3>
              <p>{data?.storeDetails?.contactNumber}</p>
            </div>

            <div>
              <h3 className="font-semibold"> Store Email:</h3>
              <p>{data?.storeDetails?.email}</p>
            </div>
            <div>
              <h3 className="font-semibold"> User Name:</h3>

              <p>{data?.storeDetails?.user?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold"> User Email:</h3>
              <p>{data?.storeDetails?.user?.email}</p>
            </div>

            <div>
              <h3 className="font-semibold"> Address:</h3>
              <p>
                {data?.storeDetails?.address}, {data?.storeDetails?.campus},{" "}
                {data?.storeDetails?.state}
              </p>
            </div>

            <div>
              <h3 className="font-semibold"> Business Certificate:</h3>
              <p>
                {data?.storeDetails?.businessCertificate ? (
                  <img
                    src={data?.storeDetails?.businessCertificate}
                    alt="Business Certificate Image"
                    className="w-42 h-32 object-cover rounded-md "
                  />
                ) : (
                  "Not Uploaded"
                )}
              </p>
            </div>

            <div>
              <h3 className="font-semibold"> Verified Status:</h3>
              <p className="flex items-center gap-2">
                {data?.storeDetails?.isVerified ? (
                  <>
                    <FaCheckCircle className="text-green-600" />
                    Verified
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-red-600" />
                    Not Verified
                  </>
                )}
              </p>
            </div>

            <div>
              <h3 className="font-semibold"> Approval Status:</h3>
              <p className="capitalize">{data?.storeDetails?.status}</p>
            </div>

            <div>
              <h3 className="font-semibold"> Joined:</h3>
              <p> {formatDateWithSuffix(data?.storeDetails?.createdAt)}</p>
            </div>

            <div>
              <h3 className="font-semibold"> Rating:</h3>
              <p className="">{data?.storeDetails?.rating}</p>
            </div>

            <div>
              <h3 className="font-semibold"> Total Products:</h3>
              <p className="">{data?.totalVendorProducts}</p>
            </div>

            <div>
              <h3 className="font-semibold"> Total Orders:</h3>
              <p className="">{data?.totalVendorOrders}</p>
            </div>

            <div>
              <h3 className="font-semibold"> User ID:</h3>
              <p className="">{data?.storeDetails?.user?._id}</p>
            </div>

            <div>
              <h3 className="font-semibold"> Vendor ID:</h3>
              <p className="">{data?.storeDetails?._id}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDetails;
