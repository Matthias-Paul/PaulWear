import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import VendorOrderChart from "../components/common/VendorOrderChart";
import { FaMoneyBillWave, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

const VendorHomePage = () => {
  const { loginUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchVendorOrders = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/orders/vendor?page=${pageParam}&limit=10`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch your orders");

    return res.json();
  };
  const { data: vendorOrders, isLoading: vendorOrdersIsloading } = useQuery({
    queryKey: ["vendorOrders", loginUser?.id],
    queryFn: fetchVendorOrders,
    enabled: !!loginUser?.id,
  });

  console.log(vendorOrders);

  const fetchStats = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/vendor-stats`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch your  stats");
    }
    return res.json();
  };

  const { data: VendorStat } = useQuery({
    queryKey: ["fetchStat", loginUser?.id],
    queryFn: fetchStats,
  });

  const handleRowClick = (orderId) => {
    console.log("orderId", orderId);
    navigate(`/vendor/orders/${orderId}`);
  };

  const fetchVendorChart = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/vendor-weekly-stats`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch vendor  chart");
    }
    return res.json();
  };

  const { data: vendorChartData, isLoading: vendorChartIsLoading } = useQuery({
    queryKey: ["vendorChart", loginUser?.id],
    queryFn: fetchVendorChart,
  });

  const stats = [
    {
      title: "Total Net Amount",
      value: `₦${VendorStat?.stats?.totalPayout?.toLocaleString() || "--"}`,
      icon: <FaMoneyBillWave className="text-blue-500" size={20} />,
      bg: "bg-gray-100",
      link: null,
    },
    {
      title: "Total Orders",
      value: VendorStat?.stats?.totalOrders?.toLocaleString() || "--",
      icon: <FaShoppingCart className="text-green-500" size={20} />,
      bg: "bg-gray-100",
      link: { path: "/vendor/orders", text: "Manage Orders" },
    },
    {
      title: "Total Products",
      value: VendorStat?.stats?.totalProducts?.toLocaleString() || "--",
      icon: <FaBoxOpen className="text-purple-500" size={20} />,
      bg: "bg-gray-100",
      link: { path: "/vendor/products", text: "Manage Products" },
    },
  ];

  return (
    <>
      <div className="w-full pt-[60px] md:pt-0 mx-auto pr-[12px] md:pr-0 ">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 mt-3  ">
          {" "}
          Vendor Dashboard{" "}
        </h1>

        <h4 className="text-lg mb-5 font-semibold text-gray-800">
          👋 Welcome back, {loginUser?.name?.split(" ")[0] || "Guest"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.map((stat, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 ${stat.bg}`}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-md font-medium text-gray-600">
                  {stat?.title}
                </h2>
                {stat?.icon}
              </div>
              <p className="text-xl font-bold text-gray-800 mt-2">
                {stat?.value}
              </p>
              {stat?.link && (
                <Link
                  to={stat?.link?.path}
                  className="text-sm font-medium text-blue-600 hover:underline mt-2 inline-block"
                >
                  {stat?.link?.text}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 mb-20 ">
          <VendorOrderChart
            data={vendorChartData?.stats}
            isLoading={vendorChartIsLoading}
          />
          <h2 className="mb-6 font-bold text-2xl "> Recent Orders </h2>

          {vendorOrders?.orders?.length > 0 || vendorOrdersIsloading ? (
            <div
              className={` shadow-md overflow-hidden overflow-x-auto relative rounded-sm lg:rounded-md `}
            >
              <table className="  text-left min-w-[1200px] md:min-w-[1400px] text-gray-500 ">
                <thead className="uppercase bg-gray-100 text-xs text-gray-600 ">
                  <tr>
                    <th className="py-3 px-4  "> S/N </th>
                    <th className="py-3 px-4  "> Customer </th>
                    <th className="py-3 px-4  "> Customer Phone </th>
                    <th className="py-3 px-4  "> Total Price </th>
                    <th className="py-3 px-4  "> Status </th>
                    <th className="py-3 px-4  "> Address </th>
                    <th className="py-3 px-4  "> items </th>
                    <th className="py-3 px-4  "> Created </th>
                  </tr>
                </thead>
                <tbody>
                  {vendorOrders?.orders?.map((order, index) => (
                    <tr
                      onClick={() => handleRowClick(order?._id)}
                      key={order?._id}
                      className={`border-b cursor-pointer hover:border-gray-400 ${
                        index === vendorOrders?.length - 1 ? "border-b-0" : ""
                      } `}
                    >
                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4 capitalize sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {order?.buyerName}
                      </td>

                      <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 ">
                        {order?.buyerPhoneNumber}
                      </td>

                      <td className="py-3 px-4 sm:py-4 sm:px-4">
                        ₦{order?.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-4">
                        <span
                          className={`px-4 capitalize py-1 rounded text-md font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="capitalize py-4 px-4">
                        {order?.shippingAddress
                          ? `${order?.shippingAddress}`
                          : "N/A"}
                      </td>

                      <td className="py-3  px-4 sm:py-4 sm:px-4">
                        {order?.orderItems?.length} item
                        {order?.orderItems?.length > 1 ? "s" : ""}
                      </td>

                      <td className=" py-4 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-700 font-semibold text-lg ">
              No Recent Order Found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VendorHomePage;
