import { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="py-[100px] h-full max-w-[1400px] mx-auto  flex w-full ">
        <div className=" flex flex-col w-1/2 px-[12px] justify-center items-center ">
          <form className="w-full border-gray-200 border px-15 rounded-lg shadow-md bg-white ">
            <div className="flex justify-center text-xl mb-3 font-medium  ">
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
                className="border px-2  py-2 w-full border-gray-400 rounded-md "
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
                className="border px-2 py-2 w-full border-gray-400 rounded-md "
                type="password"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
