import {useEffect, useRef, useState } from "react"
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"
import { useNavigate, useSearchParams } from "react-router-dom";


const VendorSearchBar = () => {
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
      <div className=" flex items-end ">
        {isOpen ? (
          <div
            className={`flex   transition-all ${
              isOpen ? "absolute  w-full  top-17 md:top-4  left-0" : "w-auto"
            } duration-300 items-center justify-end   `}
          >
            <div ref={editRef}  className="w-full  relative md:w-[300px] flex justify-end mx-[12px]   ">
            <input
              type="text"
              className="w-full px-4 pr-10 py-2 text-black bg-gray-100 rounded-lg focus:outline-none"
              value={searchTerm}
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <button
                className="  right-2 top-[8px] absolute cursor-pointer "
              >
            <HiMagnifyingGlass className="w-5 h-5     " />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSearchToggle}
          
            className="bg-gray-900   text-white rounded-lg px-2 sm:px-3 py-1   cursor-pointer "
          >
            <HiMagnifyingGlass className="w-5 h-5     " />
          </button>
        )}
      </div>
    </>
  );
}

export default VendorSearchBar












