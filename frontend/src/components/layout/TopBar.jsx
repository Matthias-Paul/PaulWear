import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const TopBar = () => {
  return (
    <div className=" w-full bg-[#ea2e0e] text-white  ">
      <div className="container px-[12px] py-[10px] flex justify-between items-center max-w-[1400px] mx-auto  ">
        <div className=" hidden sm:flex gap-x-4 items-center ">
          <Link to="">
            <TbBrandMeta className="h-5 w-5  " />
          </Link>
          <Link to="">
            <IoLogoInstagram className="h-5 w-5  " />
          </Link>
          <Link to="">
            <RiTwitterXLine className="h-4 w-4  " />
          </Link>
        </div>
        <div className=" mx-auto text-xs sm:text-sm">
          We ship worldwide - Fast and reliable shipping!
        </div>
        <div className=" hidden sm:flex text-center hover:text-gray-300 text-sm">
          <Link to="tel:+2348054696701">+2348054696701</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
