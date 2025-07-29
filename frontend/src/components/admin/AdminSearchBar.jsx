import { useEffect, useRef, useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminSearchBar = () => {
  const editRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchTerm(currentSearch);
  }, [searchParams]);

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
        <div
          className={`flex  transition-all absolute w-full  top-29 md:top-16 z-50 left-0 duration-300 items-center justify-center   `}
        >
          <div ref={editRef} className="w-full  relative md:ml-[290px] lg:ml-[350px] mx-[12px] ">
            <input
              type="text"
              className=" pr-[30px] w-full bg-gray-100 lg:text-xl focus:outline-none rounded-lg py-[10px] lg:py-[13px] pl-[8px] "
              value={searchTerm}
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className=" right-2 top-[10px] lg:top-[18px] absolute cursor-pointer ">
              <HiMagnifyingGlass className="w-5 h-5     " />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSearchBar;
