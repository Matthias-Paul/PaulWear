import MyOrdersPage from "./MyOrdersPage"
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {

  const dispatch = useDispatch();
  const { loginUser } = useSelector((state) => state.user);

  return (
    <>
      <div className="mx-auto max-w-[1400px]   min-h-full pb-40  flex flex-col " >
            <div className=" flex-grow   " >
                <div className="flex  flex-col md:gap-x-6 md:flex-row gap-y-6 md:gap-y-6  ">
                    {/* Left section */}
                    <div className="md:w-[220px] lg:w-1/4 mb-[-95px] lg:mb-0 mx-[12px] md:mx-0 pt-[115px] shadow-md md p-6 rounded-lg " >
                            <h1 className=" text-2xl lg:text-3xl truncate font-semibold mb-3 " > {loginUser?.name} </h1>
                            <p className="text-gray-600 text-lg mb-4 truncate " > { loginUser?.email} </p>
                            <button className="rounded w-full py-2 bg-red-600 hover:bg-red-500 text-white cursor-pointer     " > Log Out </button>
                    </div>   
                     {/*Right sections: orders table  */}
                        <div className="w-full mx-auto md:w-2/3 lg:w-3/4   " >
                            <MyOrdersPage />

                        </div>    

                 </div>   
            </div>
     </div>   
    </>
  )
}

export default Profile
