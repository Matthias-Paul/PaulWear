import { HiShoppingBag, HiOutlineCreditCard, HiArrowCircleDown } from "react-icons/hi";
const FeaturesSection = () => {
  return (
    <>
      <div className="bg-white container py-12 text-center grid gap-y-[30px] md:gap-y-[0px] md:grid-cols-3 gap-x-[30px] mx-auto ">
        {/* Feature 1 */}
        <div className="flex flex-col items-center   ">
          <div className="p-4 rounded-full mb-3 ">
            <HiShoppingBag className="text-2xl" />
          </div>
          <div className="tracking-tighter mb-3">
            {" "}
            FREE INTERNATIONAL SHIPPING
          </div>
          <div className="text-gray-600 text-sm tracking-tighter ">
            on all orders over $100
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col  items-center   ">
          <div className="p-4 rounded-full mb-3 ">
            <HiArrowCircleDown  className="text-2xl" />
          </div>
          <div className="tracking-tighter mb-3"> 30 DAYS RETURN </div>
          <div className="text-gray-600 text-sm tracking-tighter ">
            Money back guarantee{" "}
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center ">
          <div className="p-4 rounded-full mb-3 ">
            <HiOutlineCreditCard className="text-2xl" />
          </div>
          <div className="tracking-tighter mb-3"> SECURE CHECKOUT </div>
          <div className="text-gray-600 text-sm tracking-tighter ">
            100% checkout secured process{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesSection;
