import { useState } from "react"
import { useSearchParams } from "react-router-dom"

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ filters, setFilters] = useState({
    category:"",
    gender:"",
    color:"",
    size:[],
    material:[],
    brand:[],
    minPrice:0,
    maxPrice:100
  })

  const [priceRange, setPriceRange] = useState([0, 100])
  const categories = ["Top Wear", "Bottom Wear"]
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
  





  return (
    <>
      <div className=" w-full  bg-red-400 z-50  " >
        Filter
      </div>
    </>
  )
}

export default FilterSidebar
