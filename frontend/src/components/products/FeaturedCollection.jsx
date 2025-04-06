import { Link } from "react-router-dom"


const FeaturedCollection = () => {
  return (
    <>
      <div className="py-12 w-full max-w-[1400px] flex flex-col-reverse md:flex-row mx-auto bg-green-50 container rounded-3xl items-center  ">
        {/* left content */}
        <div className="md:w-1/2 text-center md:text-left  ">
          <h2 className="text-lg text-gray-700 mb-2 font-semibold">
            {" "}
            Comfort and Style{" "}
          </h2>
          <h2 className=" text-3xl sm:text-4xl lg:5xl text-gray-700 mb-8 font-bold">
            {" "}
            Apparel Made For Your Everyday Life.{" "}
          </h2>
          <p className="text-lg text-gray-600 mb-6 ">
            {" "}
            Discover high quality, comfortable clothing that effortlessly blend
            fashion and function. Designed to make you look and feel good
            everyday.{" "}
          </p>
          <button className=" cursor-pointer rounded-md hover:bg-gray-800 bg-black shodow-md text-white md:text-[24px] py-[5px] md:py-[8px] md:rounded-lg mt-4 px-[12px] md:px-[20px] " > 
              <Link to="/collections/all" > 
                Shop Now 
              </Link>
              </button>
        </div>
      </div>
    </>
  );
};

export default FeaturedCollection;
