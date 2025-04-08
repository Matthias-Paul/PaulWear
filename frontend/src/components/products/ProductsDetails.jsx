import pic from "../../assets/pic.jpg"
import pic2 from "../../assets/pic2.jpg"
import toast from "react-hot-toast";
import ProductGrid from "./ProductsDetails"
import { useState, useEffect } from "react"

// Moved `similarProducts` and `selectedProduct` above the component
const similarProducts = [
    {
        _id: 1,
        name: "Product 1",
        price: 100,
        image:pic,
    },
    {
        _id: 2,
        name: "Product 2",
        price: 100,
        image:pic,
    },
    {
        _id: 3,
        name: "Product 3",
        price: 100,
        image:pic,
    },
    {
        _id: 4,
        name: "Product 4",
        price: 100,
        image:pic,
    }
]

const selectedProduct = {
    name: "Stylish Jacket",
    price: 120,
    original: 150,
    description: "This is a stylish jacket perfect for any occasion",
    brand: "FashionBrand",
    material: "Leather",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Black"],
    images: [
        {
        url:pic,
        },
        {
        url:pic2,
        }
    ]
}

const ProductsDetails = () => {
    const [mainImage, setMainImage] = useState(selectedProduct?.images[0]?.url)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct?.images[0]?.url)
        }
    }, [selectedProduct])

    const handleQuantityChange = (action) => {
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1)
        if (action === "plus") setQuantity((prev) => prev + 1)
    }

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select a color and size before adding to cart!")
        }
        // setIsButtonDisabled(true)
    }

    return (
        <>
            <div className="mx-auto mt-10 max-w-6xl bg-white">
                <div className="flex flex-col md:flex-row">
                    {/* Left thumb nails */}
                    <div className="hidden md:flex flex-col gap-y-4 mr-6">
                        {selectedProduct?.images?.map((image, index) => (
                            <img
                                key={index}
                                onClick={() => setMainImage(image?.url)}
                                className={` ${mainImage === image.url ? "border-black border-3" : "border-none"} w-20 h-20 cursor-pointer rounded-lg border object-cover flex-shrink-0`}
                                src={image.url}
                                alt="Thumbnail"
                            />
                        ))}
                    </div>

                    {/* Main image */}
                    <div className="md:w-1/2">
                        <div className="mb-4">
                            <img className="rounded-md w-full h-[550px] sm:h-[700px] object-cover" src={mainImage} alt="Main product" />
                        </div>
                    </div>

                    {/* Mobile thumbnail */}
                    <div className="flex md:hidden overscroll-x-scroll gap-x-4 gap-y-4 mr-6">
                        {selectedProduct?.images?.map((image, index) => (
                            <img
                                key={index}
                                onClick={() => setMainImage(image?.url)}
                                className={` ${mainImage === image.url ? "border-black border-3" : "border-none"} w-20 h-20 cursor-pointer rounded-lg border object-cover`}
                                src={image.url}
                                alt="Thumbnail"
                            />
                        ))}
                    </div>

                    {/* Right section */}
                    <div className="md:w-1/2 md:ml-5">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">{selectedProduct?.name}</h2>
                        <p className="text-lg text-gray-600 line-through">{selectedProduct?.original && `$${selectedProduct.original}`}</p>
                        <p className="text-xl text-gray-500 mb-2">{selectedProduct?.price && `$${selectedProduct.price}`}</p>
                        <p className="text-gray-600 mb-4">{selectedProduct?.description}</p>

                        <div className="mb-4">
                            <p className="text-gray-700">Color:</p>
                            <div className="mt-2 flex gap-2">
                                {selectedProduct.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedColor(color)}
                                        style={{ backgroundColor: color.toLowerCase(), filter: "brightness(0.5)" }}
                                        className={`w-8 h-8 cursor-pointer ${selectedColor === color ? "border-3 border-black" : ""} rounded-full border`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700">Size:</p>
                            <div className="mt-2 flex gap-2">
                                {selectedProduct.sizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(size)}
                                        className={`border cursor-pointer ${selectedSize === size ? "bg-black text-white" : ""} rounded px-4 py-2`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleAddToCart} disabled={isButtonDisabled} className={`${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""} w-full bg-black text-white py-2 rounded-md`}>
                            Add To Cart
                        </button>

                        <div className="mt-12">
                            <h2 className="text-2xl text-center font-medium">You Might Want To Check This Out Too</h2>
                            <ProductGrid products={similarProducts} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductsDetails
