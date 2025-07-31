import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import pic from "../assets/pic.jpg";
import { useQuery } from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaCreditCard, FaTruck, FaUserTie, FaUserCircle } from "react-icons/fa";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const fetchOrderDetails = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch order details");
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: fetchOrderDetails,
  });

  useEffect(() => {
    if (data) {
      setOrderDetails(data.orderDetails);
      console.log("orderDetails:", data);
    }
  }, [data]);

  const markMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/markAsReceived/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to mark as received");
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["orderDetails", id]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleMarkAsRead = async () => {
    markMutation.mutate();
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please enter a reason for cancellation.");
      return;
    }

    try {
      setIsSubmiting(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/cancel-request/${
          orderDetails?._id
        }`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cancelReason,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setIsSubmiting(false);
      toast.success(data.message, {
        duration: 8000,
      });
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error) {
      toast.error(error.message, {
        duration: 8000,
      });
      setIsSubmiting(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto text-lg md:text-2xl md:font-semibold pt-[120px] md:pt-[140px] px-[12px] pb-10 w-full">
        {" "}
        Order details not found; order is no longer available
      </div>
    );
  }

  return (
    <>
      <div className="pt-[82px] sm:pt-[90px] px-[12px] mx-auto max-w-[1000px] mb-20 ">
        <div className="flex items-center justify-between">
          <h2 className="font-bold mb-5 text-xl md:text-2xl mt-6 ">
            {" "}
            Order Details{" "}
          </h2>
          {/* Info Note */}

          {/* Trigger button */}
          {!orderDetails?.isReceived &&
            !orderDetails?.isCanceled &&
            !isLoading && (
              <button
                className="bg-red-600 px-2 py-1 text-sm md:text-md cursor-pointer rounded-sm sm:rounded-md text-white "
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Order
              </button>
            )}

          {/* Modal */}
          {showCancelModal && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 bg-black opacity-80 z-40"></div>

              {/* Modal content */}
              <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Cancel Order
                </h2>
                <label
                  htmlFor="cancelReason"
                  className="block text-sm mb-1 font-medium text-gray-700"
                >
                  Reason for cancellation
                </label>
                <textarea
                  id="cancelReason"
                  rows="4"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full resize-none border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Please explain why you're cancelling this order"
                ></textarea>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 cursor-pointer py-2 text-sm text-gray-700 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-500 text-white text-sm rounded-md"
                  >
                    {isSubmiting ? "Submiting" : " Submit"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        {!orderDetails ? (
          <p className="  "> Loading order details... </p>
        ) : (
          <div className="p-4 sm:p-6  shadow-md  ">
            <div className="  grid  sm:grid-cols-2 gap-x-3  ">
              <div className="   ">
                <h3 className="text:lg  md:text-xl font-semibold    ">
                  Order ID: #{orderDetails?._id}
                </h3>

                <p className="text-gray-600  ">
                  {" "}
                  {new Date(orderDetails?.createdAt).toLocaleDateString()}{" "}
                </p>
                {!orderDetails?.isReceived &&
                  !orderDetails?.isCanceled &&
                  !isLoading && (
                    <div className="text-green-600 mt-1 text-[12px] sm:text-sm ">
                      Please remember to mark your order as{" "}
                      <strong>received</strong> after it arrives. This helps us
                      confirm delivery and ensures the vendor gets paid.
                      <strong>NOTE:</strong> You can only cancel the order if it
                      hasn’t been marked as received.
                    </div>
                  )}
              </div>

              <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0  ">
                <span
                  className={` ${
                    orderDetails?.isPaid
                      ? "bg-green-100 text-green-700"
                      : " bg-red-100 text-red-700"
                  } py-1 px-3 rounded-lg text-sm mb-3    `}
                >
                  {orderDetails?.isPaid ? "Approved" : "Pending"}
                </span>
                <span
                  className={` ${
                    orderDetails?.isDelivered
                      ? "bg-green-100 text-green-700"
                      : " bg-yellow-100 text-yellow-700"
                  } py-1 px-3 rounded-lg text-sm mb-3    `}
                >
                  {orderDetails?.isDelivered ? "Delivered" : "Pending Delivery"}
                </span>

                <span>
                  <button
                    onClick={handleMarkAsRead}
                    disabled={orderDetails?.isReceived}
                    className={`py-1 px-2 ${
                      markMutation.isPending || orderDetails?.isReceived
                        ? "cursor-not-allowed bg-green-100 text-green-700 "
                        : "cursor-pointer text-white hover:bg-green-600 bg-green-500 "
                    }    rounded-md`}
                  >
                    {markMutation.isPending
                      ? "Processing..."
                      : orderDetails?.isReceived
                      ? "Order already received"
                      : "Mark order as received"}
                  </button>
                </span>
              </div>
            </div>

            {/* customer, payment, shipping info */}
            <div className="grid mb-13 mt-8 grid-cols-1 sm:grid-cols-2 gap-8 mb-6  ">
              <div className="p-4 rounded-lg shadow-lg border border-gray-300 ">
                <div className="text:lg flex items-center gap-x-3  mb-2 font-semibold    ">
                  <FaCreditCard className="text-green-600" />
                  <h2> Payment Info</h2>
                </div>
                <p> Payment Method: {orderDetails?.paymentMethod} </p>
                <p> Status: {orderDetails?.isPaid ? "Paid" : "Unpaid"} </p>
                <p>
                  {" "}
                  Paid At: {new Date(
                    orderDetails?.paidAt
                  ).toLocaleDateString()}{" "}
                  {new Date(orderDetails?.paidAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-lg border border-gray-300 ">
                <div className="text:lg flex items-center gap-x-3  mb-2 font-semibold    ">
                  <FaTruck className="text-green-600" />
                  <h2> Delivery Info</h2>
                </div>
                <p>
                  {" "}
                  Delivery Address: {` ${orderDetails?.shippingAddress} `}{" "}
                </p>
                {orderDetails?.deliveredAt && (
                  <p>
                    {" "}
                    Delivered At:{" "}
                    {new Date(
                      orderDetails?.deliveredAt
                    ).toLocaleDateString()}{" "}
                    {new Date(orderDetails?.deliveredAt).toLocaleTimeString()}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg shadow-lg border border-gray-300 ">
                <div className="text:lg flex items-center gap-x-3  mb-2 font-semibold    ">
                  <FaUserTie className="text-green-600" />
                  <h2> Vendor Info</h2>
                </div>{" "}
                <p> Store Name: {orderDetails?.vendor?.storeName} </p>
                <p> Store Email: {orderDetails?.vendor?.email} </p>
                <p className="flex items-start  mt-1 ">
                  {" "}
                  Store Phone No:{" "}
                  <a
                    className="ml-2 text-sm sm:text-md  bg-green-100 text-green-700 px-2 py-1 rounded "
                    href={`tel:${orderDetails?.vendor?.contactNumber}`}
                  >
                    {" "}
                    {orderDetails?.vendor?.contactNumber}{" "}
                  </a>{" "}
                </p>
              </div>
            </div>

            {/* products list  */}

            {orderDetails?.orderItems ? (
              <div
                className={` shadow-md overflow-hidden  overflow-x-auto  relative rounded-sm lg:rounded-md `}
              >
                <table className="w-full  text-left min-w-[800px]  text-gray-500 ">
                  <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                    <tr>
                      <th className="py-2 px-4 sm:py-3 "> S/N </th>
                      <th className="py-2 px-4 sm:py-3 "> Name </th>
                      <th className="py-2 px-4 sm:py-3 "> Color </th>
                      <th className="py-2 px-4 sm:py-3 "> Size </th>
                      <th className="py-2 px-4 sm:py-3 "> Quantity </th>
                      <th className="py-2 px-4 sm:py-3 "> Total </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails?.orderItems?.map((item, index) => (
                      <tr
                        key={`${item.productId}-${item.size}-${item.color}`}
                        className={`border-b cursor-pointer hover:border-gray-400 ${
                          index === orderDetails?.orderItems?.length - 1
                            ? "border-b-0"
                            : ""
                        } `}
                      >
                        <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                          {index + 1}
                        </td>

                        <td className="py-2 px-4 flex items-center  sm:py-3 sm:px-4 ">
                          <img
                            src={item?.image}
                            className="w-12 h-12 mr-2 rounded-lg sm:rounded-md object-cover flex-shrink-0 "
                            alt={item?.name}
                          />
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-blue-500 hover:underline"
                          >
                            {item?.name}
                          </Link>
                        </td>
                        <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                          {item?.color}
                        </td>
                        <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                          {item?.size}
                        </td>
                        <td className="py-2 px-4 sm:py-4 sm:px-4">
                          {item?.quantity}
                        </td>
                        <td className="py-2 px-4 sm:py-4 sm:px-4">
                          ₦{item?.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              isLoading && (
                <div className=" text-gray-500 text-xl px-4 text-center">
                  {" "}
                  Loading your order details...{" "}
                </div>
              )
            )}

            <div className="mt-5">
              <Link
                to={`/my-orders`}
                className="text-blue-500 pt-4 hover:underline"
              >
                Back to my orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetailsPage;
