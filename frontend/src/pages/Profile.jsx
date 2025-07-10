import MyOrdersPage from "./MyOrdersPage"
import { useDispatch, useSelector } from "react-redux";
import { logOutSuccess } from "../redux/slice/userSlice.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"

const Profile = () => {

  const dispatch = useDispatch();
  const { loginUser } = useSelector((state) => state.user);

  const handleLogOut = async () => {

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to log out");
      }

      dispatch(logOutSuccess());
      toast.success("Log out successful!");

    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px]   min-h-full pb-40  flex flex-col " >
            <div className=" flex-grow   " >
                <div className="flex  flex-col md:gap-x-6 md:flex-row  md:gap-y-6  ">
                    {/* Left section */}
                    <div className="md:w-[220px] lg:w-1/4 mb-[-95px] z-100 lg:mb-0 mx-[12px] md:mx-0 pt-[115px] shadow-md md p-6 rounded-lg " >
                            <h1 className=" text-2xl lg:text-3xl truncate font-semibold mb-3 " > {loginUser?.name} </h1>
                            <p className="text-gray-600 text-lg mb-4 truncate " > { loginUser?.email} </p>
                            {
                              loginUser.role ==="customer" &&(
                               <Link to="/vendor-application" > <button   className="rounded w-full py-2 bg-green-600 hover:bg-green-500 my-4 text-white cursor-pointer "  >  Become A Vendor  </button> </Link>
                              )
                            }
                            
                            <button onClick={handleLogOut} className="rounded w-full py-2 bg-red-600 hover:bg-red-500 text-white cursor-pointer     " > Log Out </button>
                    </div>   
                     {/*Right sections: orders table  */}
                        <div className="w-full  mx-auto md:w-2/3 lg:w-3/4   " >
                            <MyOrdersPage />

                        </div>    

                 </div>   
            </div>
     </div>   
    </>
  )
}

export default Profile
