import MyOrdersPage from "./MyOrdersPage"

const Profile = () => {
  return (
    <>
      <div className="mx-auto pt-[90px] px-[12px] max-w-[1400px] min-h-screen  flex flex-col " >
            <div className=" flex-grow container  " >
                <div className="flex flex-col md:gap-x-6 md:flex-row gap-y-6 md:gap-y-6  ">
                    {/* Left section */}
                    <div className="w-full md:w-1/3 lg:w-1/4 shadow-md md p-6 rounded-lg " >
                            <h1 className=" text-2xl md:text-3xl font-semibold mb-3 " > Adesina Paul </h1>
                            <p className="text-gray-600 text-lg mb-4 " > paul@gamil.com </p>
                            <button className="rounded w-full py-2 bg-red-600 hover:bg-red-500 text-white cursor-pointer     " > Log Out </button>
                    </div>   
                     {/*Right sections: orders table  */}
                        <div className="w-full md:w-2/3 lg:w-3/4   " >
                            <MyOrdersPage />

                        </div>    

                 </div>   
            </div>
     </div>   
    </>
  )
}

export default Profile
