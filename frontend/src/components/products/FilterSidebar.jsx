import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"


const FilterSidebar = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [ filters, setFilters] = useState({
    category:"",
    gender:"",
    color:"",
    size:[],
    minPrice:0,
    maxPrice:100
  })

  const [priceRange, setPriceRange] = useState([0, 100])
  const categories = ["Fashion And Apparel", "Hair And Beauty Products", "Bags And Accessories", "Baked Goods And Snacks", "Electronics And Gadgets", "Foodstuff And Provisions","Others"]
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Biege",
    "Navy"
  ]

  const sizes =["XS", "S", "M", "L", "XL", "XXL"];
  


  const genders = ["Men", "Women", "Unisex"]

  useEffect(() => {
      const params = Object.fromEntries([...searchParams])

      const min = params.minPrice ? Number(params.minPrice) : 0;
      const max = params.maxPrice ? Number(params.maxPrice) : undefined;
      
      setFilters({ 
        category: params.category || "",
        gender: params.gender || "",
        color: params.color || "",
        size: params.size ? params.size.split(",") : [],
        minPrice: min,
        maxPrice: max,
      });
      
      if (max !== undefined) {
        setPriceRange([0, max]);
      }
      
  }, [searchParams]);

const handleFilterChange = (e) => {
  const { name, value, type, checked } = e.target;
  console.log({ name, value, type, checked });

  setFilters((prevFilters) => {
    let newFilters;

    if (type === "checkbox") {
      newFilters = {
        ...prevFilters,
        [name]: checked
          ? [...prevFilters[name], value]
          : prevFilters[name].filter((item) => item !== value),
      };
    } else if (type === "radio") {
      newFilters = {
        ...prevFilters,
        [name]: value,
      };
    } else if (type === "range") {
      const newPrice = Number(value);
      setPriceRange([0, newPrice]);
      console.log(newPrice);

      newFilters = {
        ...prevFilters,
        maxPrice: newPrice,
      };
    } else {
      newFilters = prevFilters;
    }

    updateURLParams(newFilters);

    return newFilters;
  });
};

console.log(filters)

const updateURLParams = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (Array.isArray(filters[key]) && filters[key].length > 0) {
      params.set(key, filters[key].join(","));
    } else if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
      if (key === "maxPrice" && Number(filters[key]) === 100) return;
      if (key === "minPrice" && Number(filters[key]) === 0) return;
      params.set(key, filters[key]);
    }
  });
  setSearchParams(params);
};



  return (
    <>
      <div className=" pt-3" >
        <h1 className="text-xl  mb-3 font-medium text-gray-800  " > Filter</h1>
        {/* category filter */}
        <div className="mb-6" >
          <label className="block mb-2 font-medium text-gray-600  " > Category </label>
            { categories.map((category)=>(
              <div key={category} className="flex items-center mb-1 "  >
                <input checked={filters.category === category} value={category} onChange={handleFilterChange} type="radio" name="category" className="text-blue-500 cursor-pointer mr-2 w-4 h-4 border-gray-300 focus:ring-blue-400 " />
                <span className="text-gray-700" > {category} </span>
              </div>  
            ))  }
        </div>  


          {/* gender filter */}
        <div className="mb-6" >
          <label className="block mb-2 font-medium text-gray-600  " > Gender </label>
            { genders.map((gender)=>(
              <div key={gender} className="flex items-center mb-1 "  >
                <input checked={filters.gender === gender} value={gender} onChange={handleFilterChange} type="radio" name="gender" className="text-blue-500 cursor-pointer mr-2 w-4 h-4 border-gray-300 focus:ring-blue-400 " />
                <span className="text-gray-700"> { gender } </span>
              </div>  
            ))  }
        </div>  

           {/* color filter */}
        <div className="mb-6" >
          <label className="block mb-2 font-medium text-gray-600 " > Color </label>
          
              <div className="flex flex-wrap gap-2 "  >
                      {colors.map((color) => (
                        <label key={color}>
                          <input
                            type="radio"
                            checked={filters.color === color}
                            name="color"
                            value={color}
                            onChange={handleFilterChange}
                            className="hidden"
                          />
                          <div
                            style={{ backgroundColor: color.toLowerCase() }}
                            className={`w-8 h-8 rounded-full border-[0.5px] border-gray-700 cursor-pointer ${
                              filters.color === color ? "ring-2 ring-black" : ""
                            }`}
                          ></div>
                        </label>
                      ))}

              </div>  
        
        </div>  

         {/* size filter */}
        <div className="mb-6" >
          <label className="block mb-2 font-medium text-gray-600 " > Size </label>
          
           { sizes.map((size)=>(
              <div key={size} className="flex items-center mb-1 "  >
                <input value={size} checked={filters.size.includes(size)} onChange={handleFilterChange} type="checkbox" name="size" className="text-blue-500 cursor-pointer mr-2 w-4 h-4 border-gray-300 focus:ring-blue-400 " />
                <span className="text-gray-700"> { size } </span>
              </div>  
            ))  }
        </div>  

          {/* price range filter */}
        <div className="mb-16" >
          <label className="block mb-2 font-medium text-gray-600 " > Price Range Filter </label>
                 <input
                  value={priceRange[1]}
                  onChange={handleFilterChange}
                  type="range"
                  name="maxPrice"
                  min={0}
                  max={100}
                  className="cursor-pointer w-full h-2 bg-gray-300"
                />
                <div className="flex justify-between text-gray-700  " >
                <span > $0 </span>
                <span > ${priceRange[1]}</span>

                </div>
        </div>  


      </div>
    </>
  )
}

export default FilterSidebar
