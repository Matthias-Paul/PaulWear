import pic from "../assets/pic.jpg";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom"


const VendorApplicationForm = () => {
      const navigate = useNavigate();
    const [ isUploading, setIsUploading] = useState(null)
    const [formData, setFormData] = useState({
        storeName:"",
        bio:"",
        storeLogo:"",
        businessCertificate:"",
        contactNumber:"",
        email:"",
        address:"",
        state:"",
        campus:"",        
    })

    const handleChange =(e) =>{
        const { name, value } = e.target

        setFormData((prevData) => ({...prevData, [name]: value }))

    }

        const handleImageUpload = async (e, fieldName) => {
            const file = e.target.files[0];

            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            setIsUploading(fieldName)
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
                });

                if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Image upload failed");
                  setIsUploading(null)

                }

                const data = await res.json();
                console.log("Uploaded image URL:", data.imageUrl);

                setFormData((prevData) => ({
                ...prevData,
                [fieldName]: data.imageUrl,
                }));
                setIsUploading(false)
            } catch (error) {
                console.error("Image upload error:", error.message);
                toast.error(error.message)
                  setIsUploading(null)

            }
            };


    const registrationMutation = useMutation({
    mutationFn: async ()=>{
  
      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/become-vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to register ");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
        toast.success(data.message, {
            duration: 8000,
        }); 
        console.log("details:", data.vendor);
      setFormData({
        storeName:"",
        bio:"",
        storeLogo:"",
        businessCertificate:"",
        contactNumber:"",
        email:"",
        address:"",
        state:"",
        campus:"",           
    })
      setTimeout(() => navigate("/profile"), 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },

  })

    const handleSubmit = async(e)=>{
        e.preventDefault()
        registrationMutation.mutate(formData);

        console.log(formData)
    }


  return (
    <>
    <div className=" pt-[110px]  " >
        <div className=" max-w-5xl  shadow-md rounded-md mb-30 px-[12px] sm:px-[40px] py-7 mx-auto " >
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 " > Vendor Application Form  </h1>
        <form onSubmit={handleSubmit} >
            <div className="mb-6  " >
                <label  className=" block font-semibold " > Store Name </label>
                <input required type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Bio </label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 resize-none " 
                    rows={4}
                    required
                />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Store Email </label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Phone Contact </label>
                <input required type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold "> Address </label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6 ">
                <label  className=" block font-semibold " > State </label>
                <input required type="text" name="state" value={formData.state}
                onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Campus </label>
                <input required type="text" name="campus" value={formData.campus}
                  onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " >Store Logo/Bannar  </label>
                <input required type="file" accept="image/>*"   onChange={(e) => handleImageUpload(e, "storeLogo")} className=" cursor-pointer mt-2 bg-gray p-1  "    />
                <div className="flex gap-4 mt-4   "> 
                    {isUploading ==="storeLogo" && (<div className="ml-3 text-sm text-gray-500" >  Uploading...  </div> )}  
                   {
                    formData.storeLogo && (
                         <img src={formData.storeLogo} alt="store logo" className="w-20 h-20 rounded-sm shadow-md object-cover flex-shrink-0 " />
                    )
                   }
                </div>
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " >Business Certificate (optional)  </label>
                <input type="file" accept="image/>*"   onChange={(e) => handleImageUpload(e, "businessCertificate")} className=" cursor-pointer mt-2 bg-gray p-1  "    />
                <div className="flex gap-4 mt-4   "> 
                    {isUploading ==="businessCertificate" && (<div className="ml-3 text-sm text-gray-500" >  Uploading...  </div> )} 
                   {
                    formData.businessCertificate && (
                         <img src={formData.businessCertificate} alt="business certificate" className="w-20 h-20 rounded-sm shadow-md object-cover flex-shrink-0 " />
                    )
                   }
                </div>
            </div>

            <button type="submit"  disabled={registrationMutation.isPending } className={`rounded w-full font-semibold text-lg ${registrationMutation.isPending  ? "bg-green-500 cursor-not-allowed text-white " : "bg-green-600 hover:bg-green-500 cursor-pointer text-white"} py-2 mt-5 text-center `} >
              {registrationMutation.isPending ? "Submiting..." : "Submit"}
            </button>
        </form>
      </div>

    </div>    
        
    </>
  )
}

export default VendorApplicationForm
