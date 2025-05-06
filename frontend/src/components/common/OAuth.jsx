
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const OAuth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async ()=>{
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // Send user details to the backend
      const res = await fetch("https://stylenest-ax2d.onrender.com/api/googleAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
        }),
      });
        if (!res.ok) {
            throw new Error("Failed to log in");
        }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
      toast.success("Log in successful! Redirecting to home page...");
    //   dispatch(loggedInSuccess(data.user))
    
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
        <span> sign in with Google </span>
      </button>
    </div>
  );
};

export default OAuth;
