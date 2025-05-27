import { useSearchParams } from "react-router-dom"

const SortOptions = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const handleSortChange = (e)=>{
      const sortBy = e.target.value
      searchParams.set("sortBy", sortBy)
      setSearchParams(searchParams)
    }

  return (
    <>
      <div className="justify-end flex mb-[-20px] " >
        <select onChange={handleSortChange} value={searchParams.get("sortBy") } id="sort" className="p-2 lg:p-3 border border-gray-500 cursor-pointer rounded-md focus:outline-none  " >
          <option value="" >  Default </option>
          <option value="priceAsc" >  Price: Low To High </option>
          <option value="priceDesc" >  Price: High To Low </option>
          <option value="popularity" >  Popularity </option>

        </select>
      </div>
    </>
  )
}

export default SortOptions
