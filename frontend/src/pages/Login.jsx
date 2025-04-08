import pic from "../assets/pic.jpg";


import { useState } from "react";
import { Link } from "react-router-dom"
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="py-[100px] h-full max-w-[1400px] relative mx-auto  flex w-full ">
        <div className=" flex w-full px-[12px] justify-start items-center ">
          <form className="w-full border-gray-200 lg:w-1/2  px-8 sm:px-15 md:px-30 lg:px-15 rounded-lg pb-5 bg-white ">
            <div className="flex  justify-center text-xl mb-4 font-medium  ">
              StyleNest
            </div>
            <h2 className=" text-2xl font-bold text-center mb-2 ">
              {" "}
              Hey there!{" "}
            </h2>
            <p className=" text-center mb-4 ">
              Enter your username and password to login
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

            <div className="mb-3">
              <label id="password" className="block text-sm font-semibold mb-1 ">
                {" "}
                Password{" "}
              </label>
              <input
                id="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-2 py-3 w-full border-gray-400 rounded-md "
                type="password"
              />
            </div>

            <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white cursor-pointer my-6 text-lg  rounded-lg font-semibold p-3  " >
              Sign In
            </button>
            <p className="mt-[-12px] text-md text-center " >
              Don't have an account?
              <Link to="/register" className="text-blue-500 ml-1 " >
                  Register
              </Link>
            </p>
          </form>
          <div className=" hidden absolute top-0 bottom-0 right-0 lg:flex w-1/2  " >
            <img className="w-full h-full flex-shrink-0 object-cover " src={pic} /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
