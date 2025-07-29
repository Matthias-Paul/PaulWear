import pic from "../assets/pic.jpg";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VendorApplicationForm = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(null);
  const [formData, setFormData] = useState({
    storeName: "",
    bio: "",
    storeLogo: "",
    businessCertificate: "",
    contactNumber: "",
    email: "",
    address: "",
    state: "",
    campus: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(fieldName);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Image upload failed");
        setIsUploading(null);
      }

      const data = await res.json();
      console.log("Uploaded image URL:", data.imageUrl);

      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: data.imageUrl,
      }));
      setIsUploading(false);
    } catch (error) {
      console.error("Image upload error:", error.message);
      toast.error(error.message);
      setIsUploading(null);
    }
  };

  const registrationMutation = useMutation({
    mutationFn: async (filteredData) => {
      // Send user details to the backend
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/become-vendor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(filteredData),
        }
      );

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
        storeName: "",
        bio: "",
        storeLogo: "",
        businessCertificate: "",
        contactNumber: "",
        email: "",
        address: "",
        state: "",
        campus: "",
      });
      setTimeout(() => navigate("/profile"), 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove empty fields
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );

    registrationMutation.mutate(filteredData);

    console.log(filteredData);
  };

  return (
    <>
      <div className=" pt-[110px]  ">
        <div className=" max-w-5xl  shadow-md rounded-md mb-30 px-[12px] sm:px-[40px] py-7 mx-auto ">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 ">
            {" "}
            Vendor Application Form{" "}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6  ">
              <label className=" block font-semibold "> Store Name </label>
              <input
                required
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 "
              />
            </div>

            <div className="mb-6  ">
              <label className=" block font-semibold "> Bio </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 resize-none "
                rows={4}
                required
              />
            </div>

            <div className="mb-6  ">
              <label className=" block font-semibold "> Store Email </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 "
              />
            </div>

            <div className="mb-6  ">
              <label className=" block font-semibold "> Phone Contact </label>
              <input
                required
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 "
              />
            </div>

            <div className="mb-6  ">
              <label className=" block font-semibold "> Address </label>
              <input
                required
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 "
              />
            </div>

            <div className="mb-6 ">
              <label className=" block font-semibold "> State </label>
              <input
                required
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 "
              />
            </div>

            <div className="mb-6  ">
              <label className=" block font-semibold "> Campus </label>
              <input
                required
                type="text"
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 "
              />
            </div>

            <div className="space-y-6">
              {/* Store Logo / Banner */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Store Logo / Banner <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "storeLogo")}
                      className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-600
                     hover:file:bg-indigo-100 cursor-pointer"
                    />
                    {isUploading === "storeLogo" && (
                      <p className="mt-2 text-xs text-gray-500">Uploading...</p>
                    )}
                  </div>

                  {formData.storeLogo && (
                    <img
                      src={formData.storeLogo}
                      alt="Store Logo"
                      className="w-20 h-20 rounded-md shadow-md object-cover border border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Business Certificate */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Certificate{" "}
                  <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, "businessCertificate")
                      }
                      className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-600
                     hover:file:bg-indigo-100 cursor-pointer"
                    />
                    {isUploading === "businessCertificate" && (
                      <p className="mt-2 text-xs text-gray-500">Uploading...</p>
                    )}
                  </div>

                  {formData.businessCertificate && (
                    <img
                      src={formData.businessCertificate}
                      alt="Business Certificate"
                      className="w-20 h-20 rounded-md shadow-md object-cover border border-gray-200"
                    />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={registrationMutation.isPending}
              className={`rounded w-full font-semibold text-lg ${
                registrationMutation.isPending
                  ? "bg-green-500 cursor-not-allowed text-white "
                  : "bg-green-600 hover:bg-green-500 cursor-pointer text-white"
              } py-2 mt-5 text-center `}
            >
              {registrationMutation.isPending ? "Submiting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VendorApplicationForm;
