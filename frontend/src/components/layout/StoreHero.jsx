import pic from "../../assets/pic.jpg"
import { Link } from "react-router-dom"

const StoreHero = () => {
  return (
    <>
      <div className="relative w-full scroll-smooth   mx-auto max-w-[1400px] " >
           <img className="pt-[84px] md:pt-[92px] w-full max-w-[1400px] max-h-[600px]  min-h-[450px]  object-cover flex-shrink-0  " alt="Hero-image" src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752927047/dybrarbnj2nqubdrjqeb.jpg" />
           <div className="absolute inset-0 bg-black opacity-60"></div>
           <div className="absolute pt-[92px] font-bold px-[12px] inset-0 flex flex-col text-white justify-center items-center text-center " >
              <h1 className=" text-2xl  max-w-[800px] md:text-4xl leading-[35px] sm:leading-[60px] tracking-tighting uppercase  "> Explore the Best Student Stores Near You </h1>
              <p className=" text-sm  sm:text-2xl  max-w-[700px]   ">Discover vendors, support student entrepreneurs, and find the perfect deals—all in one place. </p>
              <a href="#store-section">
                <button className="cursor-pointer scroll-smooth  rounded-md bg-white shadow-md text-gray-900 md:text-[24px] py-[5px] md:py-[8px] md:rounded-lg mt-4 px-[12px] md:px-[20px]">
                  Browse Stores
                </button>
              </a>


           </div> 
           
      </div>  
    </>
  )
}

export default StoreHero
