import { HiShoppingBag, HiOutlineCreditCard, HiArrowCircleDown, HiGlobeAlt, HiShieldCheck, HiStar, HiSearch, HiUsers, HiTruck } from "react-icons/hi";
import { FiSmile } from "react-icons/fi";
import { FaBullhorn } from "react-icons/fa";

const FeaturesSection = () => {

const vendor =[
  {
    icon: HiGlobeAlt,
    heading:"Your Products, Your Customers, Nationwide",
    subheading:" From your campus to campuses across the country, we give your products the visibility they deserve connecting you with a growing network of buyers."
  },
  {
    icon:FiSmile ,
    heading:"Sell Without Stress",
    subheading:"List your products in minutes, manage your store easily, and focus on what you do best your business. "
  },
  {
    icon:HiShieldCheck ,
    heading:"Safe and Secure Payments",
    subheading:"We handle the payments for you. Your funds are released when the customer confirms they have received their order no more risks, no more hassles "
  },
  {
    icon:FaBullhorn,
    heading:"Build Your Brand, Not Just a Store",
    subheading:" We promote top vendors, support student-owned businesses, and help you grow your brand from your hostel to homes across Nigeria."
  }
]


const buyer =[
  {
    icon: HiSearch,
    heading:"Find What You Need",
    subheading:"Whether it is fresh chinchin, a new pair of sneakers, or that perfect lip gloss, you all find it here, all from fellow students."
  },
  {
    icon: HiShieldCheck,
    heading: "Shop with Confidence",
    subheading: "We simulate escrow by ensuring vendors only get paid when you confirm delivery, giving you peace of mind."
  },
  {
    icon:HiUsers,
    heading:"Support Fellow Students",
    subheading:"Every purchase helps another student grow their small business. It is a win-win for everyone. "
  },
  {
    icon:HiTruck,
    heading:"Quick Delivery, Local Vibes",
    subheading:"No waiting weeks for your order—shop right here on campus and get it faster."
  }
]

  return (
    <>
      <div className=" max-w-6xl w-full mt-13 px-[12px] mx-auto ">
            <h2 className=" pt-6 text-2xl sm:text-3xl font-bold text-center mt-4 ">
              Why Choose Us
            </h2>
            <p className="text-gray-800  mt-3 text-3 sm:text-4 text-start  " >
              We are more than just an online store. We are a growing community of student entrepreneurs and buyers across Nigeria, helping each other succeed in business, one product at a time.
              Here is why students love our platform whether you are here to buy or sell: 
            </p>

            <div>
                
                <h1 className="  text-lg sm:text-xl font-bold text-start mt-8"> For Vendors (Sellers)  </h1>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    {vendor.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex gap-4 items-start p-4 border border-gray-400 rounded-lg shadow-sm">
                          <Icon className="text-5xl text-gray-800" />
                          <div>
                            <h3 className="font-semibold text-lg">{item.heading}</h3>
                            <p className="text-gray-700 text-sm">{item.subheading}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div> 
            </div>  

             <div>
                
                <h1 className="  text-lg sm:text-xl font-bold text-start mt-8 "> For Buyers  </h1>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    {buyer.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex gap-4 items-start p-4 border border-gray-400 rounded-lg shadow-sm">
                          <Icon className="text-5xl text-gray-800" />
                          <div>
                            <h3 className="font-semibold text-lg">{item.heading}</h3>
                            <p className="text-gray-700 text-sm">{item.subheading}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div> 
            </div>
      </div>
    </>
  );
};

export default FeaturesSection;
