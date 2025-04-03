import pic from "../../assets/pic.jpg"
import {FiChevronLeft, FiChevronRight} from "react-icons/fi"
import { Link } from "react-router-dom"
import { useRef, useState, useEffect } from "react"

const NewArrival = () => {
        const scrollRef = useRef(null)
        const [isDragging, setIsDragging] = useState(false)
        const [startX, setStartX] = useState(0)
        const [scrollLeft, setScrollLeft] = useState(false)
        const [canScrollRight, setCanScrollRight] = useState(false)
        const [canScrollLeft, setCanScrollLeft] = useState(false)

         const scroll = (direction)=>{
            const scrollAmount = direction ==="left"? -300 : 300
            scrollRef.current.scrollBy({left: scrollAmount, behaviour:"smooth" }) 
         }   

        const updateScrollButtons =()=>{
            const container = scrollRef.current
            if(container){
                const leftScroll = container.scrollLeft
                const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth


                    setCanScrollLeft(leftScroll > 0)
                    setCanScrollRight(rightScrollable)
            }

        }
useEffect(() => {
    const container = scrollRef.current;
    if (container) {
        container.addEventListener("scroll", updateScrollButtons);
        return () => {
            container.removeEventListener("scroll", updateScrollButtons);
        };
    }
}, []);

     const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft); 
};

const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
};

const handleMouseUpOrLeave = () => {
    setIsDragging(false);
};


  return (
    <>
      <div className=" container mx-auto text-center relative mb-4   "  >
        <h1  className=" text-2xl sm:text-3xl font-bold my-4 "> Check out our new arrivals </h1> 
        <p className="text-gray-600 text-sm mb-5 "> Discover new arrivals from top brands, featuring stylish designs, innovative features, and unbeatable prices, every day! </p>
       
        {/* scroll button */}

        <div className="absolute top-28 right-0  flex gap-x-2 " >
        <button onClick={()=> scroll("left")} disabled={!canScrollLeft} 
        className={`p-2 cursor-pointer rounded border ${canScrollLeft? "bg-white text-black ": "bg-gray-200 text-gray-400  cursor-not-allowed "}  `}>
            < FiChevronLeft   />
        </button> 
         <button onClick={()=> scroll("right")} disabled={!canScrollRight} 
        className={`p-2 cursor-pointer rounded border ${canScrollRight? "bg-white text-black ": "bg-gray-200 text-gray-400  cursor-not-allowed "}  `}>
            < FiChevronRight />
        </button> 

        </div>  
  
            {/* Scrollable content */}

            <div ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
             onMouseLeave={handleMouseUpOrLeave}

            className={`container w-full mt-23  mb-10 overflow-x-scroll flex gap-x-5  mx-auto ${isDragging ? "cursor-dragging":  "cursor-default" }   `} >
                {
                    newArrivalProducts?.map((product)=>(
                        <div className="flex  w-full min-w-[100%] sm:min-w-[50%] lg:min-w-[33%]  relative   " key={product?._id} >
                                <img draggable={false} className="w-full rounded-md h-[500px]  flex-shrink-0 object-cover   " alt={product?.name} src={product?.image} />
                                <div className="rounded-b-lg absolute font-medium text-start p-2 bg-opacity-50 text-white backdrop-blur-md bottom-0 right-0 left-0 ">
                                    <Link to={`/products/${product?._id}`}>
                                    <h1 className=" text-lg "> {product?.name} </h1>
                                    <div className="" >${product?.price} </div>
                                    </Link>
                                     </div>

                         </div>   
                    ))
                }

            </div>   

      </div>  
    </>
  )
}
const newArrivalProducts = [
    {
        _id:1,
        name:"Stylish Jacket",
        image:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594440/pexels-shvetsa-3851165_gats0j.jpg",
        price:120,
    },
        {
        _id:2,
        name:"Stylish Jacket",
        image:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594436/pexels-3086634-11981253_pvriwb.jpg",
        price:120,
    },
        {
        _id:3,
        name:"Stylish Jacket",
        image:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594445/pexels-alipazani-2584278_agoj54.jpg",
        price:120,
    },
        {
        _id:4,
        name:"Stylish Jacket",
        image:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594421/pexels-cottonbro-6626903_r6e1at.jpg",
        price:120,
    },
        {
        _id:5,
        name:"Stylish Jacket",
        image:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594427/pexels-cottonbro-7026789_twwzye.jpg",
        price:120,
    },
        {
        _id:6,
        name:"Stylish Jacket",
        image:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594356/pexels-pixabay-157675_dwkqad.jpg",
        price:120,
    },
        {
        _id:7,
        name:"Stylish Jacket",
        image:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1743594343/pexels-aj4xo-31401795_m7agcm.jpg",
        price:120,
    },
]
export default NewArrival
