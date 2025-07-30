import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const TransactionDetails = () => {
  const { id } = useParams();

  const fetchTransactionDetails = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/transactionDetails/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch transaction details");
    }
    return res.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["TransactionDetails", id],
    queryFn: fetchTransactionDetails,
  });

  const transaction = data?.transactionDetails;
  const user = transaction?.user;
  const response = transaction?.paymentResponse;
  const metadata = response?.metadata;
  const cartItems = metadata?.cartItems || [];
  const card = response?.authorization;

  if (isLoading) {
    return <div className="text-start pt-[80px] md:pt-[20px] text-gray-500">Loading transaction details...</div>;
  }

  if (isError) {
    return (
      <div className="text-start pt-[80px] md:pt-[20px] text-red-500">
        Failed to load transaction details.
      </div>
    );
  }

  return (
    <div className=" mx-auto pr-3 md:pr-0 pt-[80px] md:pt-[20px] bg-white mb-20  rounded-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-[20px] text-green-600 text-xl sm:text-2xl font-semibold">
        <FaCheckCircle /> Transaction Successful
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <FaUser /> {user?.name}
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope /> {user?.email}
            </p>
            <p className="flex items-center gap-2">
              <FaMoneyBillWave /> ₦{transaction?.amount}
            </p>
            <p className="flex items-center gap-2">
              <FaCreditCard /> {transaction?.channel} via{" "}
              {transaction?.paymentGateway}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt /> {new Date(response?.paid_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Shipping Info</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <FaUser /> {metadata?.customer?.firstName}{" "}
              {metadata?.customer?.lastName}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone /> {metadata?.customer?.phone}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt /> {metadata?.customer?.address}
            </p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Purchased Items</h2>
        <div className="space-y-3">
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <img
                src={item?.image}
                alt={item?.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item?.name}</p>
                <p className="text-sm text-gray-600">
                  ₦{item?.price} | Size: {item?.size} | Color: {item?.color} |
                  Qty: {item?.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Details */}
      {card && (
        <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Card Info</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <strong>Bank:</strong> {card?.bank}
            </p>
            <p>
              <strong>Card Type:</strong> {card?.card_type}
            </p>
            <p>
              <strong>Card:</strong> **** **** **** {card?.last4}
            </p>
            <p>
              <strong>Brand:</strong> {card?.brand}
            </p>
            <p>
              <strong>Reusable:</strong> {card?.reusable ? "Yes" : "No"}
            </p>
            <p>
              <strong>Expires:</strong> {card?.exp_month}/{card?.exp_year}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
