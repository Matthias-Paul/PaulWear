import pic from "../../assets/pic.jpg"
import {FiChevronLeft, FiChevronRight} from "react-icons/fi"
import { Link } from "react-router-dom"
import { useRef, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import SkeletonLoading from "./SkeletonLoading";
import useResponsiveSkeletonCount from './useResponsiveSkeletonCount';

const NewArrival = ({newArrivals, isLoading, text}) => {
        const scrollRef = useRef(null)
        const [isDragging, setIsDragging] = useState(false)
        const [startX, setStartX] = useState(0)
        const [scrollLeft, setScrollLeft] = useState(false)
        const [canScrollRight, setCanScrollRight] = useState(false)
        const [canScrollLeft, setCanScrollLeft] = useState(false)

         const skeletonCount = useResponsiveSkeletonCount();
         const skeletonArray = Array.from({ length: skeletonCount });

        
     


         const scroll = (direction)=>{
            const scrollAmount = direction ==="left"? -320 : 320
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
                if (!container) return;

                updateScrollButtons();

                container.addEventListener("scroll", updateScrollButtons);

                window.addEventListener("resize", updateScrollButtons);

                return () => {
                    container.removeEventListener("scroll", updateScrollButtons);
                    window.removeEventListener("resize", updateScrollButtons);
                };
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
      <div className=" container  px-3 mx-auto text-center relative mb-4   "  >
        <h1  className=" text-2xl sm:text-3xl font-bold mb-3 mt-8 ">Latest Products </h1> 
        <p className="text-gray-600 text-sm md:text-lg "> Don’t miss the freshest additions from our {text}, updated regularly! </p>
       
        {/* scroll button */}

        <div className="absolute top-23 right-0 mr-3  flex gap-x-2 " >
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

            className={`container w-full mt-18  mb-10 overflow-x-scroll flex gap-x-5  mx-auto ${isDragging ? "cursor-dragging":  "cursor-default" }   `} >
                {
                    isLoading? skeletonArray.map((_, i) => <SkeletonLoading key={i} />):newArrivals?.map((product)=>(
                        <div className="flex  w-full min-w-[100%] sm:min-w-[50%] lg:min-w-[33%]  relative   " key={product?._id} >
                                <img draggable={false} className="w-full rounded-md h-[500px]  flex-shrink-0 object-cover   " alt={product?.name} src={product?.images[0].url} />
                                <div className="rounded-b-lg absolute font-medium text-start p-2 opacity-80 bg-black text-white backdrop-blur-md bottom-0 right-0 left-0 ">
                                    <Link to={`/product/${product?._id}`}>
                                    <h1 className=" text-lg truncate "> {product?.name} </h1>
                                    <div className="" >₦{product?.price.toLocaleString()} </div>
                                     <div className="mt-3 flex items-center gap-2">
                                        <img
                                        src={product?.vendorStoreLogo}
                                        alt={product?.vendorStoreName}
                                        className="h-6 w-6 rounded-full flex-shrink-0 object-cover"
                                        />
                                        <span className="text-md text-white truncate ">
                                        {product?.vendorStoreName}
                                        </span>
                                    </div>
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

export default NewArrival
