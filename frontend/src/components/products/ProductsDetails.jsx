import pic from "../../assets/pic.jpg";
import toast from "react-hot-toast";
import ProductGrid from "./ProductGrid";

import { useState, useEffect } from "react";

const similarProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    image:pic  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    image:pic  },
  {
    _id: 3,
    name: "Product 3",
    price: 100,
    image:pic  },
  {
    _id: 4,
    name: "Product 4",
    price: 100,
    image:pic  },
];

const ProductsDetails = () => {
  const [mainImage, setMainImage] = useState(selectedProduct?.images[0]?.url);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedProduct?.images?.url > 0) {
      setMainImage(selectedProduct?.images[0]?.url);
    }
  }, []);

  const handleQuantityChange = (action) => {
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    if (action === "plus") setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and size before adding to cart!");
    }

    // setIsButtonDisabled(true)
  };

  return (
    <>
      <div className="mx-auto mt-10 max-w-[1400px]  bg-white ">
        <div className="mx-auto max-w-6xl" >
        <div className="flex flex-col md:flex-row ">
          {/* Left thumb nails */}

          <div className="hidden md:flex flex-col gap-y-4 mr-6">
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
            <p className="text-lg text-gray-600 mb-1 line-through  ">
              {" "}
              {selectedProduct?.original && `$${selectedProduct.original}`}{" "}
            </p>
            <p className="text-xl text-gray-500 mb-2  ">
              {" "}
              {selectedProduct?.price && `$${selectedProduct.price}`}{" "}
            </p>
            <p className=" text-gray-600 mb-4  ">
              {" "}
              {selectedProduct?.description}{" "}
            </p>
            <div className="mb-4">
              <p className="text-gray-700  ">Color: </p>
              <div className="mt-2 flex gap-2  ">
                {selectedProduct.colors.map((color) => (
                  <button
                  key={color}

                    onClick={() => setSelectedColor(color)}
                    style={{
                      backgroundColor: color.toLocaleLowerCase(),
                      filter: "brightness(0.5)",
                    }}
                    className={`w-8 h-8 cursor-pointer ${
                      selectedColor === color ? " border-3 border-black" : ""
                    } rounded-full border border-gray-500 `}
                    
                  ></button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700  ">Size: </p>
              <div className="mt-2 flex gap-2  ">
                {selectedProduct.sizes.map((size) => (
                  <button
                  key={size}
 
                    onClick={() => setSelectedSize(size)}
                    className={` border cursor-pointer ${
                      selectedSize === size ? " bg-black text-white" : ""
                    } rounded px-4 py-2  `}
             
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

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

            <div className=" mt-6 text-gray-700 ">
              <h2 className=" text-xl font-bold mb-4 "> Characteristics: </h2>
              <table className="w-full text-left text-gray-600   ">
                <tbody>
                  <tr>
                    <td className="py-1"> Brand </td>
                    <td className="py-1"> {selectedProduct.brand} </td>
                  </tr>
                  <tr>
                    <td className="py-1"> Material </td>
                    <td className="py-1"> {selectedProduct.material} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
     
        </div>

        <div className="mt-12   ">
          <h2 className=" text-2xl mx-[25px] text-center mb-4 font-medium  ">
            {" "}
            You Might Want To Check This Out Too
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </>
  );
};


const selectedProduct = {
  name: "Stylish Jacket",
  price: 120,
  original: 150,
  description: "This is a stylish jacket perfect for any occassion",
  brand: "FashionBrand",
  material: "Leather",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Red", "Black"],
  images: [
    {
      url: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594335/pexels-godisable-jacob-226636-952629_hiidb5.jpg",
    },
    {
      url: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594356/pexels-pixabay-157675_dwkqad.jpg  ",
    },
  ],
};

export default ProductsDetails;
