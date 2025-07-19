import { Link } from "react-router-dom"
import pic from "../../assets/pic.jpg"


const FeaturedCollection = () => {
  return (
    <>
    <div className="px-[12px] pb-8 " >
      <div className="py-12 px-[12px]  border border-gray-200  mt-14 gap-x-[35px] w-full max-w-[1400px]  flex flex-col-reverse md:flex-row mx-auto container rounded-md items-center  ">
        {/* left content */}
        <div className="md:w-1/2 text-center md:text-left  ">
          <h2 className="text-lg text-gray-700 my-2 font-semibold">
            {" "}
            Style, Taste, and Community{" "}
          </h2>
          <h2 className=" text-2xl sm:text-4xl lg:5xl text-gray-700 mb-8 font-bold">
            {" "}
            Shop, Support Students, Stand Out{" "}
          </h2>
          <p className="text-lg text-gray-600 mb-6 ">
            {" "}
              Find unique products made by students for students. From fresh snacks and fashion-forward outfits to handcrafted items, shop with purpose and uplift your campus community.

          </p>
          <button className=" cursor-pointer rounded-md hover:bg-gray-800 bg-black shodow-md text-white md:text-[24px] py-[5px] md:py-[8px] md:rounded-lg mt-4 px-[12px] md:px-[20px] " > 
              <Link to="/collections/all" > 
                Shop Now 
              </Link>
              </button>
        </div>
        {/* right content */}

        <div className="md:w-1/2" >
            <img className="w-full   object-cover flex-shrink-0 h-full max-h-[650px] rounded-tr-2xl rounded-bl-2xl  " alt="featured-image" src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752943503/hwdlhsbb33vei8f8g7bc.jpg" />
             
        </div>
      </div>

    </div>  
    </>
  );
};

export default FeaturedCollection;
