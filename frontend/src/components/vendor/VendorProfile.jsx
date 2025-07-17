import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";


const VendorProfile = () => {

    const [isEdit, setIsEdit ] = useState(false)
    const navigate = useNavigate()
    

    const fetchStoreDetails = async()=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor-profile`,{
            method:"GET",
            credentials:"include"
        })
        if(!res.ok){
            throw new Error("Failed to fetch store profile")
        }
        return res.json()
    }

    const { data, isLoading, error} = useQuery({
        queryKey:["profileDetails"],
        queryFn:fetchStoreDetails
    })

    console.log(data)

    function formatDateWithSuffix(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
      
        return `${day} ${month}, ${year}`;
      }

    if (isLoading) return <p className="text-start text-md pt-[70px] md:pt-10">Loading your profile details...</p>;
    if (error) return <p className="text-red-500 text-start pt-[70px] md:pt-10">{error.message}</p>;

  return (
    <>
      <div className="mx-auto pt-[70px] md:pt-[10px] pr-3 md:pr-0 pb-15 w-full" >


        <div>
        <div className="flex justify-between items-start text-gray-900 " >
            <h1 className="text-xl md:text-2xl font-bold mb-6">Store  Profile</h1>
            <Link className="cursor-pointer  bg-gray-900 text-sm md:text-[16px] text-white px-2 py-1 rounded "  to={`edit/${data?.vendor?.storeSlug}`} > Edit Profile </Link>
        </div>
          {/* Store Banner */}
      <div className="bg-white   rounded shadow p-5 mb-6 flex flex-col md:flex-row gap-6">
        <img
          src={data?.vendor?.storeLogo}
          alt="Store Logo"
          className="w-35 h-35 rounded-full object-cover "
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{data?.vendor?.storeName}</h2>
          <p className="text-gray-600">@{data?.vendor?.storeSlug}</p>
          <p className="text-sm text-gray-500 mt-2">
            {data?.vendor?.bio }
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6 text-gray-800">
        <div>
          <h3 className="font-semibold"> Contact Number:</h3>
          <p>{data?.vendor?.contactNumber}</p>
        </div>

        <div>
          <h3 className="font-semibold"> Email:</h3>
          <p>{data?.vendor?.email}</p>
        </div>

        <div>
          <h3 className="font-semibold"> Address:</h3>
          <p>{data?.vendor?.address}, {data?.vendor?.campus}, {data?.vendor?.state}</p>
        </div>


        <div>
          <h3 className="font-semibold"> Business Certificate:</h3>
          <p>{data?.vendor?.businessCertificate ? (
            <img
            src={data?.vendor?.businessCertificate}
            alt="Business Certificate Image"
            className="w-42 h-32 object-cover rounded-md "
          />  ) : (
            "Not Uploaded"
          )}</p>
        </div>


        <div>
          <h3 className="font-semibold"> Verified Status:</h3>
          <p className="flex items-center gap-2">
            {data?.vendor?.isVerified ? (
              <>
                <FaCheckCircle className="text-green-600" />
                Verified
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-600" />
                Not Verified
              </>
            )}
          </p>
        </div>

        <div>
          <h3 className="font-semibold"> Approval Status:</h3>
          <p className="capitalize">{data?.vendor?.status}</p>
        </div>

        <div>
          <h3 className="font-semibold"> Joined:</h3>
          <p> {formatDateWithSuffix(data?.vendor?.createdAt)}</p>
        </div>

        <div>
          <h3 className="font-semibold"> Rating:</h3>
          <p className="">{data?.vendor?.rating}</p>
        </div>

      </div>

      </div>

      </div>
    </>
  );
}

export default VendorProfile;
