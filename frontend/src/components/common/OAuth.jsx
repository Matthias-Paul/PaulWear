import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { signInSuccess, setMyCart, setCartQuantity, generateNewGuestId } from "../../redux/slice/userSlice.js";

import toast from "react-hot-toast";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginUser, guestId } = useSelector((state) => state.user);
  const queryClient = useQueryClient();


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
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/googleAuth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googleUID: resultsFromGoogle.user.uid,

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
      handleMerge()

      setTimeout(() => navigate("/"), 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },

  })

  const handleClick = async (e) => {
     loginMutation.mutate();
  };
  

  return (
    <div>
      <button
        onClick={handleClick}
        type="button"
        className="w-full bg-black hover:bg-gray-800 flex items-center justify-center  text-white cursor-pointer my-6 text-lg  rounded-lg font-semibold p-3 "
      >
        <FcGoogle className="w-7 h-7 mr-2 inline" />
        <span> Continue with Google </span>
      </button>
    </div>
  );
};

export default OAuth;
