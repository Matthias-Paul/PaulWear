import {useEffect, useRef, useState } from "react"
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"
import { useNavigate, useSearchParams } from "react-router-dom";


const SearchBar = () => {
  const editRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSearchToggle = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchTerm(currentSearch);
  }, [searchParams]);

  // Auto-close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }
      navigate({ search: params.toString() }, { replace: true });
    }, 300); 

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <>
      <div className=" flex  items-center ">
        {isOpen ? (
          <div
            className={`flex  transition-all ${
              isOpen ? "absolute w-full  top-10.5 sm:top-12 z-50 left-0" : "w-auto"
            } duration-300 items-center justify-center   `}
          >
            <div ref={editRef}  className="w-full  relative md:w-1/2 mx-[12px] ">
              <input
                
                type="text"
                className="px-4 pr-[30px] w-full bg-gray-100 focus:outline-none rounded-lg py-[7px] pl-[8px] "
                value={searchTerm}
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className=" right-2 top-[8px] absolute cursor-pointer "
              >
            <HiMagnifyingGlass className="w-5 h-5     " />
              </button>
            </div>
          </div>
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












