import pic from "../../assets/pic.jpg"
import { Link } from "react-router-dom"
const Hero = () => {
  return (
    <>
      <div className="relative w-full " >
           <img className="w-full  pt-[92px]  max-h-[1500px]  object-cover flex-shrink-0  " alt="Hero-image" src={pic} />
           <div className="absolute pt-[92px] font-bold px-[12px] inset-0 flex flex-col text-white justify-center items-center text-center " >
              <h1 className=" text-2xl  max-w-[900px] md:text-6xl leading-[40px] sm:leading-[90px] tracking-tighting uppercase  "> Discover your perfect style at styleNest </h1>
              <p className=" text-sm  sm:text-2xl    "> Shop the latest trends and find fashion that fit your lifestyle. </p>
              <button className=" cursor-pointer rounded-md bg-white shodow-md text-gray-900 md:text-[24px] py-[5px] md:py-[8px] md:rounded-lg mt-4 px-[12px] md:px-[20px] " > 
              <Link to=" " > 
                Shop Now 
              </Link>
              </button>

           </div> 
      </div>  
    </>
  )
}

export default Hero
