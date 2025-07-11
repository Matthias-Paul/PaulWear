import pic from "../../assets/pic.jpg";
import toast from "react-hot-toast";
import ProductDetailGrid from "./ProductDetailGrid";
import { useParams, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { useSelector } from "react-redux";



const ProductsDetails = () => {
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const queryClient = useQueryClient();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const [imageTransitionKey, setImageTransitionKey] = useState(0);
  
  const navigate = useNavigate();

    const { loginUser, guestId } = useSelector((state) => state.user);


  const handleQuantityChange = (action) => {
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    if (action === "plus") setQuantity((prev) => prev + 1);
  };



  const fetchSimilarProducts = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/similar/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch similar products");
    }
    return res.json();
  };

  const { data: similarProductData } = useQuery({
    queryKey: ["similarProducts", id],
    queryFn: fetchSimilarProducts,
  });

  useEffect(() => {
    if (similarProductData) {
      setSimilarProducts(similarProductData.similarProduct);
      console.log("similarProducts:", similarProductData.similarProduct);
    }
  }, [similarProductData]);

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

      if (
        data.product?.colors?.length === 1 &&
        data.product.colors[0].toLowerCase() === "general"
      ) {
        setSelectedColor("General");
      }
  
      if (
        data.product?.sizes?.length === 1 &&
        data.product.sizes[0].toLowerCase() === "general"
      ) {
        setSelectedSize("General");
      }
    }
  }, [data]);


  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[mainImageIndex]?.url);
    }
  }, [mainImageIndex, selectedProduct]);
  
const touchStartRef = useRef(null);

const handleSlide = (direction) => {
  if (!selectedProduct?.images?.length) return;
  const total = selectedProduct.images.length;

  setSlideDirection(direction);
  setMainImageIndex((prev) => {
    let newIndex;
    if (direction === "next") {
      newIndex = (prev + 1) % total;
    } else if (direction === "prev") {
      newIndex = (prev - 1 + total) % total;
    } else {
      newIndex = prev;
    }

    setImageTransitionKey((prevKey) => prevKey + 1); 
    return newIndex;
  });
};


const handleTouchStart = (e) => {
  touchStartRef.current = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
  const endX = e.changedTouches[0].clientX;
  const startX = touchStartRef.current;

  if (startX - endX > 50) handleSlide("next");
  else if (endX - startX > 50) handleSlide("prev");
};

  

  console.log(selectedColor);

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

  return (
    <>
      <div className="mx-auto pt-[100px] sm:pt-[110px] px-[12px] max-w-[1400px]  bg-white ">
        <div className="mx-auto max-w-6xl" >

          {
            selectedProduct ? (
               <div className="flex flex-col md:flex-row ">
          {/* Left thumb nails */}

          <div className="hidden md:flex flex-col gap-y-4 mr-6">
            {selectedProduct?.images?.map((image) => (
              <img
              key={image?.url}

              onClick={() => {
                const index = selectedProduct?.images?.findIndex((img) => img.url === image.url);
                if (index !== -1) setMainImageIndex(index);
              }}
                className={` ${
                  mainImage === image?.url
                    ? "border-black border-3"
                    : "border-none"
                } w-20 h-20 cursor-pointer rounded-lg border object-cover flex-shrink-0 `}
              
                src={image?.url || null}
                alt="Thumbnail image"
              />
            ))}
          </div>

          {/* Main image */}
          <div className="md:w-1/2  ">
          <div
            key={imageTransitionKey}
            className={`relative w-full h-[450px] sm:h-[700px] overflow-hidden transition-all duration-500 ease-in-out transform 
              ${slideDirection === "next" ? "animate-slide-left" : "animate-slide-right"}`}
          >
            <img
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
              src={mainImage}
              alt="main product image"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
          </div>
          </div>

          {/* mobile thumbnail         */}

          <div className=" flex md:hidden overscroll-x-scroll gap-x-4 md:gap-x-0 gap-y-4 mr-6">
            {selectedProduct?.images?.map((image) => (
              <img
              key={image?.url}

              onClick={() => {
                const index = selectedProduct?.images?.findIndex((img) => img.url === image.url);
                if (index !== -1) setMainImageIndex(index);
              }}
                className={` ${
                  mainImage === image?.url
                    ? "border-black border-3"
                    : "border-none"
                } w-20 h-20 cursor-pointer rounded-lg border object-cover flex-shrink-0 `}
               
                src={image?.url || null}
                alt="Thumbnail image"
              />
            ))}
          </div>

          {/*  Right section */}

          <div className="md:w-1/2 md:ml-5 ">
            <h2 className="  text-2xl sm:text-3xl font-semibold mt-2 md:mt-[-5px]   mb-2 ">
              {" "}
              {selectedProduct?.name}{" "}
            </h2>
            <p className={`text-lg text-gray-600 mb-1  `}>
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
                                <p className="text-gray-600 ">General (No specific color)</p>
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
                  <p className="text-gray-600 ">General (No specific size)</p>
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
              <h2 className=" text-xl font-bold mb-2 "> Vendor Info </h2>
              <table className="w-full text-left text-gray-600   ">
                <tbody>
                  <tr>
                    <td className="py-1">Store Name: </td>
                    <td className="py-1"> {selectedProduct?.vendorStoreName} </td>
                  </tr>
                  <tr>
                    <td className="py-1">Store Email: </td>
                    <td className="py-1"> {selectedProduct?.vendorStoreEmail} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
            ):(
              isLoading ? (
            <div className=" text-gray-500 text-xl px-4 text-center" > Loading product details... </div>
          ):(
          <div className=" text-gray-500 text-xl px-4 text-center" >
            No product details found!
          </div>
          )

            )
          }
       
     
        </div>

        <div className="mt-6   ">
          {
            similarProducts.length >= 1 && (
              <div>    
                <h2 className="text-xl sm:text-2xl mx-[25px] text-center mb-4 font-medium  ">
                  {" "}
                  Check Out Similar Products
                </h2>
                <ProductDetailGrid  products={similarProducts} />
              </div>  
            )
          }
        </div>
      </div>
    </>
  );
};




export default ProductsDetails;
