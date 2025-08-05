import OAuth from "../components/common/OAuth"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query";
import { signInSuccess } from "../redux/slice/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Register = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginUser } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const registerMutation = useMutation({
    mutationFn: async ()=>{
  
      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
      toast.success("Sign up successful!");
      dispatch(signInSuccess(data.user))
      console.log("login user:", data.user);
      setName("")
      setEmail("")
      setPassword("")
      setTimeout(() => navigate("/"), 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },

  })


  const handleFormSubmit = (e)=>{
    e.preventDefault()
    registerMutation.mutate({ name, email, password });
    
  }
        
  return (
    <>
      <div className="py-[100px] lg:h-[900px] max-w-[1400px] relative mx-auto  flex w-full ">
        <div className=" flex w-full px-[12px] justify-start items-center ">
          <form onSubmit={handleFormSubmit} className="w-full  border-gray-200 lg:w-1/2  px-5 sm:px-15 md:px-40 lg:px-20 rounded-lg pb-5 bg-white ">
            <div className="flex  justify-center text-2xl mb-4 font-semibold  ">
              StyleNest
            </div>
           
            <p className=" text-center mb-4 ">
              Enter your name, username and password to register
            </p>
               <div className="mb-6">
              <label id="name" className="block text-sm font-semibold mb-1 ">
                {" "}
                Name{" "}
              </label>
              <input
                id="name"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-2  py-3 w-full border-gray-400 rounded-md "
                type="text"
              />
            </div>

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

            <div className="mb-3">
              <label id="password" className="block text-sm font-semibold mb-1 ">
                {" "}
                Password{" "}
              </label>
              <div className="relative">
                <input
                  id="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border px-2 py-3 w-full border-gray-400 rounded-md pr-10"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending }
              className={`w-full text-lg mb-[-15px] mt-6 rounded-lg font-semibold p-3 
                ${registerMutation.isPending  ? "bg-gray-800 cursor-not-allowed text-white " : "bg-black hover:bg-gray-800 cursor-pointer text-white"}`}
            >
              {registerMutation.isPending ? "Signing Up..." : "Sign Up"}
            </button>

             {/* google auth button */}
            < OAuth />

            <p className="mt-[-12px] text-md text-center " >
              Already have an account?
              <Link to="/login" className="text-blue-500 ml-1 " >
                  Log In
              </Link>
            </p>
          </form>
          <div className=" hidden absolute top-0 bottom-0 right-0 lg:flex w-1/2  " >
            <img className="w-full h-full flex-shrink-0 object-cover " src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1744396447/three-multicultural-women-street_i7k8dk.jpg" /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
