import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import {  useNavigate, useParams, Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa";


const VendorEditProductPage = () => {
      const navigate = useNavigate();
      const {id} = useParams()
      const [selectedProduct, setSelectedProduct] = useState(null);

      console.log(id)
    const [ isUploading, setIsUploading] = useState(null)
    const [formData, setFormData] = useState({
        name:"",
        description:"",
        images:[
            {
                url:""
            },
        ],
        price:"",
        category:"",
        sizes:[],
        colors:[], 
        gender:""       
    })






    const fetchProductDetails = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }
        return res.json();
      };
    
      const { data, isLoading } = useQuery({
        queryKey: ["selectedProduct", id],
        queryFn: fetchProductDetails,
      });
    
      useEffect(() => {
        if (data) {
          setSelectedProduct(data.product);

          console.log("productDetails:", data.product);

          setFormData({
            name: data.product.name || "",
            description: data.product.description || "",
            images: data.product.images || [{ url: "" }],
            price: data.product.price || "",
            category: data.product.category || "",
            sizes: data.product.sizes || [],
            colors: data.product.colors || [],
            gender: data.product.gender || ""
          });
        }

        }, [data]);
    
    










    const handleChange =(e) =>{
        const { name, value } = e.target

        setFormData((prevData) => ({...prevData, [name]: value }))

    }

        const handleImageUpload = async (e, fieldName) => {
            const file = e.target.files[0];

            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            setIsUploading(true)
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
                });

                if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Image upload failed");
                  setIsUploading(false)

                }

                const data = await res.json();
                console.log("Uploaded image URL:", data.imageUrl);

                setFormData((prevData) => ({
                ...prevData,
                images: [{ url: data.imageUrl }],
                }));
                setIsUploading(false)
            } catch (error) {
                console.error("Image upload error:", error.message);
                toast.error(error.message)
                  setIsUploading(false)

            }
            };

            const categoriesWithoutSizesOrColors = [
                "Foodstuff And Provisions",
                "Health and Personal Care Products",
                "Baked Goods And Snacks",
                "Others"
              ];
              
    const addProductMutation = useMutation({
    mutationFn: async (preparedData)=>{
  
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(preparedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to edit product ");
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
        images:[
            {
                url:""
            },
        ],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.images[0]?.url) {
        toast.error("Please upload a product image.");
        return;
      }
    const preparedData = { ...formData };
  
    if (categoriesWithoutSizesOrColors.includes(formData.category)) {
      preparedData.sizes = ["General"];
      preparedData.colors = ["General"];
    }
  
    addProductMutation.mutate(preparedData);
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
        <div className=" max-w-5xl mx-auto shadow-md rounded-md mb-30 pr-[12px]  pb-7 mx-auto " >
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900 " > Edit Product </h1>
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
                <select value={formData.category} onChange={(e)=> setFormData((prev)=>({ ...prev, category:e.target.value }) )} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " >
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
                <select value={formData.gender} onChange={(e)=> setFormData((prev)=>({ ...prev, gender:e.target.value }) )} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " >
                    <option value="" > Select gender </option>
                    <option value="Men" >Men </option>
                    <option value="Women" > Women </option>
                    <option value="Unisex" > Unisex </option>

                </select>
           </div>

            

           <div className="mb-6">
                <label className="block font-semibold mb-1">Product Image</label>
                <p className="text-sm text-gray-500 mb-2">
                    Upload a clear, high-quality image (max 20MB). This is what buyers will see first!
                </p>

                <label
                    htmlFor="imageUpload"
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
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "images")}
                    className="hidden"
                />

                {isUploading && (
                    <p className="mt-2 text-sm text-green-600">Uploading...</p>
                )}
                </div>



            <button type="submit"  disabled={addProductMutation.isPending || isUploading } className={`rounded w-full font-semibold text-lg ${addProductMutation.isPending  ? "bg-green-500 cursor-not-allowed text-white " : "bg-green-600 hover:bg-green-500 cursor-pointer text-white"} py-2 mt-5 text-center `} >
              {addProductMutation.isPending ? "Editing..." : "Edit Product"}
            </button>
        </form>
      </div>

    </div>    
        
    </>
  )
}

export default VendorEditProductPage

 


