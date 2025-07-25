import pic from "../assets/pic.jpg";
import OAuth from "../components/common/OAuth"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom"


const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [searchParams, setSearchParams] = useSearchParams()

  

 
  const requestTokenMutation = useMutation({
    mutationFn: async ()=>{
    
      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password/request-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email        
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to request token");
      }

      const data = await res.json();
        
      return data;
    },
    onSuccess: (data) => {
        toast.success(data.message);
        const searchParams = new URLSearchParams({ email });
        navigate(`/verifyToken/reset-password?${searchParams.toString()}`);
        setEmail("");
      },      
    onError: (error) => {
      toast.error(error.message);
    },

  })

  const handleFormSubmit = (e)=>{
    e.preventDefault()

    requestTokenMutation.mutate({ email });
    
  }

    


  return (
    <>
      <div className="py-[100px] lg:h-[700px] max-w-[1400px] relative mx-auto  flex w-full ">
        <div className=" flex w-full px-[12px] justify-start items-center ">
          <form onSubmit={handleFormSubmit} className="w-full  border-gray-200 lg:w-1/2  px-5 sm:px-15 md:px-40 lg:px-20 rounded-lg pb-5 bg-white ">
            <h2 className=" text-2xl font-bold text-center mt-4 mb-2 ">
              {" "}
              Forget Password{" "}
            </h2>
            <p className=" text-center mb-4 ">
              Enter your email to receive token
            </p>
            <div className="mb-6">
              <label id="email" className="block text-sm font-semibold mb-1 ">
                {" "}
                Email{" "}
              </label>
              <input
                id="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-2  py-3 w-full border-gray-400 rounded-md "
                type="email"
              />
            </div>

            <button
              type="submit"
              disabled={requestTokenMutation.isPending }
              className={`w-full text-lg mb-[-15px] rounded-lg font-semibold p-3 
                ${requestTokenMutation.isPending  ? "bg-gray-800 cursor-not-allowed text-white " : "bg-black hover:bg-gray-800 cursor-pointer text-white"}`}
            >
              {requestTokenMutation.isPending ? "Submitting..." : "Submit"}
            </button>

           
            <p className="mt-[15px] text-md text-center " >
              Remember password?
              <Link to="/login" className="text-blue-500 ml-1 " >
                  Login
              </Link>
            </p>
          </form>
          <div className=" hidden absolute top-0 bottom-0 right-0 lg:flex w-1/2  " >
            <img className="w-full h-full flex-shrink-0 object-cover " src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594443/pexels-ogproductionz-17243573_em61x8.jpg" /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordPage;


