
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";



const BestProduct = () => {
 const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { loginUser, guestId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleQuantityChange = (action) => {
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    if (action === "plus") setQuantity((prev) => prev + 1);
  };

 

  const fetchBestSeller = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/best-seller`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch similar products");
    }
    return res.json();
  };

  const { data: bestProductData, isLoading } = useQuery({
    queryKey: ["bestProduct"],
    queryFn: fetchBestSeller,
  });

  useEffect(() => {
    if (bestProductData) {
      setSelectedProduct(bestProductData.bestSeller);
      setMainImage(bestProductData.bestSeller.images?.[0]?.url || pic);
      console.log("bestProducts:", bestProductData.bestSeller);

      
      if (
        bestProductData?.bestSeller?.colors?.length === 1 &&
        bestProductData?.bestSeller?.colors[0].toLowerCase() === "general"
      ) {
        setSelectedColor("General");
      }
  
      if (
        bestProductData?.bestSeller?.sizes?.length === 1 &&
        bestProductData?.bestSeller.sizes[0].toLowerCase() === "general"
      ) {
        setSelectedSize("General");
      }

    }
  }, [bestProductData]);
    const addToCartMutation = useMutation({
    mutationFn: async ()=>{
  
     setIsButtonDisabled(true);
      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            productId: selectedProduct._id,
            userId: loginUser?.id,
            guestId,
            color:selectedColor,
            size:selectedSize, 
            quantity
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
      toast.success(data.message);
      setIsButtonDisabled(false);
      console.log("Product:", data.product);
      const key = loginUser?.id
      ? ["cart", "user", loginUser.id]
      : ["cart", "guest", guestId];

    queryClient.invalidateQueries(key);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsButtonDisabled(false);
    },

  })



  const handleAddToCart = () => {
    addToCartMutation.mutate();

  };
 
    if (isLoading) {
    return (
      <div className=" text-gray-500 text-xl px-4 text-center" > Loading best product... </div>
    );
  }

  return (
    <>
      <div className="mx-auto  px-[12px] max-w-[1400px]  bg-white ">
        <div className="mx-auto max-w-6xl" >
          <h2 className="  text-2xl sm:text-3xl font-bold text-center my-15 ">
              Best Product
            </h2>
        <div className="flex flex-col md:flex-row ">
          {/* Left thumb nails */}
         
          <div className="hidden md:flex flex-col gap-y-4 mr-6">
            {selectedProduct?.images?.map((image) => (
              <img
              key={image?.url}

                onClick={() => setMainImage(image?.url)}
                className={` ${
                  mainImage === image?.url
                    ? "border-black border-3"
                    : "border-none"
                } w-20 h-20 cursor-pointer rounded-lg border object-cover flex-shrink-0 `}
              
                src={image.url}
                alt="Thumbnail image"
              />
            ))}
          </div>

          {/* Main image */}
          <div className="md:w-1/2  ">
            <div className=" mb-4  ">
              <img
                className="rounded-md w-full h-[600px] sm:h-[700px] object-cover flex-shrink-0  "
                src={mainImage}
                alt="main product image"
              />
            </div>
          </div>

          {/* mobile thumbnail         */}

          <div className=" flex md:hidden overscroll-x-scroll gap-x-4 md:gap-x-0 gap-y-4 mr-6">
            {selectedProduct?.images?.map((image) => (
              <img
              key={image.url}

                onClick={() => setMainImage(image?.url)}
                className={` ${
                  mainImage === image.url
                    ? "border-black border-3"
                    : "border-none"
                } w-20 h-20 cursor-pointer rounded-lg border object-cover flex-shrink-0 `}
               
                src={image.url}
                alt="Thumbnail image"
              />
            ))}
          </div>

          {/*  Right section */}

          <div className="md:w-1/2 md:ml-5 ">
            <h2 className="  text-2xl sm:text-3xl font-semibold mt-2 md:mt-0   mb-2 ">
              {" "}
              {selectedProduct?.name}{" "}
            </h2>
            <p className={`text-lg text-gray-600 mb-1   `}>
              {" "}
              {selectedProduct?.price && `₦${selectedProduct.price.toLocaleString()}`}{" "}
            </p>
           
            <p className=" text-gray-600 mb-4  ">
              {" "}
              {selectedProduct?.description}{" "}
            </p>




            <div className="mb-4" >
                <p className="text-gray-700  ">Category: </p>
              <p className=" text-gray-600 mb-4  ">
                {" "}
                {selectedProduct?.category}{" "}
              </p>

            </div> 

            {selectedProduct?.colors?.length === 1 && selectedProduct.colors[0] === "General" ? (
                              <div className="mb-4">
                                <p className="text-gray-700">Color:</p>
                                <p className="text-gray-600 mt-2">General (No specific color)</p>
                              </div>
                            ) : (
                              <div className="mb-4">
                                <p className="text-gray-700">Color:</p>
                                <div className="mt-2 flex gap-2">
                                  {selectedProduct?.colors?.map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => setSelectedColor(color)}
                                      style={{
                                        backgroundColor: color.toLowerCase(),
                                        filter: "brightness(0.5)",
                                      }}
                                      className={`w-8 h-8 cursor-pointer ${
                                        selectedColor === color ? "border-4 border-black" : ""
                                      } rounded-full border border-gray-500`}
                                    ></button>
                                  ))}
                                </div>
                              </div>
                            )}

                          

              {selectedProduct?.sizes?.length === 1 && selectedProduct.sizes[0] === "General" ? (
                <div className="mb-4">
                  <p className="text-gray-700">Size:</p>
                  <p className="text-gray-600 mt-2">General (No specific size)</p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-gray-700">Size:</p>
                  <div className="mt-2 flex gap-2">
                    {selectedProduct?.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border cursor-pointer ${
                          selectedSize === size ? "bg-black text-white" : ""
                        } rounded px-4 py-2`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}


            <div className="mb-4">
              <p className="text-gray-700  ">Quantity: </p>
              <div className="mt-2 flex items-center gap-x-2 ">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="text-xl font-medium bg-gray-300 cursor-pointer px-3 py-1 border rounded "
                >
                  {" "}
                  -{" "}
                </button>
                <span className="mx-4 text-xl "> {quantity} </span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="text-xl font-medium bg-gray-300 cursor-pointer px-3 py-1 border rounded "
                >
                  {" "}
                  +{" "}
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`${
                isButtonDisabled ? "cursor-not-allowed opacity-50 " : "  "
              }  w-full transition hover:bg-gray-800 text-white py-2 bg-black my-4 cursor-pointer rounded-md font-semibold text-lg `}
            >
              {" "}
              Add To Cart{" "}
            </button>

            <div className=" mt-4 text-gray-700 ">
              <h2 className=" text-xl font-bold mb-2 "> Vendor Info: </h2>
              <table className="w-full text-left text-gray-600   ">
                <tbody>
                  <tr>
                    <td className="py-1"> Store Name </td>
                    <td className="py-1"> {selectedProduct?.vendorStoreName} </td>
                  </tr>
                  <tr>
                    <td className="py-1"> Email </td>
                    <td className="py-1"> {selectedProduct?.vendorStoreEmail} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
     
        </div>

      </div>
    </>
  );
};




export default BestProduct;
