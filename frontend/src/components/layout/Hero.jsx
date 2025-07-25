import pic from "../../assets/pic.jpg"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <>
      <div className="relative w-full mx-auto max-w-[1400px] " >
           <img className="pt-[84px]  md:pt-[92px] w-full max-w-[1400px] max-h-[650px] min-h-[450px] object-cover flex-shrink-0  " alt="Hero-image" src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752944042/lrzzx1nbllxcu7fkulwo.jpg" />
            <div className="absolute inset-0 bg-black opacity-40"></div>
           <div className="absolute pt-[92px] font-bold px-[12px] inset-0 flex flex-col text-white justify-center items-center text-center " >
              <h1 className=" text-2xl  max-w-[800px] md:text-4xl leading-[35px] sm:leading-[60px] tracking-tighting uppercase  "> Connecting You to the Best Vendors  on Campus and Beyond </h1>
              <p className=" text-sm  sm:text-2xl  max-w-[700px]   "> Discover amazing products from student sellers, small businesses, and local brands. Start shopping today! </p>
              <button className=" cursor-pointer rounded-md bg-white shodow-md text-gray-900 md:text-[24px] py-[5px] md:py-[8px] md:rounded-lg mt-4 px-[12px] md:px-[20px] " > 
              <Link to="/collections/all" > 
                Shop Now 
              </Link>
              </button>

           </div> 
           
      </div>  
    </>
  )
}

export default Hero
