import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signInSuccess } from "../../redux/slice/userSlice.js";

import toast from "react-hot-toast";

const OAuth = () => {
  const { loginUser } = useSelector((state) => state.user);
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
