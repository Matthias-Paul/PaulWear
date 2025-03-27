import {useEffect, useRef, useState } from "react"
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"
const SearchBar = () => {
    const editRef = useRef(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleSearchToggle = ()=>{
        setIsOpen(true)
    }

    
  const handleClickOutside = (event) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };    

  // Attach event listener for outside clicks
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

    const handleSearch = (e)=>{
        e.preventDefault()
        console.log("Search term:", searchTerm)
        setSearchTerm("")
    }

  return (
    <>
      <div className=" flex  items-center ">
        {isOpen ? (
          <form
        
            onSubmit={handleSearch}
            className={`flex transition-all ${
              isOpen ? "absolute w-full top-12 z-50 left-0" : "w-auto"
            } duration-300 items-center justify-center   `}
          >
            <div ref={editRef}  className="w-full relative sm:w-1/2 mx-[12px] ">
              <input
                
                type="text"
                className="px-4 pr-[30px] w-full bg-gray-100 focus:outline-none rounded-lg py-[7px] pl-[4px] "
                value={searchTerm}
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className=" right-2 top-[8px] absolute cursor-pointer "
              >
            <HiMagnifyingGlass className="w-5 h-5     " />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={handleSearchToggle}
          
            className="   cursor-pointer "
          >
            <HiMagnifyingGlass className="w-5 h-5     " />
          </button>
        )}
      </div>
    </>
  );
}

export default SearchBar












