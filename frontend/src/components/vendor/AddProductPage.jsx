import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import toast from "react-hot-toast";
import {  useNavigate, Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa";


const AddProductPage = () => {
      const navigate = useNavigate();
      const [uploadingStates, setUploadingStates] = useState([false, false, false]);
      const [formData, setFormData] = useState({
        name:"",
        description:"",
        images: [{ url: "" }],
        price:"",
        category:"",
        sizes:[],
        colors:[], 
        gender:""       
    })

    const handleChange =(e) =>{
        const { name, value } = e.target

        setFormData((prevData) => ({...prevData, [name]: value }))

    }

    const handleImageUpload = async (e, index) => {
      const file = e.target.files[0];
      if (!file) return;
    
      const imgForm = new FormData();
      imgForm.append("image", file);
    
      // Set uploading true for this index
      setUploadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = true;
        return newStates;
      });
    
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
          method: "POST",
          credentials: "include",
          body: imgForm,
        });
    
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Image upload failed");
        }
    
        const data = await res.json();
        const newImages = [...formData.images];
    
        while (newImages.length < 3) {
          newImages.push({ url: "" });
        }
    
        newImages[index] = { url: data.imageUrl };
    
        setFormData((prev) => ({ ...prev, images: newImages }));
      } catch (error) {
        toast.error(error.message);
      } finally {
        // Set uploading false for this index
        setUploadingStates((prev) => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }
    };
    
    

            const categoriesWithoutSizesOrColors = [
                "Foodstuff And Provisions",
                "Health and Personal Care Products",
                "Baked Goods And Snacks",
                "Others"
              ];
              
    const addProductMutation = useMutation({
    mutationFn: async (filteredFormData)=>{
  
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(filteredFormData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add product ");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
        toast.success(data.message)
        console.log("details:", data.vendor);
      setFormData({
        name:"",
        description:"",
        images: [{ url: "" }],
        price:"",
        category:"",
        sizes:[],
        colors:[], 
        gender:""          
    })
      setTimeout(() => navigate("/vendor/products"), 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },

  })

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (categoriesWithoutSizesOrColors.includes(formData.category)) {
      setFormData((prev) => ({
        ...prev,
        sizes: ["General"],
        colors: ["General"],
      }));
    }
  
    if (!formData.images[0]?.url || !formData.images[1]?.url || !formData.images[2]?.url) {
      toast.error("Please upload three images");
      return;
    }
  
    const filteredFormData = {
      ...formData,
      images: formData.images.filter((img) => img.url !== ""),
    };
  
    addProductMutation.mutate(filteredFormData);
  
    console.log("filteredFormData", filteredFormData);
  };
  


  return (
    <>
    <div className=" pt-[50px] md:pt-0  " >
                    <div className="mb-2 max-w-[5rem]  " >    
                        <Link to={`/vendor/products`}  className=" flex items-center  gap-x-1 md:text-lg  text-gray-900 pt-4 hover:underline" >
                         <FaArrowLeft />
                          Back 
                        </Link>
                    </div>
        <div className=" max-w-5xl mx-auto  shadow-md rounded-md mb-30 pr-[12px]  pb-7 mx-auto " >

                    
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900 " > Add Product To Store  </h1>
        <form onSubmit={handleSubmit} >
            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product Name </label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Description </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 resize-none " 
                    rows={4}
                    required
                />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product category </label>
                <select onChange={(e)=> setFormData((prev)=>({ ...prev, category:e.target.value }) )} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " >
                    <option value="" > Select a category </option>
                    <option value="Fashion And Apparel" >Fashion And Apparel </option>
                    <option value="Hair And Beauty Products" > Hair And Beauty Products </option>
                    <option value="Bags And Accessories" > Bags And Accessories </option>
                    <option value="Baked Goods And Snacks" > Baked Goods And Snacks </option>
                    <option value="Electronics And Gadgets" >Electronics And Gadgets( phones, laptops etc ) </option>
                    <option value="Foodstuff And Provisions" > Foodstuff And Provisions </option>
                    <option value="Health and Personal Care Products" > Health and Personal Care Products </option>
                    <option value="Others" > Others </option>

                </select>        
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Price ( Plus delivery fee ) </label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>


            {!categoriesWithoutSizesOrColors.includes(formData.category) && (
  <div>
    <div className="mb-6">
      <label className="block font-semibold"> Product sizes (comma-separated) </label>
      <input
        required
        type="text"
        name="sizes"
        value={formData.sizes.join(", ")}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            sizes: e.target.value.split(",").map((si) => si.trim()),
          }))
        }
        className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2"
      />
    </div>

    <div className="mb-6">
      <label className="block font-semibold"> Product colors (comma-separated) </label>
      <input
        required
        type="text"
        name="colors"
        value={formData.colors.join(", ")}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            colors: e.target.value.split(",").map((si) => si.trim()),
          }))
        }
        className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2"
      />
    </div>
  </div>
)}




            


            <div className="mb-6 ">
                <label  className=" block font-semibold " > Gender </label>
                <select onChange={(e)=> setFormData((prev)=>({ ...prev, gender:e.target.value }) )} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " >
                    <option value="" > Select gender </option>
                    <option value="Men" >Men </option>
                    <option value="Women" > Women </option>
                    <option value="Unisex" > Unisex </option>

                </select>
           </div>

            

           <div className="mb-6">
                <label className="block font-semibold mb-1">Product Image 1</label>
                <p className="text-sm text-gray-500 mb-2">
                    Upload a clear, high-quality image (max 20MB). This is what buyers will see first!
                </p>

                <label
                    htmlFor="imageUpload1"
                    className="flex items-center justify-center h-50 sm:h-70 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-green-500 transition"
                >
                    {formData?.images[0]?.url ? (
                    <img
                        src={formData.images[0].url}
                        alt="Product Preview"
                        className="object-cover h-full w-full rounded-md"
                    />
                    ) : (
                    <span className="text-gray-500 text-sm">Click to upload product image</span>
                    )}
                </label>

                <input
                  id="imageUpload1"
                  type="file"
                  name="image1"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 0)}
                  className="hidden"
                />

                {uploadingStates[0] && (
                    <p className="mt-2 text-sm text-green-600">Uploading...</p>
                )}
                </div>



                <div className="mb-6">
                <label className="block font-semibold mb-1">Product Image 2</label>
                <p className="text-sm text-gray-500 mb-2">
                    Upload a clear, high-quality image (max 20MB). This is what buyers will see first!
                </p>

                <label
                    htmlFor="imageUpload2"
                    className="flex items-center justify-center h-50 sm:h-70 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-green-500 transition"
                >
                    {formData?.images[1]?.url ? (
                    <img
                        src={formData.images[1].url}
                        alt="Product Preview"
                        className="object-cover h-full w-full rounded-md"
                    />
                    ) : (
                    <span className="text-gray-500 text-sm">Click to upload product image</span>
                    )}
                </label>

                <input
                id="imageUpload2"
                type="file"
                name="image2"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 1)}
                className="hidden"
              />

                {uploadingStates[1] && (
                    <p className="mt-2 text-sm text-green-600">Uploading...</p>
                )}
                </div>


                <div className="mb-6">
                <label className="block font-semibold mb-1">Product Image 3 </label>
                <p className="text-sm text-gray-500 mb-2">
                    Upload a clear, high-quality image (max 20MB). This is what buyers will see first!
                </p>

                <label
                    htmlFor="imageUpload3"
                    className="flex items-center justify-center h-50 sm:h-70 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-green-500 transition"
                >
                    {formData?.images[2]?.url ? (
                    <img
                        src={formData.images[2].url}
                        alt="Product Preview"
                        className="object-cover h-full w-full rounded-md"
                    />
                    ) : (
                    <span className="text-gray-500 text-sm">Click to upload product image</span>
                    )}
                </label>

                <input
                  id="imageUpload3"
                  type="file"
                  name="image3"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 2)}
                  className="hidden"
                />

                {uploadingStates[2] && (
                    <p className="mt-2 text-sm text-green-600">Uploading...</p>
                )}
                </div>


            <button type="submit"  disabled={addProductMutation.isPending || uploadingStates.some(Boolean) } className={`rounded w-full font-semibold text-lg ${addProductMutation.isPending  ? "bg-green-500 cursor-not-allowed text-white " : "bg-green-600 hover:bg-green-500 cursor-pointer text-white"} py-2 mt-5 text-center `} >
              {addProductMutation.isPending ? "Adding..." : "Add Product"}
            </button>
        </form>
      </div>

    </div>    
        
    </>
  )
}

export default AddProductPage

 
