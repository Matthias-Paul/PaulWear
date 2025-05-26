import pic from "../../assets/pic.jpg"
import { Link } from "react-router-dom";



const CategoryGrid = () => {
  return (
    <>
        <div>
        <div className="grid grid-cols-1 gap-x-[10px] pt-7 gap-y-[10px] sm:grid-cols-2 lg:grid-cols-4  ">
          
          <div  className=" p-2  block  ">
            <Link to={`/category/fashion-apparel`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3 w-full flex-shrink-0 h-85 sm:h-70 " src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium " >  Fashion And Apparel </div>
              </div>
            </Link>
          </div>


          <div  className=" p-2  block  ">
            <Link to={`/category/hair-beauty-product`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3 w-full flex-shrink-0 h-85 sm:h-70 " src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium " > Hair And Beauty Products </div>
              </div>
            </Link>
          </div>

          <div  className=" p-2  block  ">
            <Link to={`/category/bag-accessories`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3  w-full flex-shrink-0 h-85 sm:h-70" src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium " > Bags And Accessories </div>
              </div>
            </Link>
          </div>

          <div  className=" p-2  block  ">
            <Link to={`/category/baked-goods-snacks`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3 w-full flex-shrink-0 h-85 sm:h-70 " src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium " >  Baked Goods And Snacks </div>
              </div>
            </Link>
          </div>

          <div  className=" p-2  block  ">
            <Link to={`/category/beverages`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3  w-full flex-shrink-0 h-85 sm:h-70 " src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium " >  Beverages </div>
              </div>
            </Link>
          </div>

          <div  className=" p-2  block  ">
            <Link to={`/category/foodstuff-provisions`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3 w-full flex-shrink-0 h-85 sm:h-70 " src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium " > Foodstuff And Provisions </div>
              </div>
            </Link>
          </div>

          <div  className=" p-2  block  ">
            <Link to={`/category/health-personal-care-products`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3  w-full flex-shrink-0 h-85 sm:h-70" src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium  truncate " > Health and Personal Care Products</div>
              </div>
            </Link>
          </div>

          <div  className=" p-2  block  ">
            <Link to={`/category/others`}>
              <div className="w-full bg-gray-200 rounded-md p-2  mb-4 ">
                <img className="object-cover mb-3  w-full flex-shrink-0 h-85 sm:h-70 " src={pic} alt="Fashion And Apparel " />
                <div className="text-lg text-center mb-1 font-medium  " >  Others </div>
              </div>
            </Link>
          </div>




      </div>

        </div>    
    </>
  )
}

export default CategoryGrid