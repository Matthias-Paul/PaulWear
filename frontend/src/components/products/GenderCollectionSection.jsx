import pic from "../../assets/pic.jpg"
import { Link } from "react-router-dom"

const GenderCollectionSection = () => {
  return (
    <>
      <div className="pb-5 w-full grid mt-[-40px] md:grid-cols-2 gap-y-[20px] md:gap-y-[0px] gap-x-6 " >
        <div className="relative   "  >
            <img  src={pic} className="  rounded-lg flex-shrink-0 w-full object-cover h-[550px] sm:h-[700px] " />
            <div className="bg-white p-4 rounded-sm absolute bottom-6 left-6" > 
              <h1 className="font-[600] text-gray-900 text-xl "> Women&#39;s Collection </h1>  
              <button className=" cursor-pointer underline text-gray-900 " > 
              <Link to="/collections/all?gender=Women" > 
                Shop Now 
              </Link>
              </button>
            </div>
         </div>   

         <div className="relative  "  >
            <img  src={pic} alt="men-collection" className="  rounded-lg w-full flex-shrink-0 object-cover h-[550px] sm:h-[700px] " />
            <div className="bg-white p-4 rounded-sm absolute bottom-6 left-6" > 
              <h1 className="font-[600] text-gray-900 text-xl "> Men&#39;s Collection </h1>  
              <button className=" cursor-pointer underline text-gray-900 " > 
              <Link to="/collections/all?gender=Men" > 
                Shop Now 
              </Link>
              </button>
            </div>
         </div>  
      </div>  
    </>
  )
}

export default GenderCollectionSection



