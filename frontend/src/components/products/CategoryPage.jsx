import SortOptions from "./SortOptions";
import pic from "../../assets/pic.jpg";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import ProductGrid from "./ProductGrid";



const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    console.log("Category:", category);
  }, [category]);


  const fetchProducts = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/product/category?${searchParams.toString()}&page=${pageParam}&limit=12`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    console.log(`${import.meta.env.VITE_BACKEND_URL}/api/product/category?${searchParams.toString()}&page=${pageParam}&limit=12`)
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products", searchParams.toString()],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });

  // Flatten paginated product data
  const products = data?.pages.flatMap((page) => page.categoryProducts) || [];










  return (
    <>
        <div className="max-w-[1400px] mb-[80px] px-[12px] " >          
            
            <div className=" pt-[95px] sm:pt-[104px]  " >
            <SortOptions />
            </div>

        <div className="max-w-[1400px] pt-[30px] mx-auto " >
        {category === "Fashion And Apparel" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752938132/xzbafunsvzu5rzcp17a3.jpg"
              title="Fashion And Apparel"
              description="Step into style with the latest trends for every season"
            />
          )}
          {category === "Hair And Beauty Products" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752938099/gedxx26dldgavk3dg7ri.jpg"
              title="Hair And Beauty Products"
              description="Everything you need to look and feel your best"
            />
          )}
          {category === "Bags And Accessories" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752938053/h78im7vvzfnejekpq0ea.jpg"
              title="Bags And Accessories"
              description="Complete your outfit with perfect bags and timeless accessories"
            />
          )}
          {category === "Baked Goods And Snacks" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752937997/calg8o5jcthiagtmcg0u.jpg"
              title="Baked Goods And Snacks"
              description="Freshly made treats and snacks you'll crave all day"
            />
          )}
          {category === "Electronics And Gadgets" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752937903/bpvuraqrkngywtkiqpra.jpg"
              title="Electronics And Gadgets"
              description="Shop phones, laptops, and the latest tech gadgets at unbeatable prices"
            />
          )}
          {category === "Foodstuff And Provisions" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752937842/u9ta2u0jbmzt0i3kozpj.jpg"
              title="Foodstuff And Provisions"
              description="Your everyday kitchen essentials, always within reach"
            />
          )}
          {category === "Health and Personal Care Products" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752927083/eriqxj0iwoc9q5cth9ik.jpg"
              title="Health and Personal Care Products"
              description="Care for your body, mind, and wellness — daily"
            />
          )}
          {category === "Others" && (
            <CategoryBanner
              image="https://res.cloudinary.com/drkxtuaeg/image/upload/v1752926967/tqibon9nib934ivygibt.jpg"
              title="Others"
              description="Practical Finds You Didn’t Know You Needed"
            />
          )}


          {isLoading ? (
              <div className="text-center my-10 text-gray-600">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-lg xl:text-xl my-10 font-semibold text-center text-gray-600">
                No products found!
              </div>
              
            ) : (
              
              <div>
                <h2 className="text-lg xl:text-2xl font-bold text-center mt-10 uppercase">
                  Available Products
                </h2>
                <p className="text-center sm:px-[20px] text-gray-600 mt-2 text-md sm:text-lg">
                  Shop the Best in {category}
                </p>
                 
                <ProductGrid products={products} isLoading={isLoading} />
              </div>
            )}



            {hasNextPage && (
              <div className="flex justify-center items-center">
                <button
                  className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 my-10 text-white cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
              </div>
            )}
        </div>    


        </div>    
    </>
  )
}


const CategoryBanner = ({ image, title, description }) => (
    <div>
  <div className="relative text-white object-cover flex-shrink-0 max-w-[1400px] mb-[15px]">
    <img
      src={image}
    className="rounded-md sm:rounded-xl w-full max-w-[1400px] max-h-[300px] sm:max-h-[450px] min-h-[220px] object-cover"
      alt={title}
    />
    <div className="absolute inset-0 rounded-md sm:rounded-xl bg-black opacity-50"></div>

    <div className="absolute font-bold px-[12px] md:px-[25px] inset-0 flex flex-col text-white justify-center items-start text-start">
      <h1 className="text-2xl max-w-[800px] md:text-4xl leading-[35px] sm:leading-[60px] tracking-tighter uppercase">
        {title}
      </h1>
      <p className="text-sm sm:text-xl max-w-[900px]">
        {description}
      </p>
    </div>
  </div>
  </div>
);

export default CategoryPage