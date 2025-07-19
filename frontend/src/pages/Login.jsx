import pic from "../assets/pic.jpg";
import OAuth from "../components/common/OAuth"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { signInSuccess, setMyCart, setCartQuantity, generateNewGuestId }from "../redux/slice/userSlice.js"; 
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginUser, guestId } = useSelector((state) => state.user);
  const queryClient = useQueryClient();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  // Mutation to merge carts after login
  const mergeCartMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ guestId }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to merge cart");
      }

      const data = await res.json();
      return data.cart;
    },
    onSuccess: (mergedCart) => {
      dispatch(setMyCart(mergedCart.products));
      dispatch(setCartQuantity(mergedCart.products.reduce((acc, item) => acc + item.quantity, 0)));
             
      dispatch(generateNewGuestId());
       const key = loginUser?.id
        ? ["cart", "user", loginUser.id]
        : ["cart", "guest", guestId];

        queryClient.invalidateQueries(key);
    },
    onError: (error) => {
      console.log("Cart merge failed: " + error.message);
    },
  });

  const handleMerge = async () => {
          console.log("guestId:", guestId)
          console.log("Hello world")
          if (guestId) {
            try {
              await mergeCartMutation.mutateAsync();
            } catch (error) {
              console.log(error.message)
            }
          }
        };
  const loginMutation = useMutation({
    mutationFn: async ()=>{
  
      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to log in");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
      toast.success("Log in successful! Redirecting to home page...");
      dispatch(signInSuccess(data.user))
      console.log("login user:", data.user);
      setEmail("")
      setPassword("")
       handleMerge()
      setTimeout(() => navigate("/"), 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },

  })

  console.log("guestId:", guestId)
  const handleFormSubmit = (e)=>{
    e.preventDefault()

    loginMutation.mutate({ email, password });
    
  }
   

  return (
    <>
      <div className="py-[100px] lg:h-[800px] max-w-[1400px] relative mx-auto  flex w-full ">
        <div className=" flex w-full px-[12px] justify-start items-center ">
          <form onSubmit={handleFormSubmit} className="w-full  border-gray-200 lg:w-1/2  px-5 sm:px-15 md:px-40 lg:px-20 rounded-lg pb-5 bg-white ">
            <div className="flex  justify-center text-2xl mb-4  font-semibold  ">
              Wellcome To StyleNest
            </div>
    
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

            <Link to="/forget-password" className="text-blue-600 "  >
                Forget Password?
            </Link>

            <button
              type="submit"
              disabled={loginMutation.isPending }
              className={`w-full text-lg mb-[-15px] mt-4 rounded-lg font-semibold p-3 
                ${loginMutation.isPending  ? "bg-gray-800 cursor-not-allowed text-white " : "bg-black hover:bg-gray-800 cursor-pointer text-white"}`}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </button>

           
            {/* google auth button */}
            < OAuth />

            <p className="mt-[-12px] text-md text-center " >
              Don't have an account?
              <Link to="/register" className="text-blue-500 ml-1 " >
                  Register
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

export default Login;
