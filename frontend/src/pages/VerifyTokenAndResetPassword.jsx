import { useState } from "react";
import { Link } from "react-router-dom"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const VerifyTokenAndResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  console.log(email)

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPassword = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reset-password/verify-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            token,
            password,
            confirmPassword, 
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      setToken("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    if (!email) {
      toast.error("Please request for token in the reset password page");
      return; 
    }
  
    resetPassword.mutate(); 
  };
  

  return (
    <div className="py-[100px] lg:h-[900px] max-w-[1400px] relative mx-auto flex w-full">
      <div className="flex w-full px-[12px] justify-start items-center">
        <form
          onSubmit={handleFormSubmit}
          className="w-full border-gray-200 lg:w-1/2 px-5 sm:px-15 md:px-40 lg:px-20 rounded-lg pb-5 bg-white"
        >
          <div className="flex justify-center text-2xl mb-4 font-bold">StyleNest</div>
          <p className="text-center mb-4">
            Enter token, password and confirm password to recover your account
          </p>

          <div className="mb-6">
            <label htmlFor="token" className="block text-sm font-semibold mb-1">
              Token
            </label>
            <input
              id="token"
              placeholder="Enter Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border px-2 py-3 w-full border-gray-400 rounded-md"
              type="number"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              placeholder="Enter Your New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-2 py-3 w-full border-gray-400 rounded-md"
              type="password"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              placeholder="Enter Your Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border px-2 py-3 w-full border-gray-400 rounded-md"
              type="password"
            />
          </div>

          <button
            type="submit"
            disabled={resetPassword.isPending}
            className={`w-full text-lg mb-[-15px] mt-6 rounded-lg font-semibold p-3 ${
              resetPassword.isPending
                ? "bg-gray-800 cursor-not-allowed text-white"
                : "bg-black hover:bg-gray-800 cursor-pointer text-white"
            }`}
          >
            {resetPassword.isPending ? "Submitting..." : "Submit"}
          </button>

          <p className="mt-[15px] text-md text-center " >
              Remember password?
              <Link to="/login" className="text-blue-500 ml-1 " >
                  Login
              </Link>
            </p>

        </form>

        <div className="hidden absolute top-0 bottom-0 right-0 lg:flex w-1/2">
          <img
            className="w-full h-full flex-shrink-0 object-cover"
            src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1744396447/three-multicultural-women-street_i7k8dk.jpg"
            alt="Reset illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenAndResetPassword;
