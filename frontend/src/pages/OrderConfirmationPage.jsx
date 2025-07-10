import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearMyCart } from "../redux/slice/userSlice";
import toast from "react-hot-toast";

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!reference) {
      setError("Missing reference");
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/verify?reference=${reference}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok && data?.order?.length > 0) {
          clearInterval(interval);
          await dispatch(clearMyCart());

          const hasRefreshed = localStorage.getItem("orderRefreshed");
        
          if (!hasRefreshed) {
            localStorage.setItem("orderRefreshed", "true"); 
            await dispatch(clearMyCart());
            setOrders(data.order);
            setLoading(false);
            console.log("Clearing cart....");
        
            setTimeout(() => {
              window.location.reload();
               dispatch(clearMyCart());

              console.log("Refreshing...");
            }, 6000);
          } else {
            // If already refreshed, don't reload again
            setOrders(data.order);
            setLoading(false);
             dispatch(clearMyCart());

            localStorage.removeItem("orderRefreshed"); // Clear flag for future orders
          }
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            toast.error("Order creation timed out. Please refresh later.");
            setLoading(false);
          }
        }
      } catch (err) {
        clearInterval(interval);
        toast.error("Something went wrong verifying your order.");
        setLoading(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [reference, dispatch ]);

  


  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-[90px] sm:py-[100px] mb-15 mx-auto px-[12px]  text-lg">Verifying your order...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-[90px] sm:py-[100px] mb-15 mx-auto px-[12px] ">{error}</div>;
  }

  if (!orders) {
    return <div className="text-center text-gray-600 py-[90px] sm:py-[100px] mb-15 mx-auto px-[12px] ">No order was found. Please contact support.</div>;
  }

  return (
    <div className="max-w-[800px] py-[90px] sm:py-[120px] mb-15 mx-auto px-[12px] bg-white">
      <h1 className="text-emerald-800 text-2xl lg:text-4xl font-bold text-center mb-4 sm:mb-8">
        Thank you for your order!
      </h1>

      {orders.map((order) => (
        <div key={order._id} className="rounded-lg border border-gray-400 p-3 sm:p-6 mb-12">
          {/* Order header */}
          <div className="      flex flex-col sm:flex-row justify-between  mb-12 sm:mb-20">
            <div>
              <h2 className="text-md sm:text-xl font-semibold">Order ID: {order._id}</h2>
              <p className="text-gray-500 text-sm sm:text-[16px]">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery: {calculateEstimatedDelivery(order?.createdAt)}
              </p>
            </div>
          </div>

          {/* Order items */}
          <div className="mb-10 lg:mb-20">
            {order.orderItems?.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex mb-4 gap-x-2 items-start">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover  flex-shrink-0"
                />
                <div>
                  <h4 className="text-sm sm:text-md  font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto  text-right">
                  <p className="text-md">₦{item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment and delivery info */}
          <div className="grid grid-cols-2 ">
            <div>
              <h4 className="text-mlgd font-bold mb-2">Payment</h4>
              <p className="text-gray-600">Paystack</p>
            </div>
            <div>
              <h4 className="text-mlgd font-bold mb-2">Delivery</h4>
              <p className="text-gray-600">{order.shippingAddress}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderConfirmationPage;
