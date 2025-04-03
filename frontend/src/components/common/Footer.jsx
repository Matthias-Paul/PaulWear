
import {Link} from "react-router-dom"
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi"
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Footer = () => {
 const year = new Date().getFullYear()
  return (
    <>
      <footer className=" w-full pt-[80px] border-t border-gray-500  text-black  ">
        <div className="container px-[12px] gap-x-[20px]  py-12 gap-y-[20px] lg:gap-y-[0px] grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 max-w-[1400px] mx-auto  ">
          <div>
            <h1 className="text-gray-800 text-xl mb-4 "> Newsletter </h1>
            <p className="text-gray-500 mb-4 ">
              {" "}
              Be the first to hear about new products, exclusive events and
              online offer.{" "}
            </p>
            <p className="text-gray-600 mb-6 text-sm "> Sign up and get 10% off your first order.</p>
            <form className="flex  ">
               <div className="relative">
              <input
                className="w-full text-black pl-[6px] rounded-xl mt-5  p-1 pr-19 border-2 border-gray-300 shadow-md outline-none resize-none"
                placeholder="Enter Your Email..."
               
              />
              <button className="absolute mt-[10px] right-0 py-full bg-black p-[7px] rounded-r-xl top-1/2 transform -translate-y-1/2 text-white text-[13px]  cursor-pointer  transition-all" 
               type="submit">
                Subscribe
              </button>
            </div> </form>   
          </div>

          <div>
                <h3 className="font-medium text-xl text-gray-800 mb-4  " > Shop </h3>
                <ul className="space-y-2 text-gray-600 "> 
                        <li>
                            <Link to="" className="hover:text-gray-500" >  Men&#39;s Top Wear  </Link>
                         </li> 
                         <li>
                            <Link to="" className="hover:text-gray-500" >  Women&#39;s Top Wear  </Link>
                         </li>

                        <li>
                            <Link to="" className="hover:text-gray-500" >  Men&#39;s Bottom Wear  </Link>
                         </li>    

                          <li>
                            <Link to="" className="hover:text-gray-500" >  Women&#39;s Bottom Wear  </Link>
                         </li> 
                 </ul>   
          </div> 

           <div>
                <h3 className="font-medium text-xl text-gray-800 mb-4  " > Support </h3>
                <ul className="space-y-2 text-gray-600 "> 
                        <li>
                            <Link to="" className="hover:text-gray-500" >  Contact Us  </Link>
                         </li> 
                         <li>
                            <Link to="" className="hover:text-gray-500" >  About Us  </Link>
                         </li>

                        <li>
                            <Link to="" className="hover:text-gray-500" >  FAQs  </Link>
                         </li>    

                          <li>
                            <Link to="" className="hover:text-gray-500" >  Features  </Link>
                         </li> 
                 </ul>   
          </div>  

        <div>
                <h3 className="font-medium text-xl text-gray-800 mb-4  " > Follow  Us </h3>
                <div className="flex items-center space-x-6 mb-5" >
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
                <p className="text-gray-500 " > Call Us </p>
                <p className="text-gray-500 mt-2" >
                    <FiPhoneCall className="h-5 w-5 inline-block mr-2  " />
                    +2348054696701
                 </p>        
       
          </div> 
        </div>
        <div className="w-full text-center text-sm text-gray-500   mt-12 border-t mx-auto px-[12px] border-gray-500  pt-5 pb-1 " >
               <p>        &#169; { year }, CompileTab, All Right Deserved.     </p>

        </div>    
      </footer>
    </>
  );
};

export default Footer;
